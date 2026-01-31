-- FIELD Assist Database Schema
-- Voer dit script uit in de Supabase SQL Editor

-- Enable pgvector extension voor RAG/embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Profiles tabel (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  role TEXT CHECK (role IN ('vergunningverlener', 'toezichthouder', 'jurist', 'beleidsmedewerker')),
  organization TEXT,
  avatar_url TEXT,
  specializations TEXT[] DEFAULT '{}',
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gemeenten tabel
CREATE TABLE IF NOT EXISTS gemeenten (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  active_fielders INTEGER DEFAULT 0,
  contributions INTEGER DEFAULT 0,
  description TEXT
);

-- Gemeente Content tabel (templates, processen, handboeken, etc.)
CREATE TABLE IF NOT EXISTS gemeente_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gemeente_id TEXT REFERENCES gemeenten(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('process', 'template', 'handboek', 'contact', 'tip')) NOT NULL,
  title TEXT NOT NULL,
  content JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artikelen/Kennisbank tabel
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  source TEXT,
  read_time INTEGER,
  last_updated TIMESTAMP WITH TIME ZONE,
  embedding VECTOR(1536) -- OpenAI text-embedding-3-small dimension
);

-- Conversaties tabel
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  project_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Berichten tabel
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  citations JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projecten tabel
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('actief', 'afgerond', 'gepauzeerd')) DEFAULT 'actief',
  color TEXT,
  article_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project notities tabel
CREATE TABLE IF NOT EXISTS project_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Foreign key voor conversations.project_id (na projects tabel is aangemaakt)
ALTER TABLE conversations
  ADD CONSTRAINT fk_conversations_project
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;

-- Indexes voor betere performance
CREATE INDEX IF NOT EXISTS idx_gemeente_content_gemeente ON gemeente_content(gemeente_id);
CREATE INDEX IF NOT EXISTS idx_gemeente_content_type ON gemeente_content(type);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_project_notes_project ON project_notes(project_id);

-- Vector similarity search functie voor RAG
CREATE OR REPLACE FUNCTION match_articles(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id TEXT,
  title TEXT,
  summary TEXT,
  content TEXT,
  category TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    articles.id,
    articles.title,
    articles.summary,
    articles.content,
    articles.category,
    1 - (articles.embedding <=> query_embedding) AS similarity
  FROM articles
  WHERE articles.embedding IS NOT NULL
    AND 1 - (articles.embedding <=> query_embedding) > match_threshold
  ORDER BY articles.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Row Level Security (RLS) policies

-- Enable RLS op alle tabellen
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gemeenten ENABLE ROW LEVEL SECURITY;
ALTER TABLE gemeente_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_notes ENABLE ROW LEVEL SECURITY;

-- Profiles: gebruikers kunnen alleen hun eigen profiel zien/bewerken
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Gemeenten: iedereen kan lezen (public data)
CREATE POLICY "Anyone can view gemeenten"
  ON gemeenten FOR SELECT
  TO authenticated
  USING (true);

-- Gemeente content: iedereen kan lezen
CREATE POLICY "Anyone can view gemeente_content"
  ON gemeente_content FOR SELECT
  TO authenticated
  USING (true);

-- Articles: iedereen kan lezen
CREATE POLICY "Anyone can view articles"
  ON articles FOR SELECT
  TO authenticated
  USING (true);

-- Conversations: alleen eigen conversaties
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON conversations FOR DELETE
  USING (auth.uid() = user_id);

-- Messages: alleen berichten van eigen conversaties
CREATE POLICY "Users can view messages from own conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to own conversations"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- Projects: alleen eigen projecten
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- Project notes: alleen notities van eigen projecten
CREATE POLICY "Users can view notes from own projects"
  ON project_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_notes.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert notes to own projects"
  ON project_notes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_notes.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update notes from own projects"
  ON project_notes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_notes.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete notes from own projects"
  ON project_notes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_notes.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Trigger om automatisch een profile aan te maken bij nieuwe user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, created_at)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger als die al bestaat
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Maak trigger aan
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
