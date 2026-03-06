/**
 * Menu Categories — client-side derivation from item names.
 *
 * Since the API doesn't include a category field, we infer categories
 * from normalised item name keywords. The order here defines tab order.
 */

export interface MenuCategory {
  id: string;
  label: string;
  emoji: string;
  keywords: string[];
}

export const MENU_CATEGORIES: MenuCategory[] = [
  { id: "all",       label: "Tous",      emoji: "✦",  keywords: [] },
  { id: "chocolat",  label: "Chocolat",  emoji: "🍫", keywords: ["nutella", "kinder", "oreo", "chocolat"] },
  { id: "fruits",    label: "Fruits",    emoji: "🍓", keywords: ["fraise", "fruits", "coco", "mangue", "bois"] },
  { id: "gourmand",  label: "Gourmand",  emoji: "✨", keywords: ["lotus", "caramel", "pistache", "miel", "noix", "pecan"] },
  { id: "classique", label: "Classique", emoji: "🍋", keywords: ["sucre", "citron"] },
  { id: "signature", label: "Signature", emoji: "⭐", keywords: ["signature"] },
];

/** Return the category id for a given item name */
export function getCategoryId(itemName: string): string {
  const normalized = itemName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");

  for (const cat of MENU_CATEGORIES) {
    if (cat.id === "all") continue;
    if (cat.keywords.some((kw) => normalized.includes(kw))) return cat.id;
  }
  return "classique";
}

/**
 * Ingredient list per item — generated from the known crepe lineup.
 * Keys are normalised (lowercased, no accents, trimmed).
 */
const INGREDIENT_MAP: Record<string, string[]> = {
  "nutella banane":       ["Pâte artisanale", "Nutella premium", "Banane fraîche", "Sucre glace"],
  "fraise creme":         ["Pâte artisanale", "Crème chantilly", "Fraises fraîches", "Coulis maison"],
  "lotus biscoff":        ["Pâte artisanale", "Crème Biscoff", "Biscuits Lotus", "Caramel"],
  "kinder bueno":         ["Pâte artisanale", "Crème Kinder", "Noisettes", "Chocolat blanc"],
  "oreo creme":           ["Pâte artisanale", "Crème Oreo", "Biscuits Oreo broyés", "Chocolat noir"],
  "caramel noix de pecan":["Pâte artisanale", "Caramel maison", "Noix de pécan", "Crème fraîche"],
  "fruits des bois":      ["Pâte artisanale", "Framboises", "Myrtilles", "Mûres", "Coulis rouge"],
  "pistache rose":        ["Pâte artisanale", "Crème pistache", "Sirop de rose", "Pistaches hachées"],
  "coco mangue":          ["Pâte artisanale", "Crème de coco", "Mangue fraîche", "Lait de coco"],
  "miel noix":            ["Pâte artisanale", "Miel artisanal", "Noix concassées", "Beurre doux"],
  "sucre citron":         ["Pâte artisanale", "Sucre fin", "Citron frais", "Beurre"],
  "time signature":       ["Pâte artisanale", "Crème vanille", "Caramel beurre salé", "Praline dorée", "Or alimentaire"],
};

/** Return ingredient list for an item name */
export function getIngredients(itemName: string): string[] {
  const normalized = itemName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^crepe\s+/i, "")
    .trim();

  // Try direct or partial match
  for (const [key, ingredients] of Object.entries(INGREDIENT_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return ingredients;
    }
  }
  return ["Pâte artisanale", "Garniture maison", "Ingrédients frais"];
}
