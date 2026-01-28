"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, ProjectNote } from '@/lib/types';
import { projectsStorage, generateId } from '@/lib/storage';

interface ProjectContextType {
  projects: Project[];
  isLoading: boolean;
  createProject: (name: string, description?: string) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  addArticleToProject: (projectId: string, articleId: string) => void;
  removeArticleFromProject: (projectId: string, articleId: string) => void;
  addNoteToProject: (projectId: string, content: string, articleId?: string) => void;
  updateNote: (projectId: string, noteId: string, content: string) => void;
  deleteNote: (projectId: string, noteId: string) => void;
  linkConversation: (projectId: string, conversationId: string) => void;
  unlinkConversation: (projectId: string, conversationId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const PROJECT_COLORS = [
  '#288978', '#33a370', '#3B82F6', '#8B5CF6',
  '#EC4899', '#F59E0B', '#EF4444', '#06B6D4',
];

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load projects from localStorage on mount
  useEffect(() => {
    const storedProjects = projectsStorage.getAll();
    setProjects(storedProjects);
    setIsLoading(false);
  }, []);

  const createProject = (name: string, description: string = ''): Project => {
    const colorIndex = projects.length % PROJECT_COLORS.length;
    const newProject: Project = {
      id: generateId('project'),
      name,
      description,
      status: 'actief',
      color: PROJECT_COLORS[colorIndex],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articleIds: [],
      notes: [],
      conversationIds: [],
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    projectsStorage.set(updatedProjects);

    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    setProjects(updatedProjects);
    projectsStorage.set(updatedProjects);
  };

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter((p) => p.id !== id);
    setProjects(updatedProjects);
    projectsStorage.set(updatedProjects);
  };

  const getProject = (id: string): Project | undefined => {
    return projects.find((p) => p.id === id);
  };

  const addArticleToProject = (projectId: string, articleId: string) => {
    const project = getProject(projectId);
    if (!project || project.articleIds.includes(articleId)) return;

    updateProject(projectId, {
      articleIds: [...project.articleIds, articleId],
    });
  };

  const removeArticleFromProject = (projectId: string, articleId: string) => {
    const project = getProject(projectId);
    if (!project) return;

    updateProject(projectId, {
      articleIds: project.articleIds.filter((id) => id !== articleId),
    });
  };

  const addNoteToProject = (projectId: string, content: string, articleId?: string) => {
    const project = getProject(projectId);
    if (!project) return;

    const newNote: ProjectNote = {
      id: generateId('note'),
      content,
      articleId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    updateProject(projectId, {
      notes: [...project.notes, newNote],
    });
  };

  const updateNote = (projectId: string, noteId: string, content: string) => {
    const project = getProject(projectId);
    if (!project) return;

    const updatedNotes = project.notes.map((note) =>
      note.id === noteId
        ? { ...note, content, updatedAt: new Date().toISOString() }
        : note
    );

    updateProject(projectId, { notes: updatedNotes });
  };

  const deleteNote = (projectId: string, noteId: string) => {
    const project = getProject(projectId);
    if (!project) return;

    updateProject(projectId, {
      notes: project.notes.filter((note) => note.id !== noteId),
    });
  };

  const linkConversation = (projectId: string, conversationId: string) => {
    const project = getProject(projectId);
    if (!project || project.conversationIds.includes(conversationId)) return;

    updateProject(projectId, {
      conversationIds: [...project.conversationIds, conversationId],
    });
  };

  const unlinkConversation = (projectId: string, conversationId: string) => {
    const project = getProject(projectId);
    if (!project) return;

    updateProject(projectId, {
      conversationIds: project.conversationIds.filter((id) => id !== conversationId),
    });
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
