/**
 * Check Supabase connection.
 * Run: cd food-ordering-backend && npm run check-db
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required in .env");
  process.exit(1);
}

const supabase = createClient(url, key);

async function main() {
  try {
    const { data, error } = await supabase.from("profiles").select("id").limit(1);
    if (error) throw error;
    console.log("✅ Supabase connection OK");
    console.log("   Users table accessible");
    if (data?.length) {
      console.log("   Sample user id:", data[0].id);
    }
  } catch (e) {
    console.error("❌ Connection failed:", (e as Error).message);
    process.exit(1);
  }
}

main();
