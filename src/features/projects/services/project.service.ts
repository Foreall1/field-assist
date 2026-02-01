import { createBrowserSupabaseClient } from '@/infrastructure/supabase/client';
import { AppError } from '@/core/errors';
import type {
  Project as DBProject,
  ProjectNote as DBProjectNote,
  ProjectInsert,
  ProjectUpdate,
  ProjectNoteInsert,
} from '@/infrastructure/supabase/types';
import type { CreateProjectInput, UpdateProjectInput } from '@/core/validation/schemas';

/**
 * Project domain type (transformed from DB)
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'actief' | 'afgerond' | 'gepauzeerd';
  color: string;
  createdAt: string;
  updatedAt: string;
  articleIds: string[];
  notes: ProjectNote[];
}

export interface ProjectNote {
  id: string;
  content: string;
  articleId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Transform DB project to domain project
 */
function transformProject(project: DBProject, notes: ProjectNote[] = []): Project {
  return {
    id: project.id,
    name: project.name,
    description: project.description || '',
    status: project.status,
    color: project.color || '#288978',
    createdAt: project.created_at,
    updatedAt: project.updated_at || project.created_at,
    articleIds: project.article_ids || [],
    notes,
  };
}

/**
 * Transform DB note to domain note
 */
function transformNote(note: DBProjectNote): ProjectNote {
  return {
    id: note.id,
    content: note.content,
    articleId: note.article_id || undefined,
    createdAt: note.created_at,
    updatedAt: note.updated_at || note.created_at,
  };
}

/**
 * Get all projects for the current user
 * RLS ensures only user's own projects are returned
 */
export async function getProjects(): Promise<Project[]> {
  const supabase = createBrowserSupabaseClient();

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw AppError.database(`Fout bij ophalen projecten: ${error.message}`);
  }

  if (!projects || projects.length === 0) {
    return [];
  }

  // Get notes for all projects in one query
  const projectIds = projects.map((p) => p.id);
  const { data: notes } = await supabase
    .from('project_notes')
    .select('*')
    .in('project_id', projectIds)
    .order('created_at', { ascending: false });

  // Group notes by project
  const notesMap = new Map<string, ProjectNote[]>();
  notes?.forEach((note) => {
    const projectNotes = notesMap.get(note.project_id) || [];
    projectNotes.push(transformNote(note));
    notesMap.set(note.project_id, projectNotes);
  });

  return projects.map((p) => transformProject(p, notesMap.get(p.id) || []));
}

/**
 * Get a single project by ID
 */
export async function getProjectById(projectId: string): Promise<Project> {
  const supabase = createBrowserSupabaseClient();

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw AppError.notFound('Project');
    }
    throw AppError.database(`Fout bij ophalen project: ${error.message}`);
  }

  const { data: notes } = await supabase
    .from('project_notes')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  return transformProject(project, (notes || []).map(transformNote));
}

/**
 * Create a new project
 */
export async function createProject(input: CreateProjectInput): Promise<Project> {
  const supabase = createBrowserSupabaseClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw AppError.unauthorized();
  }

  const insertData: ProjectInsert = {
    user_id: user.id,
    name: input.name,
    description: input.description || '',
    color: input.color || '#288978',
    status: 'actief',
  };

  const { data: project, error } = await supabase
    .from('projects')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    throw AppError.database(`Fout bij aanmaken project: ${error.message}`);
  }

  return transformProject(project, []);
}

/**
 * Update a project
 */
export async function updateProject(
  projectId: string,
  input: UpdateProjectInput
): Promise<Project> {
  const supabase = createBrowserSupabaseClient();

  const updateData: ProjectUpdate = {};
  if (input.name !== undefined) updateData.name = input.name;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.color !== undefined) updateData.color = input.color;
  if (input.status !== undefined) updateData.status = input.status;

  const { data: project, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', projectId)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw AppError.notFound('Project');
    }
    throw AppError.database(`Fout bij bijwerken project: ${error.message}`);
  }

  // Get notes for the updated project
  const { data: notes } = await supabase
    .from('project_notes')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  return transformProject(project, (notes || []).map(transformNote));
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string): Promise<void> {
  const supabase = createBrowserSupabaseClient();

  const { error } = await supabase.from('projects').delete().eq('id', projectId);

  if (error) {
    throw AppError.database(`Fout bij verwijderen project: ${error.message}`);
  }
}

/**
 * Add a note to a project
 */
export async function addNote(
  projectId: string,
  content: string,
  articleId?: string
): Promise<ProjectNote> {
  const supabase = createBrowserSupabaseClient();

  const insertData: ProjectNoteInsert = {
    project_id: projectId,
    content,
    article_id: articleId || null,
  };

  const { data: note, error } = await supabase
    .from('project_notes')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    throw AppError.database(`Fout bij toevoegen notitie: ${error.message}`);
  }

  return transformNote(note);
}

/**
 * Update a note
 */
export async function updateNote(noteId: string, content: string): Promise<ProjectNote> {
  const supabase = createBrowserSupabaseClient();

  const { data: note, error } = await supabase
    .from('project_notes')
    .update({ content })
    .eq('id', noteId)
    .select()
    .single();

  if (error) {
    throw AppError.database(`Fout bij bijwerken notitie: ${error.message}`);
  }

  return transformNote(note);
}

/**
 * Delete a note
 */
export async function deleteNote(noteId: string): Promise<void> {
  const supabase = createBrowserSupabaseClient();

  const { error } = await supabase.from('project_notes').delete().eq('id', noteId);

  if (error) {
    throw AppError.database(`Fout bij verwijderen notitie: ${error.message}`);
  }
}
