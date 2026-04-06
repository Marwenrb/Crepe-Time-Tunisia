/**
 * CategoryNav — Ultra-premium horizontal category selector.
 *
 * Design language (Uiverse-inspired):
 *  - Rich purple gradient background (135deg #1E0A3C → #4C1D95 → #1E0A3C)
 *  - Gold rotating conic-gradient border on active pill + shimmer sweep
 *  - Circuit-trace neon dot separators between pills
 *  - Inactive pills: subtle gold border reveal on hover
 *  - Sticky bar with proper top offset for mobile/desktop header
 *  - Full-width bleed via negative margins, scroll-snap for mobile
 *  - GPU-composited: opacity + transform only in keyframes
 */

import { useRef } from "react";
import { motion } from "framer-motion";
import { MenuCategory } from "@/config/menu-categories";
import { MenuItem } from "@/types";
import { getCategoryId } from "@/config/menu-categories";

type Props = {
  categories: MenuCategory[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  menuItems: MenuItem[];
};

const KEYFRAMES = `
  @keyframes cn-rotate-border {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes cn-glow-pulse {
    0%, 100% { box-shadow: 0 0 14px rgba(212,175,55,0.4), 0 0 28px rgba(212,175,55,0.1); }
    50%      { box-shadow: 0 0 22px rgba(212,175,55,0.55), 0 0 40px rgba(212,175,55,0.15); }
  }
  @keyframes cn-shimmer {
    0%   { left: -40%; opacity: 0; }
    12%  { opacity: 0.7; }
    88%  { opacity: 0.35; }
    100% { left: 140%; opacity: 0; }
  }
  @keyframes cn-trace-flow {
    0%, 100% { top: -10%; opacity: 0; }
    12%      { opacity: 1; }
    88%      { opacity: 0.5; }
    100%     { top: 110%; opacity: 0; }
  }
  @keyframes cn-bar-shimmer {
    0%   { left: -30%; opacity: 0; }
    10%  { opacity: 0.5; }
    90%  { opacity: 0.2; }
    100% { left: 130%; opacity: 0; }
  }
  .cn-active-pill { animation: cn-glow-pulse 3s ease-in-out infinite; }
  /* Hide scrollbar cross-browser */
  .cn-scroll::-webkit-scrollbar { display: none; }
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
    <div
      className="sticky top-14 sm:top-16 md:top-[72px] z-30 -mx-4 sm:-mx-6 lg:-mx-8"
      style={{ isolation: "isolate" }}
    >
      <style>{KEYFRAMES}</style>

      {/* ── Purple gradient background ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #1E0A3C 0%, #2E1065 25%, #4C1D95 50%, #3B0764 75%, #1E0A3C 100%)",
        }}
      />

      {/* ── Gold accent lines ── */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.25) 30%, rgba(212,175,55,0.4) 50%, rgba(212,175,55,0.25) 70%, transparent 95%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.2) 30%, rgba(212,175,55,0.35) 50%, rgba(212,175,55,0.2) 70%, transparent 95%)",
        }}
      />

      {/* ── Shimmer sweep across entire bar ── */}
      <span
        aria-hidden="true"
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{
          width: "25%",
          background:
            "linear-gradient(105deg, transparent 30%, rgba(212,175,55,0.06) 50%, transparent 70%)",
          animation: "cn-bar-shimmer 6s ease-in-out infinite",
          zIndex: 1,
        }}
      />

      {/* ── Scrollable pill track ── */}
      <div
        ref={scrollRef}
        className="cn-scroll relative flex items-center overflow-x-auto px-3 sm:px-5 lg:px-8"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          minHeight: 48,
          paddingTop: 7,
          paddingBottom: 7,
          gap: 0,
          WebkitOverflowScrolling: "touch",
        }}
      >
        {visibleCats.map((cat, idx) => {
          const count = getCount(cat.id);
          const isActive = activeCategory === cat.id;

          return (
            <div key={cat.id} className="flex items-center flex-shrink-0">
              {/* Circuit-trace separator */}
              {idx > 0 && (
                <span
                  aria-hidden="true"
                  className="relative flex-shrink-0"
                  style={{
                    width: 1,
                    height: 20,
                    marginLeft: 5,
                    marginRight: 5,
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to bottom, transparent, rgba(212,175,55,0.4), transparent)",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      width: 3,
                      height: 3,
                      left: -1,
                      borderRadius: "50%",
                      background: "#EDD060",
                      boxShadow: "0 0 5px 1px rgba(212,175,55,0.6)",
                      animation: `cn-trace-flow ${1.8 + idx * 0.3}s ease-in-out infinite`,
                    }}
                  />
                </span>
              )}

              {/* ── Pill button ── */}
              <button
                onClick={() => onCategoryChange(cat.id)}
                className="relative flex-shrink-0 flex items-center outline-none focus-visible:ring-2 focus-visible:ring-crepe-gold focus-visible:ring-offset-1 transition-colors duration-200"
                style={{
                  padding: 0,
                  color: isActive ? "#0F0A1F" : "rgba(255,255,255,0.8)",
                  zIndex: 2,
                  borderRadius: 100,
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
                aria-pressed={isActive}
              >
                {/* Active: rotating conic-gradient border + gold fill + shimmer */}
                {isActive && (
                  <motion.span
                    layoutId="category-pill"
                    className="absolute rounded-full cn-active-pill overflow-hidden"
                    style={{ inset: 0, zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: "-180%",
                        background:
                          "conic-gradient(from 0deg, #D4AF37, transparent 18%, #7C3AED 38%, transparent 58%, #EDD060 78%, #D4AF37)",
                        animation: "cn-rotate-border 3.5s linear infinite",
                        willChange: "transform",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        inset: 1.5,
                        borderRadius: "inherit",
                        background:
                          "linear-gradient(135deg, #D4AF37 0%, #E5C76B 50%, #D4AF37 100%)",
                      }}
                    />
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        width: "35%",
                        background:
                          "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%)",
                        animation: "cn-shimmer 2.8s ease-in-out infinite",
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    />
                  </motion.span>
                )}

                {/* Inactive: rotating border on hover */}
                {!isActive && (
                  <motion.span
                    className="absolute inset-0 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    style={{ zIndex: -1 }}
                  >
                    <span
                      className="absolute"
                      style={{
                        inset: "-150%",
                        background:
                          "conic-gradient(from 0deg, rgba(212,175,55,0.5), transparent 22%, rgba(124,58,237,0.4) 45%, transparent 68%, rgba(237,208,96,0.45) 90%, rgba(212,175,55,0.5))",
                        animation: "cn-rotate-border 3s linear infinite",
                        willChange: "transform",
                      }}
                    />
                    <span
                      className="absolute rounded-full"
                      style={{
                        inset: 1,
                        background:
                          "radial-gradient(ellipse at center, rgba(212,175,55,0.1) 0%, rgba(30,10,60,0.95) 65%)",
                      }}
                    />
                  </motion.span>
                )}

                {/* Content */}
                <span
                  className="relative z-10 flex items-center gap-1.5"
                  style={{ padding: "5px 13px" }}
                >
                  <span
                    className="text-sm leading-none"
                    style={
                      isActive
                        ? { filter: "drop-shadow(0 0 3px rgba(15,10,31,0.3))" }
                        : { filter: "drop-shadow(0 0 6px rgba(212,175,55,0.4))" }
                    }
                  >
                    {cat.emoji}
                  </span>

                  <span
                    className="whitespace-nowrap"
                    style={{
                      letterSpacing: "0.04em",
                      textShadow: isActive
                        ? "none"
                        : "0 0 10px rgba(255,255,255,0.06)",
                    }}
                  >
                    {cat.label}
                  </span>

                  <span
                    className="text-[0.6rem] font-mono rounded-full"
                    style={{
                      padding: "1px 5px",
                      background: isActive
                        ? "rgba(15,10,31,0.25)"
                        : "rgba(212,175,55,0.12)",
                      color: isActive
                        ? "rgba(15,10,31,0.8)"
                        : "rgba(212,175,55,0.6)",
                      minWidth: "1.2rem",
                      textAlign: "center",
                      lineHeight: "1.4",
                      border: isActive
                        ? "none"
                        : "1px solid rgba(212,175,55,0.15)",
                    }}
                  >
                    {count}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNav;
