/**
 * Supabase client for Crêpe Time Tunisia.
 * Uses service role key for full database access (bypasses RLS).
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  const msg = "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env";
  if (typeof process !== "undefined") {
    console.error("❌", msg);
    process.exit(1);
  }
  throw new Error(msg);
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

/**
 * Transform Supabase row (id) to API format (_id) for frontend compatibility
 */
export function toApiFormat<T extends Record<string, unknown>>(row: T): T & { _id: string } {
  if (!row) return row as T & { _id: string };
  const { id, ...rest } = row as T & { id?: string };
  return { ...rest, _id: id || (row as { id?: string }).id || "" } as T & { _id: string };
}

export function toApiFormatArray<T extends Record<string, unknown>>(rows: T[]): (T & { _id: string })[] {
  return (rows || []).map(toApiFormat);
}
