-- FIELD Assist Complete Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. PROFILES TABLE (extends Supabase auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  role TEXT DEFAULT 'vergunningverlener', -- vergunningverlener, toezichthouder, jurist, beleidsmedewerker
  organization TEXT,
  avatar_url TEXT,
  specializations TEXT[] DEFAULT '{}',
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

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

-- Enable RLS but allow public read
ALTER TABLE gemeenten ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gemeenten" ON gemeenten
  FOR SELECT USING (true);

-- Insert initial gemeenten
INSERT INTO gemeenten (id, name, provincie, inwoners, active_fielders, contributions, color) VALUES
  ('rotterdam', 'Rotterdam', 'Zuid-Holland', 655000, 8, 47, '#288978'),
  ('amsterdam', 'Amsterdam', 'Noord-Holland', 882000, 12, 63, '#E63946'),
  ('utrecht', 'Utrecht', 'Utrecht', 361000, 5, 31, '#1D3557'),
  ('arnhem', 'Arnhem', 'Gelderland', 164000, 4, 22, '#F4A261'),
  ('zwijndrecht', 'Zwijndrecht', 'Zuid-Holland', 45000, 3, 12, '#0077B6')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 3. PROCESSEN TABLE (VTH processes)
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

CREATE POLICY "Anyone can view processen" ON processen
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert processen" ON processen
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authors can update their processen" ON processen
  FOR UPDATE USING (auth.uid() = auteur_id);

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

CREATE POLICY "Anyone can view templates" ON templates
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert templates" ON templates
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authors can update their templates" ON templates
  FOR UPDATE USING (auth.uid() = auteur_id);

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

CREATE POLICY "Anyone can view handboeken" ON handboeken
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert handboeken" ON handboeken
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

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

CREATE POLICY "Anyone can view tips" ON tips
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert tips" ON tips
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authors can update their tips" ON tips
  FOR UPDATE USING (auth.uid() = auteur_id);

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

CREATE POLICY "Anyone can view contacten" ON contacten
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert contacten" ON contacten
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- =============================================
-- 8. CONVERSATIONS TABLE (for AI chat)
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

CREATE POLICY "Users can view own conversations" ON conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON conversations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations" ON conversations
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- 9. MESSAGES TABLE (for AI chat)
-- =============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  citations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in own conversations" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in own conversations" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
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

CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- 11. ARTICLES TABLE (kennisbank)
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

CREATE POLICY "Anyone can view articles" ON articles
  FOR SELECT USING (true);

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

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- SEED DATA: Sample articles for kennisbank
-- =============================================
INSERT INTO articles (id, title, summary, content, category, tags, read_time) VALUES
  ('omgevingswet-basis', 'Omgevingswet: De Basis', 'Introductie tot de Omgevingswet die sinds 2024 van kracht is.',
   'De Omgevingswet bundelt 26 wetten over de fysieke leefomgeving in één wet. De wet is sinds 1 januari 2024 van kracht en vervangt onder andere de Wabo, Wet ruimtelijke ordening, en delen van de Woningwet.

## Belangrijkste instrumenten
- Omgevingsvisie
- Omgevingsplan
- Omgevingsvergunning
- Programma

## Vergunningprocedures
De reguliere procedure duurt 8 weken (verlengbaar met 6 weken). De uitgebreide procedure duurt 6 maanden.',
   'wetgeving', ARRAY['omgevingswet', 'vergunningen', 'basis'], 8),

  ('handhaving-stappen', 'Handhavingstraject: Stap voor Stap', 'Complete gids voor het opzetten van een handhavingstraject.',
   'Bij constatering van een overtreding doorloopt u de volgende stappen:

## 1. Constatering
- Leg de overtreding vast met foto''s
- Maak een controlerapport
- Identificeer de overtreder

## 2. Vooraankondiging
- Informeer de overtreder schriftelijk
- Geef mogelijkheid tot zienswijze (2 weken)

## 3. Last onder dwangsom
- Bepaal de hoogte van de dwangsom
- Stel een redelijke begunstigingstermijn
- Beschrijf de te nemen maatregelen

## 4. Effectuering
- Controleer na begunstigingstermijn
- Invorder bij niet-naleving',
   'handhaving', ARRAY['handhaving', 'dwangsom', 'proces'], 10),

  ('bezwaar-beroep', 'Bezwaar en Beroep: Wat moet u weten', 'Uitleg over de rechtsbeschermingsprocedures bij besluiten.',
   'Tegen besluiten van de gemeente kan bezwaar en beroep worden aangetekend.

## Bezwaar
- Termijn: 6 weken na bekendmaking besluit
- Indienen bij het bestuursorgaan dat het besluit nam
- Hoorzitting vindt plaats binnen 6 weken

## Beroep
- Na afwijzing bezwaar: beroep bij rechtbank
- Termijn: 6 weken na beslissing op bezwaar
- Griffierecht verschuldigd

## Voorlopige voorziening
- Bij spoedeisend belang
- Indienen bij voorzieningenrechter',
   'juridisch', ARRAY['bezwaar', 'beroep', 'awb', 'rechtsbescherming'], 7)
ON CONFLICT (id) DO NOTHING;

-- Done!
SELECT 'Database schema created successfully!' as status;
