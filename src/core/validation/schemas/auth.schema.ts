import { z } from 'zod';

/**
 * User roles in de applicatie
 */
export const UserRoleSchema = z.enum([
  'vergunningverlener',
  'toezichthouder',
  'jurist',
  'beleidsmedewerker',
]);

export type UserRole = z.infer<typeof UserRoleSchema>;

/**
 * Login request validatie
 */
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail is verplicht')
    .email('Ongeldig e-mailadres'),
  password: z
    .string()
    .min(1, 'Wachtwoord is verplicht')
    .min(8, 'Wachtwoord moet minimaal 8 karakters zijn'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

/**
 * Registratie request validatie
 */
export const RegisterSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail is verplicht')
    .email('Ongeldig e-mailadres'),
  password: z
    .string()
    .min(8, 'Wachtwoord moet minimaal 8 karakters zijn')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Wachtwoord moet minimaal 1 hoofdletter, 1 kleine letter en 1 cijfer bevatten'
    ),
  confirmPassword: z.string(),
  name: z
    .string()
    .min(2, 'Naam moet minimaal 2 karakters zijn')
    .max(100, 'Naam mag maximaal 100 karakters zijn')
    .transform((val) => val.trim()),
  role: UserRoleSchema.optional(),
  organization: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Wachtwoorden komen niet overeen',
  path: ['confirmPassword'],
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

/**
 * Profiel update validatie
 */
export const UpdateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Naam moet minimaal 2 karakters zijn')
    .max(100, 'Naam mag maximaal 100 karakters zijn')
    .transform((val) => val.trim())
    .optional(),
  role: UserRoleSchema.optional(),
  organization: z.string().optional(),
  preferences: z
    .object({
      theme: z.enum(['light', 'dark', 'system']).optional(),
      notifications: z.boolean().optional(),
      language: z.enum(['nl', 'en']).optional(),
    })
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

/**
 * Wachtwoord reset request validatie
 */
export const ResetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail is verplicht')
    .email('Ongeldig e-mailadres'),
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

/**
 * Nieuw wachtwoord instellen validatie
 */
export const SetNewPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Wachtwoord moet minimaal 8 karakters zijn')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Wachtwoord moet minimaal 1 hoofdletter, 1 kleine letter en 1 cijfer bevatten'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Wachtwoorden komen niet overeen',
  path: ['confirmPassword'],
});

export type SetNewPasswordInput = z.infer<typeof SetNewPasswordSchema>;
