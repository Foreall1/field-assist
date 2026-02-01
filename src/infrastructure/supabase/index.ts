// Client exports (browser-side)
export { createBrowserSupabaseClient, getSupabaseClient } from './client';

// Server exports (API routes, Server Components)
export {
  createAPIRouteClient,
  createServerComponentClient,
  getCurrentUser,
  getCurrentSession,
} from './server';

// Admin exports (server-only, use with caution)
export {
  createAdminClient,
  deleteUser,
  listUsers,
  updateUserMetadata,
} from './admin';

// Middleware exports
export {
  createMiddlewareClient,
  getMiddlewareUser,
  isPublicRoute,
  isAuthRoute,
  isApiRoute,
  getLoginRedirect,
  getHomeRedirect,
} from './middleware';

// Type exports
export type {
  Database,
  Json,
  Tables,
  Enums,
  Functions,
  // Row types
  Profile,
  Gemeente,
  GemeenteContent,
  Article,
  DocumentChunk,
  Conversation,
  Message,
  Project,
  ProjectNote,
  // Insert types
  ProfileInsert,
  ConversationInsert,
  MessageInsert,
  ProjectInsert,
  ProjectNoteInsert,
  // Update types
  ProfileUpdate,
  ConversationUpdate,
  ProjectUpdate,
  ProjectNoteUpdate,
  // Enum types
  UserRole,
  ProjectStatus,
  ContentType,
  MessageRole,
  // Function return types
  MatchArticlesResult,
  MatchDocumentChunksResult,
} from './types';
