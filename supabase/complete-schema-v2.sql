-- FIELD Assist Complete Database Schema V2
-- Run this in Supabase SQL Editor
-- This version handles existing tables/policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  role TEXT DEFAULT 'vergunningverlener',
  organization TEXT,
  avatar_url TEXT,
  specializations TEXT[] DEFAULT '{}',
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================
-- 2. GEMEENTEN TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS gemeenten (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  provincie TEXT,
  inwoners INTEGER DEFAULT 0,
  active_fielders INTEGER DEFAULT 0,
  contributions INTEGER DEFAULT 0,
  description TEXT,
  color TEXT DEFAULT '#288978',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE gemeenten ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view gemeenten" ON gemeenten;
CREATE POLICY "Anyone can view gemeenten" ON gemeenten FOR SELECT USING (true);

INSERT INTO gemeenten (id, name, provincie, inwoners, active_fielders, contributions, color) VALUES
  ('rotterdam', 'Rotterdam', 'Zuid-Holland', 655000, 8, 47, '#288978'),
  ('amsterdam', 'Amsterdam', 'Noord-Holland', 882000, 12, 63, '#E63946'),
  ('utrecht', 'Utrecht', 'Utrecht', 361000, 5, 31, '#1D3557'),
  ('arnhem', 'Arnhem', 'Gelderland', 164000, 4, 22, '#F4A261'),
  ('zwijndrecht', 'Zwijndrecht', 'Zuid-Holland', 45000, 3, 12, '#0077B6')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 3. PROCESSEN TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS processen (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gemeente_id TEXT REFERENCES gemeenten(id),
  titel TEXT NOT NULL,
  beschrijving TEXT,
  stappen TEXT[] DEFAULT '{}',
  auteur_id UUID REFERENCES profiles(id),
  auteur_naam TEXT,
  vakgroep TEXT DEFAULT 'VTH',
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE processen ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view processen" ON processen;
DROP POLICY IF EXISTS "Authenticated users can insert processen" ON processen;
DROP POLICY IF EXISTS "Authors can update their processen" ON processen;

CREATE POLICY "Anyone can view processen" ON processen FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert processen" ON processen FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authors can update their processen" ON processen FOR UPDATE USING (auth.uid() = auteur_id);

-- =============================================
-- 4. TEMPLATES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gemeente_id TEXT REFERENCES gemeenten(id),
  titel TEXT NOT NULL,
  beschrijving TEXT,
  bestandstype TEXT DEFAULT 'DOCX',
  versie TEXT DEFAULT '1.0',
  auteur_id UUID REFERENCES profiles(id),
  auteur_naam TEXT,
  vakgroep TEXT DEFAULT 'VTH',
  tip TEXT,
  downloads INTEGER DEFAULT 0,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view templates" ON templates;
DROP POLICY IF EXISTS "Authenticated users can insert templates" ON templates;
DROP POLICY IF EXISTS "Authors can update their templates" ON templates;

CREATE POLICY "Anyone can view templates" ON templates FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert templates" ON templates FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authors can update their templates" ON templates FOR UPDATE USING (auth.uid() = auteur_id);

-- =============================================
-- 5. HANDBOEKEN TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS handboeken (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gemeente_id TEXT REFERENCES gemeenten(id),
  titel TEXT NOT NULL,
  beschrijving TEXT,
  paginas INTEGER DEFAULT 0,
  auteur_id UUID REFERENCES profiles(id),
  auteur_naam TEXT,
  downloads INTEGER DEFAULT 0,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE handboeken ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view handboeken" ON handboeken;
DROP POLICY IF EXISTS "Authenticated users can insert handboeken" ON handboeken;

CREATE POLICY "Anyone can view handboeken" ON handboeken FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert handboeken" ON handboeken FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- =============================================
-- 6. TIPS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gemeente_id TEXT REFERENCES gemeenten(id),
  tekst TEXT NOT NULL,
  auteur_id UUID REFERENCES profiles(id),
  auteur_naam TEXT,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE tips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view tips" ON tips;
DROP POLICY IF EXISTS "Authenticated users can insert tips" ON tips;
DROP POLICY IF EXISTS "Authors can update their tips" ON tips;

CREATE POLICY "Anyone can view tips" ON tips FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert tips" ON tips FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authors can update their tips" ON tips FOR UPDATE USING (auth.uid() = auteur_id);

-- =============================================
-- 7. CONTACTEN TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS contacten (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gemeente_id TEXT REFERENCES gemeenten(id),
  naam TEXT NOT NULL,
  functie TEXT,
  telefoon TEXT,
  email TEXT,
  wanneer_benaderen TEXT,
  toegevoegd_door_id UUID REFERENCES profiles(id),
  toegevoegd_door_naam TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE contacten ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view contacten" ON contacten;
DROP POLICY IF EXISTS "Authenticated users can insert contacten" ON contacten;

CREATE POLICY "Anyone can view contacten" ON contacten FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert contacten" ON contacten FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- =============================================
-- 8. CONVERSATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Nieuw gesprek',
  project_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can delete own conversations" ON conversations;

CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON conversations FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- 9. MESSAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  citations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages in own conversations" ON messages;
DROP POLICY IF EXISTS "Users can insert messages in own conversations" ON messages;

CREATE POLICY "Users can view messages in own conversations" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id AND conversations.user_id = auth.uid())
);
CREATE POLICY "Users can insert messages in own conversations" ON messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id AND conversations.user_id = auth.uid())
);

-- =============================================
-- 10. PROJECTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'actief',
  color TEXT DEFAULT '#288978',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- 11. ARTICLES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  source TEXT,
  read_time INTEGER DEFAULT 5,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view articles" ON articles;
CREATE POLICY "Anyone can view articles" ON articles FOR SELECT USING (true);

-- =============================================
-- TRIGGER: Auto-create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- SEED DATA: Sample articles
-- =============================================
INSERT INTO articles (id, title, summary, content, category, tags, read_time) VALUES
  ('omgevingswet-basis', 'Omgevingswet: De Basis', 'Introductie tot de Omgevingswet die sinds 2024 van kracht is.',
   'De Omgevingswet bundelt 26 wetten over de fysieke leefomgeving in één wet.', 'wetgeving', ARRAY['omgevingswet'], 8),
  ('handhaving-stappen', 'Handhavingstraject: Stap voor Stap', 'Complete gids voor handhaving.',
   'Bij constatering van een overtreding doorloopt u stappen.', 'handhaving', ARRAY['handhaving'], 10),
  ('bezwaar-beroep', 'Bezwaar en Beroep', 'Uitleg over rechtsbescherming.',
   'Tegen besluiten kan bezwaar en beroep worden aangetekend.', 'juridisch', ARRAY['bezwaar'], 7)
ON CONFLICT (id) DO NOTHING;

SELECT 'Database schema V2 created successfully!' as status;
