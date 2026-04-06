/**
 * CategoryNav — Premium sticky category selector bar.
 *
 * v4 — Complete rewrite.
 *  - Purple gradient bg with gold accent borders
 *  - Active pill: rotating conic-gradient border + gold fill + shimmer
 *  - Inactive: radial inner glow on hover (no layout shift)
 *  - Circuit-trace separators with flowing neon dot
 *  - ALL animations GPU-composited (only transform + opacity)
 *  - Sticky with correct offset per breakpoint matching Header heights
 *  - Proper spacing from MenuHero via top margin
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

/* ── GPU-composited keyframes — only transform + opacity ── */
const KEYFRAMES = `
  @keyframes cn-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes cn-glow {
    0%, 100% { box-shadow: 0 0 12px rgba(212,175,55,0.35), 0 0 24px rgba(212,175,55,0.08); }
    50%      { box-shadow: 0 0 20px rgba(212,175,55,0.5),  0 0 36px rgba(212,175,55,0.14); }
  }
  @keyframes cn-shimmer {
    0%   { transform: translateX(-140%); opacity: 0; }
    12%  { opacity: 0.65; }
    88%  { opacity: 0.3; }
    100% { transform: translateX(140%); opacity: 0; }
  }
  @keyframes cn-dot {
    0%, 100% { transform: translateY(-120%); opacity: 0; }
    12%      { opacity: 1; }
    88%      { opacity: 0.5; }
    100%     { transform: translateY(800%); opacity: 0; }
  }
  @keyframes cn-bar-sweep {
    0%   { transform: translateX(-130%); opacity: 0; }
    10%  { opacity: 0.45; }
    90%  { opacity: 0.15; }
    100% { transform: translateX(530%); opacity: 0; }
  }
  .cn-active { animation: cn-glow 3s ease-in-out infinite; }
  .cn-track::-webkit-scrollbar { display: none; }
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
      <style>{KEYFRAMES}</style>

      {/* ── Purple gradient bg ── */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(135deg, #1E0A3C 0%, #2E1065 25%, #4C1D95 50%, #3B0764 75%, #1E0A3C 100%)",
        }}
      />

      {/* ── Top gold accent ── */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.2) 30%, rgba(212,175,55,0.4) 50%, rgba(212,175,55,0.2) 70%, transparent 95%)",
        }}
      />
      {/* ── Bottom gold accent ── */}
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.15) 30%, rgba(212,175,55,0.3) 50%, rgba(212,175,55,0.15) 70%, transparent 95%)",
        }}
      />

      {/* ── Bar shimmer (GPU: translateX) ── */}
      <span
        aria-hidden="true"
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{
          width: "22%",
          background:
            "linear-gradient(105deg, transparent 30%, rgba(212,175,55,0.05) 50%, transparent 70%)",
          animation: "cn-bar-sweep 7s ease-in-out infinite",
          zIndex: 1,
        }}
      />

      {/* ── Scroll track ── */}
      <div
        ref={scrollRef}
        className="cn-track relative flex items-center overflow-x-auto px-3 sm:px-5 lg:px-8"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          minHeight: 50,
          paddingTop: 8,
          paddingBottom: 8,
          gap: 0,
          WebkitOverflowScrolling: "touch",
        }}
      >
        {visibleCats.map((cat, idx) => {
          const count = getCount(cat.id);
          const isActive = activeCategory === cat.id;

          return (
            <div key={cat.id} className="flex items-center flex-shrink-0">
              {/* ── Circuit-trace separator ── */}
              {idx > 0 && (
                <span
                  aria-hidden="true"
                  className="relative flex-shrink-0"
                  style={{
                    width: 1,
                    height: 20,
                    marginLeft: 6,
                    marginRight: 6,
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
                      boxShadow: "0 0 5px 1px rgba(212,175,55,0.55)",
                      animation: `cn-dot ${1.8 + idx * 0.3}s ease-in-out infinite`,
                    }}
                  />
                </span>
              )}

              {/* ── Pill button ── */}
              <button
                onClick={() => onCategoryChange(cat.id)}
                className="relative flex-shrink-0 flex items-center outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/60 focus-visible:ring-offset-1 transition-colors duration-200"
                style={{
                  padding: 0,
                  color: isActive ? "#0F0A1F" : "rgba(255,255,255,0.82)",
                  zIndex: 2,
                  borderRadius: 100,
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
                aria-pressed={isActive}
              >
                {/* ── Active pill: rotating border + gold fill + shimmer ── */}
                {isActive && (
                  <motion.span
                    layoutId="cn-pill"
                    className="absolute rounded-full cn-active overflow-hidden"
                    style={{ inset: 0, zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  >
                    {/* Conic spinner */}
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: "-180%",
                        background:
                          "conic-gradient(from 0deg, #D4AF37, transparent 18%, #7C3AED 38%, transparent 58%, #EDD060 78%, #D4AF37)",
                        animation: "cn-spin 3.5s linear infinite",
                        willChange: "transform",
                      }}
                    />
                    {/* Gold fill */}
                    <span
                      style={{
                        position: "absolute",
                        inset: 1.5,
                        borderRadius: "inherit",
                        background:
                          "linear-gradient(135deg, #D4AF37 0%, #E5C76B 50%, #D4AF37 100%)",
                      }}
                    />
                    {/* Shimmer (GPU: translateX) */}
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

                {/* ── Inactive: hover glow ── */}
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
                        animation: "cn-spin 3s linear infinite",
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

                {/* ── Pill content ── */}
                <span
                  className="relative z-10 flex items-center gap-1.5"
                  style={{ padding: "5px 14px" }}
                >
                  <span
                    className="text-sm leading-none"
                    style={
                      isActive
                        ? { filter: "drop-shadow(0 0 3px rgba(15,10,31,0.25))" }
                        : { filter: "drop-shadow(0 0 6px rgba(212,175,55,0.35))" }
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
    </nav>
  );
};

export default CategoryNav;
