/**
 * Database connection — Supabase PostgreSQL.
 * Replaces MongoDB/Mongoose.
 */
import { supabase } from "./supabase";

export async function connectDatabase(): Promise<void> {
  try {
    const { error } = await supabase.from("profiles").select("id").limit(1);
    if (error) {
    if (error.code === "42P01") {
      console.error("❌ Table 'profiles' not found. Run supabase/migrations/002_supabase_auth.sql in Supabase SQL Editor.");
      }
      throw error;
    }
    if (process.env.NODE_ENV !== "production") console.log("✅ Connected to Supabase!");
  } catch (err) {
    const msg = (err as Error).message;
    console.error("❌ Supabase connection failed:", msg);
    console.error("\n📌 Vérifiez :");
    console.error("   1. SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env");
    console.error("   2. Exécutez le schéma SQL dans supabase/migrations/001_initial_schema.sql");
    process.exit(1);
  }
}
