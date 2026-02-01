import { z } from 'zod';

/**
 * Project status
 */
export const ProjectStatusSchema = z.enum(['actief', 'afgerond', 'gepauzeerd']);

export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;

/**
 * Hex color validatie
 */
const HexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Ongeldige kleurcode (gebruik #RRGGBB formaat)');

/**
 * Project create schema
 */
export const CreateProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Naam is verplicht')
    .max(100, 'Naam mag maximaal 100 karakters zijn')
    .transform((val) => val.trim()),
  description: z
    .string()
    .max(1000, 'Beschrijving mag maximaal 1000 karakters zijn')
    .optional()
    .default(''),
  color: HexColorSchema.optional(),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

/**
 * Project update schema
 */
export const UpdateProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Naam is verplicht')
    .max(100, 'Naam mag maximaal 100 karakters zijn')
    .transform((val) => val.trim())
    .optional(),
  description: z
    .string()
    .max(1000, 'Beschrijving mag maximaal 1000 karakters zijn')
    .optional(),
  color: HexColorSchema.optional(),
  status: ProjectStatusSchema.optional(),
});

export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

/**
 * Project note create schema
 */
export const CreateNoteSchema = z.object({
  content: z
    .string()
    .min(1, 'Notitie mag niet leeg zijn')
    .max(10000, 'Notitie mag maximaal 10000 karakters zijn')
    .transform((val) => val.trim()),
  articleId: z.string().uuid().optional(),
});

export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;

/**
 * Project note update schema
 */
export const UpdateNoteSchema = z.object({
  content: z
    .string()
    .min(1, 'Notitie mag niet leeg zijn')
    .max(10000, 'Notitie mag maximaal 10000 karakters zijn')
    .transform((val) => val.trim()),
});

export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;

/**
 * Project ID parameter validatie
 */
export const ProjectIdSchema = z.object({
  projectId: z.string().uuid('Ongeldig project ID'),
});

/**
 * Note ID parameter validatie
 */
export const NoteIdSchema = z.object({
  noteId: z.string().uuid('Ongeldig notitie ID'),
});

/**
 * Project met notities response type
 */
export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  color: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  notes: ProjectNote[];
  articleIds: string[];
  conversationIds: string[];
}

export interface ProjectNote {
  id: string;
  projectId: string;
  content: string;
  articleId?: string;
  createdAt: string;
  updatedAt: string;
}
