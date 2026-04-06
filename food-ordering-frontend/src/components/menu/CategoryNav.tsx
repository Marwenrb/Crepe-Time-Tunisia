/**
 * CategoryNav v5 — Prism Glass Tab System
 *
 * Completely new visual DNA:
 *  - Frosted glass panel (backdrop-blur + dark translucent bg)
 *  - Rounded-lg glass chips (not round pills)
 *  - Active: neon rotating border + frosted glass interior + gold text neon glow
 *  - Sliding gold underline beam (layoutId morph between tabs)
 *  - Inactive: dark glass chip with edge-light hover reveal via CSS
 *  - Gap-based spacing (no circuit-trace separators)
 *  - Prismatic neon trims (gold → violet gradient)
 *  - ALL animations GPU-composited (transform + opacity only)
 *  - Sticky with correct offset matching Header heights
 */

import { useRef } from "react";
import { motion } from "framer-motion";
import { MenuCategory, getCategoryId } from "@/config/menu-categories";
import { MenuItem } from "@/types";

type Props = {
  categories: MenuCategory[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  menuItems: MenuItem[];
};

/* ── GPU-composited keyframes + hover states ── */
const STYLES = `
  @keyframes cn5-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes cn5-shimmer {
    0%   { transform: translateX(-160%); opacity: 0; }
    12%  { opacity: 0.5; }
    88%  { opacity: 0.12; }
    100% { transform: translateX(160%); opacity: 0; }
  }
  @keyframes cn5-scan {
    0%   { transform: translateX(-120%); opacity: 0; }
    8%   { opacity: 0.35; }
    92%  { opacity: 0.1; }
    100% { transform: translateX(600%); opacity: 0; }
  }
  @keyframes cn5-beam-breathe {
    0%, 100% { opacity: 0.7; }
    50%      { opacity: 1; }
  }
  .cn5-track::-webkit-scrollbar { display: none; }

  /* Inactive chip hover — edge-light reveal */
  .cn5-chip:not([data-active="true"]) .cn5-bg {
    transition: background 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
  }
  .cn5-chip:not([data-active="true"]):hover .cn5-bg {
    background: rgba(212,175,55,0.07);
    border-color: rgba(212,175,55,0.28);
    box-shadow: 0 0 16px rgba(212,175,55,0.06), inset 0 1px 0 rgba(212,175,55,0.1);
  }
  .cn5-chip:not([data-active="true"]) .cn5-label {
    transition: color 220ms ease, text-shadow 220ms ease;
  }
  .cn5-chip:not([data-active="true"]):hover .cn5-label {
    color: rgba(255,255,255,0.95) !important;
    text-shadow: 0 0 10px rgba(212,175,55,0.25);
  }
  .cn5-chip:not([data-active="true"]) .cn5-emoji {
    transition: filter 220ms ease;
  }
  .cn5-chip:not([data-active="true"]):hover .cn5-emoji {
    filter: drop-shadow(0 0 7px rgba(212,175,55,0.55));
  }
  .cn5-chip:not([data-active="true"]) .cn5-count {
    transition: border-color 220ms ease, color 220ms ease;
  }
  .cn5-chip:not([data-active="true"]):hover .cn5-count {
    border-color: rgba(212,175,55,0.3);
    color: rgba(212,175,55,0.6) !important;
  }
  .cn5-chip:active { transform: scale(0.97); }
  .cn5-chip { transition: transform 120ms ease; }
`;

export const CategoryNav = ({
  categories,
  activeCategory,
  onCategoryChange,
  menuItems,
}: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const getCount = (categoryId: string) => {
    if (categoryId === "all") return menuItems.length;
    return menuItems.filter((item) => getCategoryId(item.name) === categoryId).length;
  };

  const visibleCats = categories.filter(
    (cat) => getCount(cat.id) > 0 || cat.id === "all"
  );

  return (
    <nav
      aria-label="Catégories de crêpes"
      className="sticky top-[56px] sm:top-[64px] md:top-[72px] z-30 -mx-4 sm:-mx-6 lg:-mx-8 mt-2"
      style={{ isolation: "isolate" }}
    >
      <style>{STYLES}</style>

      {/* ── Frosted glass panel bg ── */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,4,26,0.93) 0%, rgba(18,7,45,0.9) 50%, rgba(12,5,30,0.93) 100%)",
          backdropFilter: "blur(20px) saturate(1.4)",
          WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        }}
      />

      {/* ── Top prismatic neon trim ── */}
      <div
        className="absolute inset-x-0 top-0 h-[1.5px]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, transparent 2%, rgba(124,58,237,0.15) 18%, rgba(212,175,55,0.5) 42%, rgba(237,208,96,0.35) 58%, rgba(124,58,237,0.2) 82%, transparent 98%)",
        }}
      />

      {/* ── Bottom prismatic neon trim ── */}
      <div
        className="absolute inset-x-0 bottom-0 h-[1.5px]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, transparent 2%, rgba(212,175,55,0.12) 20%, rgba(124,58,237,0.3) 45%, rgba(212,175,55,0.4) 65%, rgba(124,58,237,0.1) 85%, transparent 98%)",
        }}
      />

      {/* ── Ambient scan beam (GPU: translateX) ── */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 pointer-events-none"
        style={{
          width: "16%",
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.04), rgba(124,58,237,0.02), transparent)",
          animation: "cn5-scan 9s ease-in-out infinite",
          zIndex: 1,
        }}
      />

      {/* ── Scroll track ── */}
      <div
        ref={scrollRef}
        className="cn5-track relative flex items-center gap-1.5 sm:gap-2 overflow-x-auto px-3 sm:px-5 lg:px-8"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          minHeight: 54,
          paddingTop: 9,
          paddingBottom: 9,
          WebkitOverflowScrolling: "touch",
        }}
      >
        {visibleCats.map((cat) => {
          const count = getCount(cat.id);
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className="cn5-chip relative flex-shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/50 focus-visible:ring-offset-1"
              data-active={isActive}
              aria-pressed={isActive}
              style={{ zIndex: 2 }}
            >
              {/* ── Active: rotating neon border + frosted glass interior ── */}
              {isActive && (
                <motion.span
                  layoutId="cn5-active-border"
                  className="absolute overflow-hidden"
                  style={{ inset: 0, borderRadius: 12, zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 420, damping: 34 } as const}
                >
                  {/* Conic neon spinner */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: "-200%",
                      background:
                        "conic-gradient(from 0deg, #D4AF37, transparent 14%, #7C3AED 32%, transparent 52%, #EDD060 72%, #D4AF37)",
                      animation: "cn5-spin 3s linear infinite",
                      willChange: "transform",
                    }}
                  />
                  {/* Frosted glass interior */}
                  <span
                    style={{
                      position: "absolute",
                      inset: 1.5,
                      borderRadius: 10.5,
                      background:
                        "linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(20,8,48,0.94) 45%, rgba(12,5,28,0.96) 100%)",
                      boxShadow:
                        "inset 0 1px 1px rgba(212,175,55,0.12), inset 0 -1px 1px rgba(124,58,237,0.06)",
                    }}
                  />
                  {/* Shimmer sweep (GPU: translateX) */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      width: "40%",
                      background:
                        "linear-gradient(105deg, transparent 18%, rgba(212,175,55,0.18) 50%, transparent 82%)",
                      animation: "cn5-shimmer 3.2s ease-in-out infinite",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  />
                </motion.span>
              )}

              {/* ── Inactive: dark glass chip bg ── */}
              {!isActive && (
                <span
                  className="cn5-bg absolute"
                  style={{
                    inset: 0,
                    borderRadius: 12,
                    zIndex: -1,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                />
              )}

              {/* ── Chip content ── */}
              <span
                className="relative z-10 flex items-center gap-1.5"
                style={{ padding: "7px 14px 7px 12px" }}
              >
                <span
                  className="cn5-emoji text-sm leading-none"
                  style={{
                    filter: isActive
                      ? "drop-shadow(0 0 8px rgba(212,175,55,0.7))"
                      : "drop-shadow(0 0 3px rgba(212,175,55,0.2))",
                  }}
                >
                  {cat.emoji}
                </span>

                <span
                  className="cn5-label whitespace-nowrap font-semibold"
                  style={{
                    fontSize: "0.78rem",
                    letterSpacing: "0.04em",
                    color: isActive ? "#E5C76B" : "rgba(255,255,255,0.68)",
                    textShadow: isActive
                      ? "0 0 14px rgba(212,175,55,0.55), 0 0 28px rgba(212,175,55,0.12)"
                      : "none",
                  }}
                >
                  {cat.label}
                </span>

                <span
                  className="cn5-count text-[0.6rem] font-mono"
                  style={{
                    padding: "1px 5px",
                    borderRadius: 6,
                    background: isActive
                      ? "rgba(212,175,55,0.18)"
                      : "rgba(255,255,255,0.04)",
                    color: isActive
                      ? "#D4AF37"
                      : "rgba(255,255,255,0.32)",
                    minWidth: "1.1rem",
                    textAlign: "center",
                    lineHeight: "1.4",
                    border: isActive
                      ? "1px solid rgba(212,175,55,0.35)"
                      : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {count}
                </span>
              </span>

              {/* ── Gold underline beam (slides between tabs) ── */}
              {isActive && (
                <motion.span
                  layoutId="cn5-underline"
                  className="absolute"
                  style={{
                    bottom: 2,
                    left: "12%",
                    right: "12%",
                    height: 2,
                    borderRadius: 2,
                    background:
                      "linear-gradient(90deg, transparent, #D4AF37 30%, #EDD060 50%, #D4AF37 70%, transparent)",
                    boxShadow:
                      "0 0 8px rgba(212,175,55,0.6), 0 0 18px rgba(212,175,55,0.12)",
                    animation: "cn5-beam-breathe 2.5s ease-in-out infinite",
                  }}
                  transition={{ type: "spring", stiffness: 420, damping: 34 } as const}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default CategoryNav;
