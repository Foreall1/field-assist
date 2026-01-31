"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Project } from '@/lib/types';
import { useUser } from './UserContext';
import * as projectService from '@/lib/services/projects';

interface ProjectContextType {
  projects: Project[];
  isLoading: boolean;
  createProject: (name: string, description?: string) => Promise<Project | null>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => Project | undefined;
  addArticleToProject: (projectId: string, articleId: string) => Promise<void>;
  removeArticleFromProject: (projectId: string, articleId: string) => Promise<void>;
  addNoteToProject: (projectId: string, content: string, articleId?: string) => Promise<void>;
  updateNote: (projectId: string, noteId: string, content: string) => Promise<void>;
  deleteNote: (projectId: string, noteId: string) => Promise<void>;
  linkConversation: (projectId: string, conversationId: string) => void;
  unlinkConversation: (projectId: string, conversationId: string) => void;
  refreshProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const PROJECT_COLORS = [
  '#288978', '#33a370', '#3B82F6', '#8B5CF6',
  '#EC4899', '#F59E0B', '#EF4444', '#06B6D4',
];

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  // Load projects from Supabase
  const loadProjects = useCallback(async () => {
    if (!user?.id) {
      setProjects([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const loadedProjects = await projectService.getProjects(user.id);
      setProjects(loadedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const refreshProjects = async () => {
    await loadProjects();
  };

  const createProject = async (name: string, description: string = ''): Promise<Project | null> => {
    if (!user?.id) return null;

    const colorIndex = projects.length % PROJECT_COLORS.length;
    const newProject = await projectService.createProject(user.id, {
      name,
      description,
      color: PROJECT_COLORS[colorIndex],
    });

    if (newProject) {
      setProjects(prev => [...prev, newProject]);
    }

    return newProject;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    if (!user?.id) return;

    const success = await projectService.updateProject(id, user.id, {
      name: updates.name,
      description: updates.description,
      status: updates.status,
      color: updates.color,
      article_ids: updates.articleIds,
    });

    if (success) {
      setProjects(prev =>
        prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)
      );
    }
  };

  const deleteProject = async (id: string) => {
    if (!user?.id) return;

    const success = await projectService.deleteProject(id, user.id);

    if (success) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const getProject = (id: string): Project | undefined => {
    return projects.find(p => p.id === id);
  };

  const addArticleToProject = async (projectId: string, articleId: string) => {
    const project = getProject(projectId);
    if (!project || project.articleIds.includes(articleId)) return;

    await updateProject(projectId, {
      articleIds: [...project.articleIds, articleId],
    });
  };

  const removeArticleFromProject = async (projectId: string, articleId: string) => {
    const project = getProject(projectId);
    if (!project) return;

    await updateProject(projectId, {
      articleIds: project.articleIds.filter(id => id !== articleId),
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addNoteToProject = async (projectId: string, content: string, _articleId?: string) => {
    const note = await projectService.addProjectNote(projectId, content);

    if (note) {
      setProjects(prev =>
        prev.map(p =>
          p.id === projectId
            ? { ...p, notes: [...p.notes, note], updatedAt: new Date().toISOString() }
            : p
        )
      );
    }
  };

  const updateNote = async (_projectId: string, noteId: string, content: string) => {
    const success = await projectService.updateProjectNote(noteId, content);

    if (success) {
      setProjects(prev =>
        prev.map(p => ({
          ...p,
          notes: p.notes.map(n =>
            n.id === noteId ? { ...n, content, updatedAt: new Date().toISOString() } : n
          ),
        }))
      );
    }
  };

  const deleteNote = async (_projectId: string, noteId: string) => {
    const success = await projectService.deleteProjectNote(noteId);

    if (success) {
      setProjects(prev =>
        prev.map(p => ({
          ...p,
          notes: p.notes.filter(n => n.id !== noteId),
        }))
      );
    }
  };

  // These remain local for now (could be stored in DB later)
  const linkConversation = (projectId: string, conversationId: string) => {
    const project = getProject(projectId);
    if (!project || project.conversationIds.includes(conversationId)) return;

    setProjects(prev =>
      prev.map(p =>
        p.id === projectId
          ? { ...p, conversationIds: [...p.conversationIds, conversationId] }
          : p
      )
    );
  };

  const unlinkConversation = (projectId: string, conversationId: string) => {
    const project = getProject(projectId);
    if (!project) return;

    setProjects(prev =>
      prev.map(p =>
        p.id === projectId
          ? { ...p, conversationIds: p.conversationIds.filter(id => id !== conversationId) }
          : p
      )
    );
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        isLoading,
        createProject,
        updateProject,
        deleteProject,
        getProject,
        addArticleToProject,
        removeArticleFromProject,
        addNoteToProject,
        updateNote,
        deleteNote,
        linkConversation,
        unlinkConversation,
        refreshProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
