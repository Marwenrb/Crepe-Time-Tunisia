/**
 * CategoryNav — Premium horizontal category selector.
 *
 * Design intent:
 *  - Sticky backdrop-blur bar elevated above content
 *  - Gold glow active pill with shared Framer Motion layoutId — GPU-accelerated
 *  - Horizontal scroll on mobile with hidden scrollbar
 *  - Count badge on each category
 *
 * Mobile fix: explicit min-height + overflow-x-auto on inner scroll container,
 * no clipping on the outer wrapper, proper flex-shrink-0 on each pill.
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

  return (
    /*
     * Outer wrapper: sticky glassmorphism bar, bleeds edge-to-edge.
     * overflow-visible keeps pill shadows from being clipped.
     */
    <div
      className="sticky top-16 z-30 -mx-4 sm:-mx-6 lg:-mx-8"
      style={{
        background: "rgba(12, 8, 26, 0.82)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(212, 175, 55, 0.12)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Inner scroll track — explicit height to prevent clipping */}
      <div
        ref={scrollRef}
        className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto px-4 sm:px-6 lg:px-8"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          minHeight: "52px",
          paddingTop: "8px",
          paddingBottom: "8px",
        }}
      >
        {categories.map((cat) => {
          const count = getCount(cat.id);
          if (count === 0 && cat.id !== "all") return null;

          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className="relative flex-shrink-0 flex items-center gap-1.5 rounded-full text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-crepe-gold transition-colors duration-200"
              style={{
                padding: "6px 14px",
                color: isActive ? "#0F0A1F" : "rgba(255,255,255,0.65)",
                zIndex: 0,
              }}
              aria-pressed={isActive}
            >
              {/* Sliding gold active background */}
              {isActive && (
                <motion.span
                  layoutId="category-pill"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #D4AF37 0%, #E5C76B 100%)",
                    boxShadow:
                      "0 0 22px rgba(212,175,55,0.5), 0 2px 8px rgba(212,175,55,0.3)",
                    zIndex: -1,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}

              {/* Hover glow for inactive pills */}
              {!isActive && (
                <motion.span
                  className="absolute inset-0 rounded-full"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  style={{
                    background:
                      "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    zIndex: -1,
                  }}
                />
              )}

              {/* Emoji */}
              <span
                className="relative z-10 text-base leading-none"
                style={
                  isActive
                    ? {}
                    : { filter: "drop-shadow(0 0 4px rgba(212,175,55,0.25))" }
                }
              >
                {cat.emoji}
              </span>

              {/* Label */}
              <span className="relative z-10 whitespace-nowrap tracking-wide">
                {cat.label}
              </span>

              {/* Count badge */}
              <span
                className="relative z-10 text-xs font-mono rounded-full"
                style={{
                  padding: "1px 6px",
                  background: isActive
                    ? "rgba(15,10,31,0.22)"
                    : "rgba(255,255,255,0.09)",
                  color: isActive ? "#0F0A1F" : "rgba(255,255,255,0.38)",
                  minWidth: "1.4rem",
                  textAlign: "center",
                  lineHeight: "1.4",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNav;
