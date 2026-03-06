/**
 * CategoryNav — Premium horizontal category selector.
 *
 * Design intent:
 *  - Sticky backdrop-blur bar so it feels elevated above the content
 *  - Pill buttons use a gold glow on the active state — distinctive and brand-aligned
 *  - The active indicator is a shared Framer Motion layoutId element that
 *    slides (like a pill background) between tabs — GPU-accelerated, lag-free
 *  - Horizontal scroll on mobile with hidden scrollbar for clean appearance
 *  - Count badge on each category shows items available → reduces friction
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
     * The outer wrapper provides the sticky glassmorphism bar.
     * Negative horizontal margins bleed it edge-to-edge when inside a padded container.
     */
    <div
      className="sticky top-16 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3"
      style={{
        background: "rgba(15, 10, 31, 0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(212, 175, 55, 0.08)",
      }}
    >
      {/* Horizontally scrollable pill row */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto pb-0.5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => {
          const count = getCount(cat.id);
          if (count === 0 && cat.id !== "all") return null;

          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className="relative flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-crepe-gold"
              style={{
                color: isActive ? "#0F0A1F" : "rgba(255,255,255,0.6)",
                zIndex: 0,
              }}
              aria-pressed={isActive}
            >
              {/* Sliding active background */}
              {isActive && (
                <motion.span
                  layoutId="category-pill"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #D4AF37 0%, #E5C76B 100%)",
                    boxShadow: "0 0 20px rgba(212,175,55,0.45), 0 2px 8px rgba(212,175,55,0.25)",
                    zIndex: -1,
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Hover background for inactive pills */}
              {!isActive && (
                <span
                  className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
              )}

              <span className="relative z-10">{cat.emoji}</span>
              <span className="relative z-10 whitespace-nowrap">{cat.label}</span>

              {/* Count badge */}
              <span
                className="relative z-10 text-xs px-1.5 py-0.5 rounded-full font-mono"
                style={{
                  background: isActive ? "rgba(15,10,31,0.2)" : "rgba(255,255,255,0.08)",
                  color: isActive ? "#0F0A1F" : "rgba(255,255,255,0.4)",
                  minWidth: "1.25rem",
                  textAlign: "center",
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
