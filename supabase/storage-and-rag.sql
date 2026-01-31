-- FIELD Assist Storage and RAG Schema
-- Run this in Supabase SQL Editor AFTER running complete-schema-v2.sql

-- =============================================
-- 1. STORAGE BUCKET SETUP
-- =============================================
-- Note: You must create the 'documents' bucket manually in Supabase Dashboard
-- Go to Storage → Create bucket → Name: 'documents' → Public: No

-- Storage RLS policies for the documents bucket
-- (These are automatically created when you create policies in the Storage section)

-- =============================================
-- 2. ENABLE VECTOR EXTENSION (for embeddings)
-- =============================================
CREATE EXTENSION IF NOT EXISTS vector;

-- =============================================
-- 3. DOCUMENT CHUNKS TABLE (for RAG)
-- =============================================
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_type TEXT NOT NULL, -- 'template', 'handboek', 'artikel'
  source_id UUID NOT NULL,
  gemeente_id TEXT REFERENCES gemeenten(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  chunk_index INTEGER DEFAULT 0,
  embedding vector(1536), -- OpenAI ada-002 dimension
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx
ON document_chunks
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create index for source lookups
CREATE INDEX IF NOT EXISTS document_chunks_source_idx
ON document_chunks (source_type, source_id);

-- Create index for gemeente lookups
CREATE INDEX IF NOT EXISTS document_chunks_gemeente_idx
ON document_chunks (gemeente_id);

ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view document chunks" ON document_chunks;
CREATE POLICY "Anyone can view document chunks" ON document_chunks
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert document chunks" ON document_chunks;
CREATE POLICY "Authenticated users can insert document chunks" ON document_chunks
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- =============================================
-- 4. VECTOR SIMILARITY SEARCH FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION match_document_chunks(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5,
  filter_gemeente_id text DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  source_type TEXT,
  source_id UUID,
  gemeente_id TEXT,
  title TEXT,
  content TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.source_type,
    dc.source_id,
    dc.gemeente_id,
    dc.title,
    dc.content,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM document_chunks dc
  WHERE
    1 - (dc.embedding <=> query_embedding) > match_threshold
    AND (filter_gemeente_id IS NULL OR dc.gemeente_id = filter_gemeente_id)
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- =============================================
-- 5. COMBINED SEARCH FUNCTION (articles + documents)
-- =============================================
CREATE OR REPLACE FUNCTION search_all_content(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10,
  filter_gemeente_id text DEFAULT NULL
)
RETURNS TABLE (
  id TEXT,
  source_type TEXT,
  title TEXT,
  content TEXT,
  gemeente_id TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  -- Search in document_chunks
  SELECT
    dc.id::TEXT,
    dc.source_type,
    dc.title,
    dc.content,
    dc.gemeente_id,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM document_chunks dc
  WHERE
    1 - (dc.embedding <=> query_embedding) > match_threshold
    AND (filter_gemeente_id IS NULL OR dc.gemeente_id = filter_gemeente_id)

  UNION ALL

  -- Search in articles (if they have embeddings)
  SELECT
    a.id::TEXT,
    'artikel' AS source_type,
    a.title,
    COALESCE(a.content, a.summary, '') AS content,
    NULL AS gemeente_id,
    0.8 AS similarity -- Default similarity for keyword matches
  FROM articles a
  WHERE
    filter_gemeente_id IS NULL -- Articles are not gemeente-specific
    AND (
      a.title ILIKE '%' || split_part(filter_gemeente_id, '_', 1) || '%'
      OR a.content ILIKE '%' || split_part(filter_gemeente_id, '_', 1) || '%'
    )

  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- =============================================
-- 6. HELPER: Get document download URL
-- =============================================
-- Note: This is handled client-side via Supabase Storage API

SELECT 'Storage and RAG schema created successfully!' as status;
