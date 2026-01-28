// LocalStorage service voor FIELD Assist
// Wrapper voor data persistentie in de demo

import { User, Project, Conversation } from './types';

const STORAGE_KEYS = {
  USER: 'field-assist-user',
  PROJECTS: 'field-assist-projects',
  CONVERSATIONS: 'field-assist-conversations',
} as const;

// Helper voor JSON parse met fallback
function safeJsonParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// User storage
export const userStorage = {
  get(): User | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return safeJsonParse<User | null>(data, null);
  },

  set(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  remove(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.USER);
  },
};

// Projects storage
export const projectsStorage = {
  getAll(): Project[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return safeJsonParse<Project[]>(data, []);
  },

  get(id: string): Project | undefined {
    const projects = this.getAll();
    return projects.find(p => p.id === id);
  },

  set(projects: Project[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  },

  add(project: Project): void {
    const projects = this.getAll();
    projects.push(project);
    this.set(projects);
  },

  update(id: string, updates: Partial<Project>): void {
    const projects = this.getAll();
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates, updatedAt: new Date().toISOString() };
      this.set(projects);
    }
  },

  remove(id: string): void {
    const projects = this.getAll().filter(p => p.id !== id);
    this.set(projects);
  },
};

// Conversations storage
export const conversationsStorage = {
  getAll(): Conversation[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return safeJsonParse<Conversation[]>(data, []);
  },

  get(id: string): Conversation | undefined {
    const conversations = this.getAll();
    return conversations.find(c => c.id === id);
  },

  set(conversations: Conversation[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  },

  add(conversation: Conversation): void {
    const conversations = this.getAll();
    conversations.unshift(conversation);
    this.set(conversations);
  },

  update(id: string, updates: Partial<Conversation>): void {
    const conversations = this.getAll();
    const index = conversations.findIndex(c => c.id === id);
    if (index !== -1) {
      conversations[index] = { ...conversations[index], ...updates, updatedAt: new Date().toISOString() };
      this.set(conversations);
    }
  },

  remove(id: string): void {
    const conversations = this.getAll().filter(c => c.id !== id);
    this.set(conversations);
  },
};

// Generate unique IDs
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}
