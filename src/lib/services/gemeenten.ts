import { getSupabaseClient } from '@/lib/supabase';
import type { Gemeente, GemeenteContent } from '@/lib/database.types';

export interface GemeenteWithContent {
  id: string;
  name: string;
  activeFielders: number;
  contributions: number;
  description: string;
}

export interface GemeenteContentItem {
  id: string;
  gemeenteId: string;
  type: 'process' | 'template' | 'handboek' | 'contact' | 'tip';
  title: string;
  content: Record<string, unknown>;
  createdAt: string;
}

// Get all gemeenten
export async function getGemeenten(): Promise<GemeenteWithContent[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('gemeenten')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching gemeenten:', error);
    return [];
  }

  return (data || []).map(transformGemeente);
}

// Get single gemeente by ID/slug
export async function getGemeenteById(id: string): Promise<GemeenteWithContent | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('gemeenten')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching gemeente:', error);
    return null;
  }

  return data ? transformGemeente(data) : null;
}

// Search gemeenten by name
export async function searchGemeenten(query: string): Promise<GemeenteWithContent[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('gemeenten')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('name')
    .limit(10);

  if (error) {
    console.error('Error searching gemeenten:', error);
    return [];
  }

  return (data || []).map(transformGemeente);
}

// Get gemeente content by type
export async function getGemeenteContent(
  gemeenteId: string,
  type?: 'process' | 'template' | 'handboek' | 'contact' | 'tip'
): Promise<GemeenteContentItem[]> {
  const supabase = getSupabaseClient();

  let query = supabase
    .from('gemeente_content')
    .select('*')
    .eq('gemeente_id', gemeenteId)
    .order('created_at', { ascending: false });

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching gemeente content:', error);
    return [];
  }

  return (data || []).map(transformGemeenteContent);
}

// Get gemeente processes
export async function getGemeenteProcesses(gemeenteId: string) {
  return getGemeenteContent(gemeenteId, 'process');
}

// Get gemeente templates
export async function getGemeenteTemplates(gemeenteId: string) {
  return getGemeenteContent(gemeenteId, 'template');
}

// Get gemeente handboeken
export async function getGemeenteHandboeken(gemeenteId: string) {
  return getGemeenteContent(gemeenteId, 'handboek');
}

// Get gemeente contacts
export async function getGemeenteContacts(gemeenteId: string) {
  return getGemeenteContent(gemeenteId, 'contact');
}

// Get gemeente tips
export async function getGemeenteTips(gemeenteId: string) {
  return getGemeenteContent(gemeenteId, 'tip');
}

// Transform functions
function transformGemeente(gemeente: Gemeente): GemeenteWithContent {
  return {
    id: gemeente.id,
    name: gemeente.name,
    activeFielders: gemeente.active_fielders,
    contributions: gemeente.contributions,
    description: gemeente.description || '',
  };
}

function transformGemeenteContent(content: GemeenteContent): GemeenteContentItem {
  return {
    id: content.id,
    gemeenteId: content.gemeente_id,
    type: content.type,
    title: content.title,
    content: (content.content as Record<string, unknown>) || {},
    createdAt: content.created_at,
  };
}

// Network stats
export async function getNetworkStats() {
  const supabase = getSupabaseClient();

  const { data: gemeentenData } = await supabase
    .from('gemeenten')
    .select('active_fielders, contributions');

  const { count: articlesCount } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true });

  const totalFielders = gemeentenData?.reduce((sum, g) => sum + (g.active_fielders || 0), 0) || 0;
  const totalContributions = gemeentenData?.reduce((sum, g) => sum + (g.contributions || 0), 0) || 0;

  return {
    totalGemeenten: gemeentenData?.length || 0,
    totalFielders,
    totalContributions,
    totalArticles: articlesCount || 0,
  };
}
