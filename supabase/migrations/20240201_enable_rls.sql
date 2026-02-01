-- ============================================
-- FIELD-Assist Row Level Security Policies
-- ============================================
-- Dit bestand bevat alle RLS policies voor de FIELD-Assist database.
-- Voer dit uit in de Supabase SQL editor of via migraties.
--
-- BELANGRIJK: Test deze policies grondig voordat je ze in productie gebruikt!
-- ============================================

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
-- Users kunnen alleen hun eigen profiel lezen en bewerken

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop bestaande policies als ze bestaan
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Users kunnen alleen hun eigen profiel zien
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users kunnen alleen hun eigen profiel updaten
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users kunnen alleen een profiel voor zichzelf aanmaken
-- (typisch via auth trigger, maar voor zekerheid)
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);


-- ============================================
-- 2. PROJECTS TABLE
-- ============================================
-- Users kunnen alleen hun eigen projecten beheren

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can create own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

CREATE POLICY "Users can view own projects"
ON projects FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
ON projects FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
ON projects FOR DELETE
TO authenticated
USING (auth.uid() = user_id);


-- ============================================
-- 3. PROJECT_NOTES TABLE
-- ============================================
-- Users kunnen alleen notities van hun eigen projecten beheren

ALTER TABLE project_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own project notes" ON project_notes;
DROP POLICY IF EXISTS "Users can create notes for own projects" ON project_notes;
DROP POLICY IF EXISTS "Users can update own project notes" ON project_notes;
DROP POLICY IF EXISTS "Users can delete own project notes" ON project_notes;

CREATE POLICY "Users can view own project notes"
ON project_notes FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_notes.project_id
    AND projects.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create notes for own projects"
ON project_notes FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_id
    AND projects.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own project notes"
ON project_notes FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_notes.project_id
    AND projects.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_id
    AND projects.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own project notes"
ON project_notes FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_notes.project_id
    AND projects.user_id = auth.uid()
  )
);


-- ============================================
-- 4. CONVERSATIONS TABLE
-- ============================================
-- Users kunnen alleen hun eigen gesprekken beheren

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can delete own conversations" ON conversations;

CREATE POLICY "Users can view own conversations"
ON conversations FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations"
ON conversations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
ON conversations FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
ON conversations FOR DELETE
TO authenticated
USING (auth.uid() = user_id);


-- ============================================
-- 5. MESSAGES TABLE
-- ============================================
-- Users kunnen alleen berichten van hun eigen gesprekken zien en maken

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages of own conversations" ON messages;
DROP POLICY IF EXISTS "Users can create messages in own conversations" ON messages;

CREATE POLICY "Users can view messages of own conversations"
ON messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND conversations.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create messages in own conversations"
ON messages FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = conversation_id
    AND conversations.user_id = auth.uid()
  )
);

-- Berichten worden normaal niet ge-update of verwijderd, maar voor zekerheid:
CREATE POLICY "Users can delete messages of own conversations"
ON messages FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND conversations.user_id = auth.uid()
  )
);


-- ============================================
-- 6. ARTICLES TABLE
-- ============================================
-- Artikelen zijn publiek leesbaar voor alle authenticated users
-- Alleen admins kunnen artikelen bewerken (via service role)

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Articles are readable by authenticated users" ON articles;

CREATE POLICY "Articles are readable by authenticated users"
ON articles FOR SELECT
TO authenticated
USING (true);

-- INSERT, UPDATE, DELETE worden afgehandeld via service role key
-- (admin panel of batch imports)


-- ============================================
-- 7. GEMEENTEN TABLE
-- ============================================
-- Gemeenten data is publiek leesbaar

ALTER TABLE gemeenten ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Gemeenten are publicly readable" ON gemeenten;

CREATE POLICY "Gemeenten are publicly readable"
ON gemeenten FOR SELECT
TO authenticated
USING (true);


-- ============================================
-- 8. GEMEENTE_CONTENT TABLE
-- ============================================
-- Gemeente content is publiek leesbaar voor authenticated users

ALTER TABLE gemeente_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Gemeente content is readable by authenticated users" ON gemeente_content;

CREATE POLICY "Gemeente content is readable by authenticated users"
ON gemeente_content FOR SELECT
TO authenticated
USING (true);


-- ============================================
-- 9. DOCUMENT_CHUNKS TABLE (indien aanwezig)
-- ============================================
-- Document chunks zijn leesbaar voor authenticated users
-- Optioneel: gemeente-specifieke content beperken tot gemeente leden

-- Check if table exists before applying policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'document_chunks') THEN
    ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies
    DROP POLICY IF EXISTS "Document chunks are readable by authenticated users" ON document_chunks;

    -- Alle document chunks zijn leesbaar voor authenticated users
    CREATE POLICY "Document chunks are readable by authenticated users"
    ON document_chunks FOR SELECT
    TO authenticated
    USING (true);

    -- Voor gemeente-specifieke toegang, gebruik deze policy in plaats:
    -- CREATE POLICY "Gemeente-specific document chunks"
    -- ON document_chunks FOR SELECT
    -- TO authenticated
    -- USING (
    --   gemeente_id IS NULL
    --   OR EXISTS (
    --     SELECT 1 FROM profiles
    --     WHERE profiles.id = auth.uid()
    --     AND profiles.organization = document_chunks.gemeente_id
    --   )
    -- );
  END IF;
END $$;


-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Voer deze queries uit om te verifiëren dat RLS correct is ingesteld

-- Check welke tabellen RLS hebben ingeschakeld
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check alle policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies WHERE schemaname = 'public';


-- ============================================
-- IMPORTANT NOTES
-- ============================================
-- 1. Na het uitvoeren van deze migratie, test je de policies grondig!
-- 2. Gebruik de Supabase Policy Editor om policies visueel te bevestigen
-- 3. Service role key bypassed RLS - gebruik alleen server-side
-- 4. Anon key respecteert RLS - veilig voor client-side
-- 5. Bij problemen, check de Supabase logs voor policy violations
