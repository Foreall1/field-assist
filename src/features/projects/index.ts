// Hooks
export {
  useProjects,
  useProject,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useAddNote,
  useUpdateNote,
  useDeleteNote,
  usePrefetchProjects,
  projectKeys,
} from './hooks/useProjects';

// Services
export * from './services/project.service';

// Types
export type { Project, ProjectNote } from './services/project.service';
