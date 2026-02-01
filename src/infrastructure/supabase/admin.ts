import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDatabase = any;

/**
 * WAARSCHUWING: Deze client bypassed Row Level Security!
 *
 * Gebruik deze client ALLEEN voor:
 * - Admin operaties die RLS moeten bypassen
 * - Database migraties
 * - Cron jobs / background tasks
 *
 * NOOIT gebruiken voor:
 * - Reguliere API requests
 * - User-facing operaties
 * - Queries gebaseerd op user input
 */

let adminClient: SupabaseClient<AnyDatabase> | null = null;

/**
 * Creëer een admin Supabase client met service role key
 *
 * Deze client bypassed RLS policies en mag ALLEEN server-side worden gebruikt.
 */
export function createAdminClient(): SupabaseClient<AnyDatabase> {
  // Zorg dat dit alleen server-side wordt aangeroepen
  if (typeof window !== 'undefined') {
    throw new Error(
      'Admin client mag niet in de browser worden gebruikt! ' +
      'Dit is een kritieke security fout.'
    );
  }

  if (adminClient) {
    return adminClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable.');
  }

  if (!serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. ' +
      'This key is required for admin operations.'
    );
  }

  adminClient = createClient<AnyDatabase>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}

/**
 * Specifieke admin functies die de service role key nodig hebben
 */

/**
 * Verwijder een user (admin only)
 */
export async function deleteUser(userId: string): Promise<void> {
  const client = createAdminClient();

  const { error } = await client.auth.admin.deleteUser(userId);

  if (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
}

/**
 * Haal alle users op (admin only)
 */
export async function listUsers(page = 1, perPage = 50) {
  const client = createAdminClient();

  const { data, error } = await client.auth.admin.listUsers({
    page,
    perPage,
  });

  if (error) {
    throw new Error(`Failed to list users: ${error.message}`);
  }

  return data;
}

/**
 * Update user metadata (admin only)
 */
export async function updateUserMetadata(
  userId: string,
  metadata: Record<string, unknown>
): Promise<void> {
  const client = createAdminClient();

  const { error } = await client.auth.admin.updateUserById(userId, {
    user_metadata: metadata,
  });

  if (error) {
    throw new Error(`Failed to update user metadata: ${error.message}`);
  }
}

/**
 * Reset singleton voor testing
 */
export function resetAdminClient(): void {
  adminClient = null;
}
