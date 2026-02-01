import { z } from 'zod';
import { UserRoleSchema } from './auth.schema';

/**
 * Chat bericht schema
 */
export const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1).max(50000),
});

export type Message = z.infer<typeof MessageSchema>;

/**
 * Citatie schema
 */
export const CitationSchema = z.object({
  id: z.string(),
  title: z.string(),
  source: z.string().optional(),
  url: z.string().url().optional(),
});

export type Citation = z.infer<typeof CitationSchema>;

/**
 * Chat request validatie
 */
export const ChatRequestSchema = z.object({
  query: z
    .string()
    .min(1, 'Vraag mag niet leeg zijn')
    .max(2000, 'Vraag mag maximaal 2000 karakters zijn')
    .transform((val) => val.trim()),
  userRole: UserRoleSchema.optional(),
  conversationHistory: z
    .array(MessageSchema)
    .max(50, 'Maximaal 50 berichten in geschiedenis')
    .optional()
    .default([]),
  stream: z.boolean().optional().default(false),
  conversationId: z.string().uuid().optional(),
  gemeenteId: z.string().uuid().optional(),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

/**
 * Chat response schema
 */
export const ChatResponseSchema = z.object({
  content: z.string(),
  citations: z.array(CitationSchema).optional(),
  conversationId: z.string().uuid().optional(),
});

export type ChatResponse = z.infer<typeof ChatResponseSchema>;

/**
 * Conversation create schema
 */
export const CreateConversationSchema = z.object({
  title: z
    .string()
    .min(1, 'Titel is verplicht')
    .max(200, 'Titel mag maximaal 200 karakters zijn')
    .transform((val) => val.trim())
    .optional(),
  projectId: z.string().uuid().optional(),
});

export type CreateConversationInput = z.infer<typeof CreateConversationSchema>;

/**
 * Conversation update schema
 */
export const UpdateConversationSchema = z.object({
  title: z
    .string()
    .min(1, 'Titel is verplicht')
    .max(200, 'Titel mag maximaal 200 karakters zijn')
    .transform((val) => val.trim())
    .optional(),
  projectId: z.string().uuid().nullable().optional(),
});

export type UpdateConversationInput = z.infer<typeof UpdateConversationSchema>;
