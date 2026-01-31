import { getSupabaseClient } from '@/lib/supabase';
import type { Article } from '@/lib/database.types';

export interface ArticleWithCategory {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  source: string;
  readTime: number;
  lastUpdated: string;
}

// Get all articles
export async function getArticles(): Promise<ArticleWithCategory[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('last_updated', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  return (data || []).map(transformArticle);
}

// Get articles by category
export async function getArticlesByCategory(category: string): Promise<ArticleWithCategory[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('category', category)
    .order('last_updated', { ascending: false });

  if (error) {
    console.error('Error fetching articles by category:', error);
    return [];
  }

  return (data || []).map(transformArticle);
}

// Get single article by ID
export async function getArticleById(id: string): Promise<ArticleWithCategory | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching article:', error);
    return null;
  }

  return data ? transformArticle(data) : null;
}

// Search articles by query
export async function searchArticles(query: string): Promise<ArticleWithCategory[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .or(`title.ilike.%${query}%,summary.ilike.%${query}%,content.ilike.%${query}%`)
    .order('last_updated', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error searching articles:', error);
    return [];
  }

  return (data || []).map(transformArticle);
}

// Search articles using vector similarity (RAG)
export async function searchArticlesByEmbedding(
  embedding: number[],
  matchThreshold = 0.7,
  matchCount = 5
): Promise<ArticleWithCategory[]> {
  const supabase = getSupabaseClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.rpc as any)('match_articles', {
    query_embedding: embedding,
    match_threshold: matchThreshold,
    match_count: matchCount,
  });

  if (error) {
    console.error('Error searching articles by embedding:', error);
    return [];
  }

  return (data || []).map((item: { id: string; title: string; summary: string; content: string; category: string }) => ({
    id: item.id,
    title: item.title,
    summary: item.summary || '',
    content: item.content || '',
    category: item.category || '',
    tags: [],
    source: '',
    readTime: 5,
    lastUpdated: new Date().toISOString(),
  }));
}

// Transform database article to frontend format
function transformArticle(article: Article): ArticleWithCategory {
  return {
    id: article.id,
    title: article.title,
    summary: article.summary || '',
    content: article.content || '',
    category: article.category || '',
    tags: article.tags || [],
    source: article.source || '',
    readTime: article.read_time || 5,
    lastUpdated: article.last_updated || new Date().toISOString(),
  };
}

// Get unique categories
export async function getCategories(): Promise<string[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('articles')
    .select('category')
    .not('category', 'is', null);

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categoryArray = (data as any[])?.map(a => a.category).filter(Boolean) || [];
  const categories = Array.from(new Set(categoryArray));
  return categories as string[];
}
