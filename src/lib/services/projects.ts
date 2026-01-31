import { getSupabaseClient } from '@/lib/supabase';
import type { Project as DBProject, ProjectNote as DBProjectNote } from '@/lib/database.types';
import type { Project, ProjectNote, ProjectStatus } from '@/lib/types';

// Get all projects for current user
export async function getProjects(userId: string): Promise<Project[]> {
  const supabase = getSupabaseClient();

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  // Get notes for each project
  const projectIds = projects?.map(p => p.id) || [];
  const { data: notes } = await supabase
    .from('project_notes')
    .select('*')
    .in('project_id', projectIds)
    .order('created_at', { ascending: false });

  const notesMap = new Map<string, ProjectNote[]>();
  notes?.forEach(note => {
    const projectNotes = notesMap.get(note.project_id) || [];
    projectNotes.push(transformNote(note));
    notesMap.set(note.project_id, projectNotes);
  });

  return (projects || []).map(p => transformProject(p, notesMap.get(p.id) || []));
}

// Get single project
export async function getProjectById(projectId: string, userId: string): Promise<Project | null> {
  const supabase = getSupabaseClient();

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('user_id', userId)
    .single();

  if (error || !project) {
    console.error('Error fetching project:', error);
    return null;
  }

  const { data: notes } = await supabase
    .from('project_notes')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  return transformProject(project, (notes || []).map(transformNote));
}

// Create project
export async function createProject(
  userId: string,
  data: { name: string; description?: string; color?: string }
): Promise<Project | null> {
  const supabase = getSupabaseClient();

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      user_id: userId,
      name: data.name,
      description: data.description || '',
      color: data.color || '#288978',
      status: 'actief',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }

  return transformProject(project, []);
}

// Update project
export async function updateProject(
  projectId: string,
  userId: string,
  updates: Partial<{ name: string; description: string; status: ProjectStatus; color: string; article_ids: string[] }>
): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating project:', error);
    return false;
  }

  return true;
}

// Delete project
export async function deleteProject(projectId: string, userId: string): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }

  return true;
}

// Add note to project
export async function addProjectNote(
  projectId: string,
  content: string
): Promise<ProjectNote | null> {
  const supabase = getSupabaseClient();

  const { data: note, error } = await supabase
    .from('project_notes')
    .insert({
      project_id: projectId,
      content,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding note:', error);
    return null;
  }

  return transformNote(note);
}

// Update note
export async function updateProjectNote(
  noteId: string,
  content: string
): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('project_notes')
    .update({ content })
    .eq('id', noteId);

  if (error) {
    console.error('Error updating note:', error);
    return false;
  }

  return true;
}

// Delete note
export async function deleteProjectNote(noteId: string): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('project_notes')
    .delete()
    .eq('id', noteId);

  if (error) {
    console.error('Error deleting note:', error);
    return false;
  }

  return true;
}

// Transform functions
function transformProject(project: DBProject, notes: ProjectNote[]): Project {
  return {
    id: project.id,
    name: project.name,
    description: project.description || '',
    status: project.status as ProjectStatus,
    color: project.color || '#288978',
    createdAt: project.created_at,
    updatedAt: project.created_at,
    articleIds: project.article_ids || [],
    notes,
    conversationIds: [],
  };
}

function transformNote(note: DBProjectNote): ProjectNote {
  return {
    id: note.id,
    content: note.content,
    createdAt: note.created_at,
    updatedAt: note.created_at,
  };
}
