// Types voor FIELD Assist kennisplatform

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: Category;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  readTime: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  articleCount: number;
}

export interface SearchResult {
  id: string;
  type: 'article' | 'document' | 'faq';
  title: string;
  excerpt: string;
  category: string;
  relevance: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  relatedArticles: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  avatar?: string;
  preferences: UserPreferences;
  specializations: string[];
  createdAt: string;
  onboardingComplete: boolean;
}

export type UserRole = 'vergunningverlener' | 'toezichthouder' | 'jurist' | 'beleidsmedewerker';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  defaultSearchScope: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  color: string;
  createdAt: string;
  updatedAt: string;
  articleIds: string[];
  notes: ProjectNote[];
  conversationIds: string[];
}

export type ProjectStatus = 'actief' | 'afgerond' | 'gepauzeerd';

export interface ProjectNote {
  id: string;
  content: string;
  articleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Citation[];
  isStreaming?: boolean;
}

export interface Citation {
  id: string;
  title: string;
  type: 'artikel' | 'wet' | 'jurisprudentie' | 'beleid';
  excerpt: string;
  articleId?: string;
  url?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'update' | 'alert';
  read: boolean;
  createdAt: string;
}
