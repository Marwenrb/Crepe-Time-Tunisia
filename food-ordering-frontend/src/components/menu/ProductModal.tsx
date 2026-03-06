/**
 * ProductModal — Premium product detail overlay.
 *
 * Design intent:
 *  - Full-screen dark overlay with blur veil for cinematic focus state.
 *  - Spring-driven scale+fade entrance — feels snappy, not mechanical.
 *  - Two-column layout on md+: large image left, details right.
 *  - Ingredient tags with a soft gold tint remind users of artisan quality.
 *  - Quantity stepper uses spring animations on number change.
 *  - CTA button has a glow-pulse animation to draw the eye without being loud.
 *  - Scroll-lock applied while modal is open (via useEffect on body).
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingCart, Star, Leaf } from "lucide-react";
import { MenuItem } from "@/types";
import { getMenuItemImage } from "@/config/menu-images";
import { getIngredients } from "@/config/menu-categories";

type Props = {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, qty: number) => void;
  initialCartQty: number;
};

const overlayVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
};

const panelVariants = {
  hidden:  { opacity: 0, scale: 0.93, y: 24 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring" as const, stiffness: 320, damping: 28, delay: 0.05 },
  },
  exit: {
    opacity: 0, scale: 0.95, y: 16,
    transition: { duration: 0.18, ease: "easeIn" as const },
  },
};

export const ProductModal = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
  initialCartQty,
}: Props) => {
  const [qty, setQty] = useState(1);

  // Reset qty when a new item is opened
  useEffect(() => {
    if (isOpen) setQty(1);
  }, [item, isOpen]);

  // Scroll-lock when modal open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleAdd = () => {
    if (!item) return;
    onAddToCart(item, qty);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && item && (
        <>
          {/* ── Overlay backdrop ── */}
          <motion.div
            key="overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50"
            style={{ background: "rgba(7, 4, 16, 0.82)", backdropFilter: "blur(8px)" }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ── Modal panel ── */}
          <motion.div
            key="panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label={item.name}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl pointer-events-auto flex flex-col md:flex-row"
              style={{
                background: "#130D28",
                border: "1px solid rgba(212, 175, 55, 0.18)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.06)",
              }}
            >
              {/* ── Close button ── */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                aria-label="Fermer"
              >
                <X className="w-4 h-4 text-white/70" />
              </motion.button>

              {/* ── Image column ── */}
              <div className="relative md:w-[45%] flex-shrink-0">
                <div className="h-56 md:h-full overflow-hidden">
                  <motion.img
                    src={getMenuItemImage(item.name, item.imageUrl)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                {/* Gradient fade into panel */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#130D28]/80 hidden md:block" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#130D28]/80 md:hidden" />

                {/* Rating pill */}
                <div
                  className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
                  style={{ background: "rgba(19,13,40,0.85)", border: "1px solid rgba(212,175,55,0.25)", color: "#D4AF37" }}
                >
                  <Star className="w-3 h-3 fill-current" />
                  Artisan
                </div>
              </div>

              {/* ── Details column ── */}
              <div className="flex flex-col gap-5 p-5 md:p-7 flex-1 overflow-y-auto">

                {/* Name */}
                <div>
                  <h2
                    className="text-2xl font-bold text-white leading-tight"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.name}
                  </h2>
                  <p className="text-white/45 text-xs mt-1 uppercase tracking-widest font-medium">
                    Crêpe artisanale · Crêpe Time
                  </p>
                </div>

                {/* Price */}
                <div
                  className="text-3xl font-bold"
                  style={{ color: "#D4AF37", fontFamily: "var(--font-heading)" }}
                >
                  {(item.price / 100).toFixed(2)}
                  <span className="text-base font-medium ml-1.5" style={{ color: "rgba(212,175,55,0.6)" }}>TND</span>
                </div>

                {/* Ingredients */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Leaf className="w-3.5 h-3.5 text-crepe-gold/60" />
                    <span className="text-white/40 text-xs uppercase tracking-widest font-semibold">Ingrédients</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getIngredients(item.name).map((ingredient) => (
                      <span
                        key={ingredient}
                        className="text-xs px-3 py-1 rounded-full"
                        style={{
                          background: "rgba(76, 29, 149, 0.25)",
                          border: "1px solid rgba(212, 175, 55, 0.15)",
                          color: "rgba(255,255,255,0.65)",
                        }}
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quantity selector */}
                <div>
                  <span className="text-white/40 text-xs uppercase tracking-widest font-semibold block mb-2.5">
                    Quantité
                  </span>
                  <div
                    className="inline-flex items-center gap-0 rounded-xl overflow-hidden"
                    style={{ border: "1px solid rgba(212,175,55,0.2)", background: "rgba(76,29,149,0.15)" }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      disabled={qty <= 1}
                      className="w-10 h-10 flex items-center justify-center text-white/50 disabled:opacity-30 hover:bg-white/5 transition-colors"
                      aria-label="Diminuer la quantité"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </motion.button>

                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={qty}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="w-10 text-center text-white font-bold text-base select-none"
                      >
                        {qty}
                      </motion.span>
                    </AnimatePresence>

                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setQty((q) => q + 1)}
                      className="w-10 h-10 flex items-center justify-center text-white/50 hover:bg-white/5 transition-colors"
                      aria-label="Augmenter la quantité"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                  {initialCartQty > 0 && (
                    <p className="text-xs mt-1.5" style={{ color: "rgba(212,175,55,0.5)" }}>
                      {initialCartQty} déjà dans le panier
                    </p>
                  )}
                </div>

                {/* Total preview */}
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: "rgba(76,29,149,0.15)", border: "1px solid rgba(212,175,55,0.1)" }}
                >
                  <span className="text-white/50 text-sm">Total</span>
                  <span className="font-bold" style={{ color: "#D4AF37" }}>
                    {((item.price * qty) / 100).toFixed(2)} TND
                  </span>
                </div>

                {/* CTA */}
                <motion.button
                  onClick={handleAdd}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm mt-auto animate-glow-pulse"
                  style={{
                    background: "linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)",
                    border: "1px solid rgba(212,175,55,0.3)",
                    color: "#ffffff",
                    boxShadow: "0 0 24px rgba(76,29,149,0.4), 0 4px 16px rgba(0,0,0,0.3)",
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Ajouter au Panier
                  <span
                    className="ml-auto text-xs px-2 py-0.5 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.12)", color: "#D4AF37" }}
                  >
                    {((item.price * qty) / 100).toFixed(2)} TND
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
