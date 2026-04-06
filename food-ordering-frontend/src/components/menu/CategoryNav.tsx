/**
 * CategoryNav — Ultra-premium horizontal category selector.
 *
 * Design language:
 *  - Rotating conic-gradient border on active pill (gold → violet → gold)
 *  - Shimmer sweep + glow-pulse on active state
 *  - Circuit-trace neon dot separators between pills
 *  - Inactive pills: rotating border on hover with radial inner glow
 *  - Sticky glassmorphism bar with edge bleed + hidden scrollbar
 *  - GPU-composited only: opacity + transform
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
    0%, 100% { box-shadow: 0 0 18px rgba(212,175,55,0.45), 0 0 36px rgba(212,175,55,0.12), 0 2px 6px rgba(212,175,55,0.25); }
    50%      { box-shadow: 0 0 26px rgba(212,175,55,0.6),  0 0 52px rgba(212,175,55,0.18), 0 2px 10px rgba(212,175,55,0.35); }
  }
  @keyframes cn-shimmer {
    0%   { left: -40%; opacity: 0; }
    12%  { opacity: 0.8; }
    88%  { opacity: 0.4; }
    100% { left: 140%; opacity: 0; }
  }
  @keyframes cn-trace-flow {
    0%, 100% { top: -10%; opacity: 0; }
    12%      { opacity: 1; }
    88%      { opacity: 0.6; }
    100%     { top: 110%; opacity: 0; }
  }
  .cn-active-pill { animation: cn-glow-pulse 3s ease-in-out infinite; }
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
      className="sticky top-16 z-30 -mx-4 sm:-mx-6 lg:-mx-8"
      style={{
        background:
          "linear-gradient(135deg, #1E0A3C 0%, #2E1065 25%, #4C1D95 50%, #3B0764 75%, #1E0A3C 100%)",
        borderBottom: "1px solid rgba(212,175,55,0.12)",
        boxShadow:
          "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <style>{KEYFRAMES}</style>

      <div
        ref={scrollRef}
        className="flex items-center overflow-x-auto px-4 sm:px-6 lg:px-8"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          minHeight: "46px",
          paddingTop: "6px",
          paddingBottom: "6px",
          gap: 0,
        }}
      >
        {visibleCats.map((cat, idx) => {
          const count = getCount(cat.id);
          const isActive = activeCategory === cat.id;

          return (
            <div key={cat.id} className="flex items-center flex-shrink-0">
              {/* Circuit-trace separator between pills */}
              {idx > 0 && (
                <span
                  aria-hidden="true"
                  className="relative flex-shrink-0"
                  style={{
                    width: 1,
                    height: 18,
                    marginLeft: 4,
                    marginRight: 4,
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to bottom, transparent, rgba(212,175,55,0.35), transparent)",
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
                      boxShadow: "0 0 4px 1px rgba(212,175,55,0.5)",
                      animation: `cn-trace-flow ${1.8 + idx * 0.3}s ease-in-out infinite`,
                    }}
                  />
                </span>
              )}

              {/* Pill button */}
              <button
                onClick={() => onCategoryChange(cat.id)}
                className="relative flex-shrink-0 flex items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-crepe-gold transition-colors duration-200"
                style={{
                  padding: 0,
                  color: isActive ? "#0F0A1F" : "rgba(255,255,255,0.7)",
                  zIndex: 0,
                  borderRadius: 100,
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                }}
                aria-pressed={isActive}
              >
                {/* Active state: rotating conic-gradient border wrapper */}
                {isActive && (
                  <motion.span
                    layoutId="category-pill"
                    className="absolute rounded-full cn-active-pill overflow-hidden"
                    style={{
                      inset: 0,
                      zIndex: -1,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  >
                    {/* Rotating conic border layer */}
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
                    {/* Inner gold fill */}
                    <span
                      style={{
                        position: "absolute",
                        inset: 1.5,
                        borderRadius: "inherit",
                        background:
                          "linear-gradient(135deg, #D4AF37 0%, #E5C76B 50%, #D4AF37 100%)",
                      }}
                    />
                    {/* Shimmer sweep */}
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

                {/* Inactive hover: rotating border reveal */}
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
                          "conic-gradient(from 0deg, rgba(212,175,55,0.45), transparent 22%, rgba(124,58,237,0.35) 45%, transparent 68%, rgba(237,208,96,0.4) 90%, rgba(212,175,55,0.45))",
                        animation: "cn-rotate-border 3s linear infinite",
                        willChange: "transform",
                      }}
                    />
                    <span
                      className="absolute rounded-full"
                      style={{
                        inset: 1,
                        background:
                          "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, rgba(15,10,31,0.94) 65%)",
                      }}
                    />
                  </motion.span>
                )}

                {/* Inner content wrapper */}
                <span
                  className="relative z-10 flex items-center gap-1.5"
                  style={{ padding: "5px 12px" }}
                >
                  {/* Emoji with neon glow */}
                  <span
                    className="text-sm leading-none"
                    style={
                      isActive
                        ? { filter: "drop-shadow(0 0 3px rgba(15,10,31,0.3))" }
                        : { filter: "drop-shadow(0 0 5px rgba(212,175,55,0.35))" }
                    }
                  >
                    {cat.emoji}
                  </span>

                  {/* Label */}
                  <span
                    className="whitespace-nowrap"
                    style={{
                      letterSpacing: "0.04em",
                      textShadow: isActive
                        ? "none"
                        : "0 0 8px rgba(255,255,255,0.04)",
                    }}
                  >
                    {cat.label}
                  </span>

                  {/* Count badge */}
                  <span
                    className="text-[0.65rem] font-mono rounded-full"
                    style={{
                      padding: "1px 5px",
                      background: isActive
                        ? "rgba(15,10,31,0.25)"
                        : "rgba(212,175,55,0.1)",
                      color: isActive
                        ? "rgba(15,10,31,0.8)"
                        : "rgba(212,175,55,0.55)",
                      minWidth: "1.3rem",
                      textAlign: "center",
                      lineHeight: "1.4",
                      border: isActive
                        ? "none"
                        : "1px solid rgba(212,175,55,0.12)",
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
