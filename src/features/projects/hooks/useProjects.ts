import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/shared/providers/AuthProvider';
import { useToast } from '@/shared/providers/ToastProvider';
import * as projectService from '../services/project.service';
import type { Project } from '../services/project.service';
import type { CreateProjectInput, UpdateProjectInput } from '@/core/validation/schemas';

// Query keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: () => [...projectKeys.lists()] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

/**
 * Hook to fetch all projects
 */
export function useProjects() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: projectService.getProjects,
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch a single project
 */
export function useProject(projectId: string | undefined) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: projectKeys.detail(projectId || ''),
    queryFn: () => projectService.getProjectById(projectId!),
    enabled: isAuthenticated && !!projectId,
  });
}

/**
 * Hook to create a project
 */
export function useCreateProject() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (input: CreateProjectInput) => projectService.createProject(input),
    onSuccess: (newProject) => {
      // Add to cache
      queryClient.setQueryData<Project[]>(projectKeys.list(), (old = []) => [
        newProject,
        ...old,
      ]);
      success('Project aangemaakt', `"${newProject.name}" is aangemaakt`);
    },
    onError: (err) => {
      error('Fout', err instanceof Error ? err.message : 'Kon project niet aanmaken');
    },
  });
}

/**
 * Hook to update a project
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ projectId, input }: { projectId: string; input: UpdateProjectInput }) =>
      projectService.updateProject(projectId, input),
    onSuccess: (updatedProject) => {
      // Update in list cache
      queryClient.setQueryData<Project[]>(projectKeys.list(), (old = []) =>
        old.map((p) => (p.id === updatedProject.id ? updatedProject : p))
      );
      // Update detail cache
      queryClient.setQueryData(projectKeys.detail(updatedProject.id), updatedProject);
      success('Project bijgewerkt');
    },
    onError: (err) => {
      error('Fout', err instanceof Error ? err.message : 'Kon project niet bijwerken');
    },
  });
}

/**
 * Hook to delete a project
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (projectId: string) => projectService.deleteProject(projectId),
    onSuccess: (_, deletedId) => {
      // Remove from list cache
      queryClient.setQueryData<Project[]>(projectKeys.list(), (old = []) =>
        old.filter((p) => p.id !== deletedId)
      );
      // Remove detail cache
      queryClient.removeQueries({ queryKey: projectKeys.detail(deletedId) });
      success('Project verwijderd');
    },
    onError: (err) => {
      error('Fout', err instanceof Error ? err.message : 'Kon project niet verwijderen');
    },
  });
}

/**
 * Hook to add a note to a project
 */
export function useAddNote() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({
      projectId,
      content,
      articleId,
    }: {
      projectId: string;
      content: string;
      articleId?: string;
    }) => projectService.addNote(projectId, content, articleId),
    onSuccess: (newNote, { projectId }) => {
      // Update project in cache with new note
      queryClient.setQueryData<Project[]>(projectKeys.list(), (old = []) =>
        old.map((p) =>
          p.id === projectId ? { ...p, notes: [newNote, ...p.notes] } : p
        )
      );
      queryClient.setQueryData<Project>(projectKeys.detail(projectId), (old) =>
        old ? { ...old, notes: [newNote, ...old.notes] } : old
      );
      success('Notitie toegevoegd');
    },
    onError: (err) => {
      error('Fout', err instanceof Error ? err.message : 'Kon notitie niet toevoegen');
    },
  });
}

/**
 * Hook to update a note
 */
export function useUpdateNote() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({
      noteId,
      content,
      projectId,
    }: {
      noteId: string;
      content: string;
      projectId: string;
    }) => projectService.updateNote(noteId, content).then((note) => ({ note, projectId })),
    onSuccess: ({ note, projectId }) => {
      // Update note in project cache
      const updateNotes = (notes: Project['notes']) =>
        notes.map((n) => (n.id === note.id ? note : n));

      queryClient.setQueryData<Project[]>(projectKeys.list(), (old = []) =>
        old.map((p) => (p.id === projectId ? { ...p, notes: updateNotes(p.notes) } : p))
      );
      queryClient.setQueryData<Project>(projectKeys.detail(projectId), (old) =>
        old ? { ...old, notes: updateNotes(old.notes) } : old
      );
      success('Notitie bijgewerkt');
    },
    onError: (err) => {
      error('Fout', err instanceof Error ? err.message : 'Kon notitie niet bijwerken');
    },
  });
}

/**
 * Hook to delete a note
 */
export function useDeleteNote() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ noteId, projectId }: { noteId: string; projectId: string }) =>
      projectService.deleteNote(noteId).then(() => ({ noteId, projectId })),
    onSuccess: ({ noteId, projectId }) => {
      // Remove note from project cache
      const removeNote = (notes: Project['notes']) => notes.filter((n) => n.id !== noteId);

      queryClient.setQueryData<Project[]>(projectKeys.list(), (old = []) =>
        old.map((p) => (p.id === projectId ? { ...p, notes: removeNote(p.notes) } : p))
      );
      queryClient.setQueryData<Project>(projectKeys.detail(projectId), (old) =>
        old ? { ...old, notes: removeNote(old.notes) } : old
      );
      success('Notitie verwijderd');
    },
    onError: (err) => {
      error('Fout', err instanceof Error ? err.message : 'Kon notitie niet verwijderen');
    },
  });
}

/**
 * Prefetch projects (useful for navigation)
 */
export function usePrefetchProjects() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: projectKeys.list(),
      queryFn: projectService.getProjects,
    });
  };
}
