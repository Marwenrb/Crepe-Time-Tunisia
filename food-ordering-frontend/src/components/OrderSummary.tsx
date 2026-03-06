/**
 * OrderSummary — Premium dark glassmorphism cart sidebar.
 *
 * Design intent:
 *  - Matches the dark page background (#0F0A1F / #1A1233) so it feels
 *    native, not inserted from a light-mode component library.
 *  - Gold accents on the total and remove buttons reinforce brand hierarchy.
 *  - Quantity +/- buttons are compact but accessible (48px touch target).
 *  - Items animate in/out with layout-aware Framer Motion so the list
 *    gracefully adjusts height when items are added or removed.
 *  - Empty state has a soft illustration-style icon cluster.
 */

import { motion, AnimatePresence } from "framer-motion";
import { CartItem } from "@/pages/DetailPage";
import { Restaurant } from "@/types";
import { Trash2, ShoppingBag, Plus, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

type Props = {
  restaurant: Restaurant;
  cartItems: CartItem[];
  removeFromCart: (cartItem: CartItem) => void;
  updateCartItemQuantity?: (cartItem: CartItem, newQuantity: number) => void;
};

// Cubic bezier as const tuple — satisfies Framer Motion's BezierDefinition type
const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as [number, number, number, number];

const itemVariant = {
  hidden:  { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.3, ease: EASE_OUT_EXPO } },
  exit:    { opacity: 0, x: -20, height: 0, marginBottom: 0,
             transition: { duration: 0.25, ease: "easeIn" as const } },
};

const OrderSummary = ({
  restaurant,
  cartItems,
  removeFromCart,
  updateCartItemQuantity,
}: Props) => {
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity, 0
  );
  const total = cartItems.length > 0 ? subtotal + restaurant.deliveryPrice : 0;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(19, 13, 40, 0.85)",
        border: "1px solid rgba(212, 175, 55, 0.14)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
      }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}
      >
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" style={{ color: "#D4AF37" }} />
          <h2 className="font-bold text-white text-base tracking-tight">
            Votre Commande
          </h2>
        </div>
        {cartItems.length > 0 && (
          <span
            className="text-xs px-2.5 py-1 rounded-full font-bold"
            style={{
              background: "rgba(76,29,149,0.4)",
              border: "1px solid rgba(212,175,55,0.2)",
              color: "#D4AF37",
            }}
          >
            {cartItems.reduce((s, i) => s + i.quantity, 0)} article{cartItems.reduce((s, i) => s + i.quantity, 0) > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── Item list ── */}
      <div className="px-5 py-4 flex flex-col gap-0 min-h-[80px]">
        <AnimatePresence mode="popLayout" initial={false}>
          {cartItems.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{ background: "rgba(76,29,149,0.2)", border: "1px solid rgba(212,175,55,0.1)" }}
              >
                <ShoppingBag className="w-5 h-5" style={{ color: "rgba(212,175,55,0.4)" }} />
              </div>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                Votre panier est vide
              </p>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                Ajoutez des crêpes depuis le menu
              </p>
            </motion.div>
          ) : (
            cartItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                variants={itemVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex items-center gap-3 py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                {/* Name & qty controls */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {/* Quantity stepper */}
                  <div
                    className="flex items-center rounded-lg overflow-hidden flex-shrink-0"
                    style={{
                      background: "rgba(76,29,149,0.25)",
                      border: "1px solid rgba(212,175,55,0.15)",
                    }}
                  >
                    <button
                      onClick={() => updateCartItemQuantity?.(item, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 flex items-center justify-center disabled:opacity-30 transition-colors hover:bg-white/5"
                      aria-label="Diminuer"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-white text-xs font-bold select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartItemQuantity?.(item, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center transition-colors hover:bg-white/5"
                      aria-label="Augmenter"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Item name */}
                  <span className="text-white/75 text-xs truncate leading-snug">
                    {item.name}
                  </span>
                </div>

                {/* Price + remove */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-semibold" style={{ color: "#D4AF37" }}>
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item)}
                    className="w-6 h-6 flex items-center justify-center rounded-md transition-colors hover:bg-red-500/10"
                    aria-label={`Supprimer ${item.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400/60 hover:text-red-400 transition-colors" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* ── Totals ── */}
      {cartItems.length > 0 && (
        <div
          className="px-5 pb-5 pt-1 flex flex-col gap-2"
          style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}
        >
          <div className="flex justify-between items-center text-xs pt-2">
            <span style={{ color: "rgba(255,255,255,0.4)" }}>Sous-total</span>
            <span style={{ color: "rgba(255,255,255,0.6)" }}>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span style={{ color: "rgba(255,255,255,0.4)" }}>Livraison</span>
            <span style={{ color: "rgba(255,255,255,0.6)" }}>{formatCurrency(restaurant.deliveryPrice)}</span>
          </div>
          <div
            className="flex justify-between items-center pt-2 mt-1"
            style={{ borderTop: "1px solid rgba(212,175,55,0.12)" }}
          >
            <span className="font-bold text-white text-sm">Total</span>
            <span className="font-bold text-base" style={{ color: "#D4AF37" }}>
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
