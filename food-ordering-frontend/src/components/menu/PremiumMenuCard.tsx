/**
 * PremiumMenuCard — Luxury product card for Crêpe Time menu items.
 *
 * Design intent:
 *  - Dark glassmorphism surface (#1A1233/70) with a subtle gold border that
 *    brightens on hover — signals interactivity without shouting.
 *  - Image scales to 1.08 on hover (inside a clipped container so nothing leaks)
 *    giving a tactile zoom that makes the food look appetising.
 *  - A "floating add" FAB button reveals on card hover for a modern product feel.
 *  - When the item is already in cart the badge shows the quantity with a
 *    spring animation — instant feedback without a toast interruption.
 *  - Card entrance uses staggered Framer Motion variants so the grid
 *    reveals row by row rather than all at once.
 *  - Price is highlighted in gold — the premium system-wide accent colour.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ShoppingCart, Check } from "lucide-react";
import { MenuItem } from "@/types";
import { getMenuItemImage } from "@/config/menu-images";

type Props = {
  menuItem: MenuItem;
  /** Index used to stagger the entrance animation */
  index: number;
  /** How many of this item are already in the cart (0 = not in cart) */
  cartQuantity: number;
  addToCart: () => void;
  onCardClick: () => void;
};

// Cubic bezier as const tuple — satisfies Framer Motion's BezierDefinition type
const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** Entrance animation — parent grid supplies the stagger context via AnimatePresence */
export const cardVariant = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.07,
      duration: 0.5,
      ease: EASE_OUT_EXPO,
    },
  }),
};

export const PremiumMenuCard = ({
  menuItem,
  index,
  cartQuantity,
  addToCart,
  onCardClick,
}: Props) => {
  const [justAdded, setJustAdded] = useState(false);
  const imageUrl = getMenuItemImage(menuItem.name, menuItem.imageUrl);
  const price = (menuItem.price / 100).toFixed(2);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <motion.article
      custom={index}
      variants={cardVariant}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
      onClick={onCardClick}
      className="relative flex flex-col rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        background: "rgba(26, 18, 51, 0.7)",
        border: "1px solid rgba(212, 175, 55, 0.12)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        transition: "border-color 0.25s, box-shadow 0.25s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(212, 175, 55, 0.38)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 8px 40px rgba(76,29,149,0.4), 0 0 0 1px rgba(212,175,55,0.18)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(212, 175, 55, 0.12)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.35)";
      }}
      role="button"
      tabIndex={0}
      aria-label={`Voir ${menuItem.name}`}
      onKeyDown={(e) => e.key === "Enter" && onCardClick()}
    >
      {/* ── Image area ── */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <motion.img
          src={imageUrl}
          alt={menuItem.name}
          width={400}
          height={300}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
          loading="lazy"
          decoding="async"
        />

        {/* Dark scrim at bottom of image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A1F] via-transparent to-transparent opacity-60" />

        {/* Cart quantity badge — top right corner */}
        <AnimatePresence>
          {cartQuantity > 0 && (
            <motion.div
              key="qty-badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
              style={{
                background: "rgba(76,29,149,0.9)",
                border: "1px solid rgba(212,175,55,0.4)",
                color: "#D4AF37",
                backdropFilter: "blur(8px)",
              }}
            >
              <ShoppingCart className="w-3 h-3" />
              {cartQuantity}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating FAB — visible on hover */}
        <motion.button
          onClick={handleAdd}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{
            background: justAdded
              ? "linear-gradient(135deg, #16a34a, #15803d)"
              : "linear-gradient(135deg, #D4AF37 0%, #E5C76B 100%)",
            boxShadow: "0 4px 16px rgba(212,175,55,0.5)",
            transition: "background 0.3s",
          }}
          aria-label={`Ajouter ${menuItem.name} au panier`}
        >
          <AnimatePresence mode="wait">
            {justAdded ? (
              <motion.span
                key="check"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="w-4 h-4 text-white" />
              </motion.span>
            ) : (
              <motion.span
                key="plus"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Plus className="w-4 h-4 text-crepe-dark" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Name */}
        <h3
          className="text-white font-semibold text-base leading-snug line-clamp-1"
          style={{ fontFamily: "var(--font-heading)" }}
          title={menuItem.name}
        >
          {menuItem.name}
        </h3>

        {/* Bottom row: price + add button */}
        <div className="flex items-center justify-between mt-auto pt-1">
          {/* Gold price */}
          <div className="flex flex-col">
            <span className="text-white/40 text-[10px] uppercase tracking-wider font-medium">Prix</span>
            <span
              className="text-lg font-bold tracking-tight"
              style={{ color: "#D4AF37" }}
            >
              {price}
              <span className="text-xs font-medium ml-1 text-crepe-gold/70">TND</span>
            </span>
          </div>

          {/* Add to cart button */}
          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.92 }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
            style={{
              background: justAdded
                ? "rgba(22, 163, 74, 0.15)"
                : "rgba(76, 29, 149, 0.6)",
              border: justAdded
                ? "1px solid rgba(22, 163, 74, 0.4)"
                : "1px solid rgba(212, 175, 55, 0.25)",
              color: justAdded ? "#4ade80" : "#D4AF37",
              backdropFilter: "blur(8px)",
              transition: "all 0.3s",
            }}
            aria-label={`Ajouter ${menuItem.name}`}
          >
            <AnimatePresence mode="wait">
              {justAdded ? (
                <motion.span
                  key="check-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Ajouté
                </motion.span>
              ) : (
                <motion.span
                  key="add-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Ajouter
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default PremiumMenuCard;
