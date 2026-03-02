/**
 * Seed Crêpe Time Tunisia — Supabase Auth + profiles.
 * Run: cd food-ordering-backend && npm run seed
 * Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and migration 002_supabase_auth.sql executed.
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

const CREPE_IMAGE = "https://images.unsplash.com/photo-1635350736475-c8cef4b21906?w=400&q=80";

const CREPE_MENU = [
  { name: "Crêpe Nutella Banane", price: 1200 },
  { name: "Crêpe Fraise Crème", price: 1400 },
  { name: "Crêpe Lotus Biscoff", price: 1500 },
  { name: "Crêpe Kinder Bueno", price: 1600 },
  { name: "Crêpe Oréo Crème", price: 1400 },
  { name: "Crêpe Caramel Noix de Pécan", price: 1500 },
  { name: "Crêpe Fruits des Bois", price: 1300 },
  { name: "Crêpe Pistache Rose", price: 1700 },
  { name: "Crêpe Coco Mangue", price: 1400 },
  { name: "Crêpe Miel & Noix", price: 1100 },
  { name: "Crêpe Sucre & Citron", price: 900 },
  { name: "Crêpe Time Signature", price: 1900 },
];

async function main() {
  try {
    const { error: testErr } = await supabase.from("profiles").select("id").limit(1);
    if (testErr && testErr.code === "42P01") {
      console.error("❌ Table 'profiles' not found. Run supabase/migrations/002_supabase_auth.sql in Supabase SQL Editor.");
      process.exit(1);
    }
    console.log("✅ Connected to Supabase");
  } catch (e) {
    console.error("❌ Supabase connection failed:", (e as Error).message);
    process.exit(1);
  }

  let ownerId: string;
  const { data: existingProfile } = await supabase.from("profiles").select("id").eq("email", "admin@crepetime.tn").single();

  if (existingProfile) {
    ownerId = existingProfile.id;
    await supabase.from("profiles").update({ is_admin: true }).eq("id", ownerId);
    console.log("ℹ️ Admin existe déjà: admin@crepetime.tn");
  } else {
    const { data: newUser, error } = await supabase.auth.admin.createUser({
      email: "admin@crepetime.tn",
      password: "CrepeTime2026!",
      email_confirm: true,
      user_metadata: { name: "Marouan Rabai" },
    });

    if (error) {
      if (error.message?.includes("already been registered")) {
        const { data: users } = await supabase.auth.admin.listUsers();
        const adminUser = users?.users?.find((u) => u.email === "admin@crepetime.tn");
        if (adminUser) {
          ownerId = adminUser.id;
          await supabase.from("profiles").upsert(
            { id: ownerId, email: "admin@crepetime.tn", name: "Marouan Rabai", city: "Nabeul", country: "Tunisia", is_admin: true },
            { onConflict: "id" }
          );
          console.log("ℹ️ Admin existe déjà (auth): admin@crepetime.tn — profil mis à jour");
        } else {
          console.error("❌ Admin existe en auth mais introuvable. Réessayez ou créez le profil manuellement.");
          process.exit(1);
        }
      } else {
        console.error("❌ Failed to create admin:", error?.message);
        process.exit(1);
      }
    } else if (newUser?.user) {
      ownerId = newUser.user.id;
      await supabase.from("profiles").upsert(
        { id: ownerId, email: "admin@crepetime.tn", name: "Marouan Rabai", city: "Nabeul", country: "Tunisia", is_admin: true },
        { onConflict: "id" }
      );
      console.log("✅ Admin créé: admin@crepetime.tn / CrepeTime2026!");
    } else {
      console.error("❌ Failed to create admin");
      process.exit(1);
    }
  }

  const { data: testProfile } = await supabase.from("profiles").select("id").eq("email", "test@user.com").single();
  if (!testProfile) {
    const { data: newTest, error } = await supabase.auth.admin.createUser({
      email: "test@user.com",
      password: "12345678",
      email_confirm: true,
      user_metadata: { name: "Test Client" },
    });
    if (!error && newTest.user) {
      await supabase.from("profiles").upsert(
        { id: newTest.user.id, email: "test@user.com", name: "Test Client", city: "Nabeul", country: "Tunisia" },
        { onConflict: "id" }
      );
      console.log("✅ Test client créé: test@user.com / 12345678");
    }
  }

  const menuItemsData = CREPE_MENU.map((item) => ({
    id: crypto.randomUUID(),
    name: item.name,
    price: item.price,
    imageUrl: CREPE_IMAGE,
  }));

  const { data: existingRestaurant } = await supabase
    .from("restaurants")
    .select("id")
    .eq("restaurant_name", "Crêpe Time Tunisia")
    .single();

  if (existingRestaurant) {
    await supabase
      .from("restaurants")
      .update({ menu_items: menuItemsData, last_updated: new Date().toISOString() })
      .eq("id", existingRestaurant.id);
    console.log("ℹ️ Restaurant existe déjà. Mise à jour du menu...");
    console.log("✅ Menu mis à jour avec", CREPE_MENU.length, "crêpes");
  } else {
    const { data: newRestaurant, error } = await supabase
      .from("restaurants")
      .insert({
        user_id: ownerId,
        restaurant_name: "Crêpe Time Tunisia",
        city: "Nabeul",
        country: "Tunisia",
        delivery_price: 300,
        estimated_delivery_time: 30,
        cuisines: ["Crêpes", "Desserts", "Français"],
        menu_items: menuItemsData,
        image_url: "https://images.unsplash.com/photo-1635350736475-c8cef4b21906?w=1200&q=90",
        last_updated: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error || !newRestaurant) {
      console.error("❌ Failed to create restaurant:", error?.message);
      process.exit(1);
    }
    console.log("✅ Restaurant créé: Crêpe Time Tunisia");
    console.log("   Menu:", CREPE_MENU.length, "crêpes | Livraison: 3.00 TND | ~30 min");
  }

  console.log("\n--- Menu ---");
  CREPE_MENU.forEach((item, i) => {
    console.log(`  ${i + 1}. ${item.name} — ${(item.price / 100).toFixed(2)} TND`);
  });

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
