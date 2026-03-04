/**
 * Mapping des crepes du menu vers les images locales (assets/menu-items).
 */
import nutellaBanane from "@/assets/menu-items/nutella-banane.jpg";
import fraiseCreme from "@/assets/menu-items/fraise-creme.jpg";
import lotusBiscoff from "@/assets/menu-items/lotus-biscoff.jpg";
import kinderBueno from "@/assets/menu-items/kinder-bueno.jpg";
import oreoCreme from "@/assets/menu-items/oreo-creme.jpg";
import caramelNoixPecan from "@/assets/menu-items/caramel-noix-pecan.jpg";
import fruitsDesBois from "@/assets/menu-items/fruits-des-bois.jpg";
import pistacheRose from "@/assets/menu-items/pistache-rose.jpg";
import cocoMangue from "@/assets/menu-items/coco-mangue.jpg";
import mielNoix from "@/assets/menu-items/miel-noix.jpg";
import sucreCitron from "@/assets/menu-items/sucre-citron.jpg";
import crepeTimeSignature from "@/assets/menu-items/crepe-time-signature.jpg";

const normalizeMenuName = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const MENU_ITEM_IMAGES: Record<string, string> = {
  "crepe nutella banane": nutellaBanane,
  "crepe fraise creme": fraiseCreme,
  "crepe lotus biscoff": lotusBiscoff,
  "crepe kinder bueno": kinderBueno,
  "crepe oreo creme": oreoCreme,
  "crepe caramel noix de pecan": caramelNoixPecan,
  "crepe fruits des bois": fruitsDesBois,
  "crepe pistache rose": pistacheRose,
  "crepe coco mangue": cocoMangue,
  "crepe miel noix": mielNoix,
  "crepe sucre citron": sucreCitron,
  "crepe time signature": crepeTimeSignature,
};

const FALLBACK_MATCHERS: Array<{ tokens: string[]; image: string }> = [
  { tokens: ["nutella", "banane"], image: nutellaBanane },
];

export const getMenuItemImage = (name: string, fallback?: string) => {
  const key = normalizeMenuName(name);
  const directMatch = MENU_ITEM_IMAGES[key];
  if (directMatch) return directMatch;

  for (const matcher of FALLBACK_MATCHERS) {
    if (matcher.tokens.every((token) => key.includes(token))) {
      return matcher.image;
    }
  }

  return fallback || "";
};
