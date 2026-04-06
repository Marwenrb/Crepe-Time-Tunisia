/**
 * MenuHero — Ultra-premium cinematic hero for the menu page.
 *
 * Design language:
 *  - Rotating conic-gradient border badge pill + info strip
 *  - Circuit-trace neon dot separators
 *  - Compact vertical rhythm — tight spacing, no wasted whitespace
 *  - Gold/violet brand palette with GPU-composited animations
 */

import { motion } from "framer-motion";
import { Restaurant } from "@/types";
import { MapPin, Zap } from "lucide-react";

const CUISINE_DISPLAY: Record<string, { label: string; icon: string }> = {
  "Crêpes":   { label: "Crêpes",     icon: "🥞" },
  "Desserts": { label: "Desserts",   icon: "🍮" },
  "Français": { label: "Fait Maison", icon: "✦" },
};
const resolveCuisine = (c: string) =>
  CUISINE_DISPLAY[c] ?? { label: c, icon: "✦" };

type Props = {
  restaurant: Restaurant;
};

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as [number, number, number, number];

const containerVariants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.1 } },
};

const itemVariant = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT_EXPO } },
};

const KEYFRAMES = `
  @keyframes mh-rotate-border {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes mh-trace-flow {
    0%, 100% { transform: translateY(-120%); opacity: 0; }
    10%      { opacity: 1; }
    88%      { opacity: 0.7; }
    100%     { transform: translateY(800%); opacity: 0; }
  }
  @keyframes mh-shimmer {
    0%   { transform: translateX(-140%); opacity: 0; }
    12%  { opacity: 0.6; }
    88%  { opacity: 0.3; }
    100% { transform: translateX(140%); opacity: 0; }
  }
  .mh-info-strip { animation: mh-glow-pulse 4s ease-in-out infinite; }
  @keyframes mh-glow-pulse {
    0%, 100% { filter: drop-shadow(0 0 10px rgba(212,175,55,0.06)); }
    50%      { filter: drop-shadow(0 0 18px rgba(212,175,55,0.12)); }
  }
`;

export const MenuHero = ({ restaurant }: Props) => {
  return (
    <section
      className="relative w-full overflow-hidden rounded-2xl"
      style={{ minHeight: "clamp(240px, 35vw, 400px)" }}
    >
      <style>{KEYFRAMES}</style>

      {/* ── Background layers ── */}
      <div className="absolute inset-0">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.restaurantName}
          width={1200}
          height={520}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
          className="w-full h-full object-cover object-center scale-105"
          style={{ filter: "brightness(0.45) saturate(1.3) contrast(1.05)" }}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A1F] via-[#0F0A1F]/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4C1D95]/35 via-transparent to-[#4C1D95]/20" />
      </div>

      {/* ── Static glow orbs ── */}
      <div
        className="absolute top-1/4 left-1/3 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(76,29,149,0.4) 0%, transparent 70%)",
          filter: "blur(30px)",
          opacity: 0.2,
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-36 h-36 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%)",
          filter: "blur(35px)",
          opacity: 0.2,
        }}
      />

      {/* ── Hero content ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 py-8 sm:py-10"
        style={{ minHeight: "inherit" }}
      >
        {/* Location badge with rotating border */}
        <motion.div variants={itemVariant} className="mb-3">
          <div
            className="relative inline-flex rounded-full overflow-hidden"
            style={{ padding: 1.5 }}
          >
            <span
              aria-hidden="true"
              className="absolute"
              style={{
                inset: "-150%",
                background:
                  "conic-gradient(from 0deg, #D4AF37, transparent 20%, #7C3AED 40%, transparent 60%, #EDD060 80%, #D4AF37)",
                animation: "mh-rotate-border 4s linear infinite",
                willChange: "transform",
              }}
            />
            <span
              className="relative inline-flex items-center gap-2 rounded-full text-xs font-semibold uppercase"
              style={{
                padding: "6px 16px",
                background: "rgba(8,4,20,0.92)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                color: "#D4AF37",
                letterSpacing: "0.15em",
                borderRadius: 100,
              }}
            >
              <MapPin
                className="w-3 h-3"
                style={{ filter: "drop-shadow(0 0 4px rgba(212,175,55,0.5))" }}
              />
              {restaurant.city}
              {/* Circuit-trace separator */}
              <span
                aria-hidden="true"
                className="relative"
                style={{ width: 1, height: 12, overflow: "hidden", flexShrink: 0 }}
              >
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to bottom, transparent, rgba(212,175,55,0.45), transparent)",
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
                    animation: "mh-trace-flow 2s ease-in-out infinite",
                  }}
                />
              </span>
              Crêperie Artisanale
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariant}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.05] tracking-tight mb-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Découvrez Nos{" "}
          <span
            className="block sm:inline"
            style={{
              background:
                "linear-gradient(135deg, #D4AF37 0%, #E5C76B 40%, #D4AF37 80%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Créations
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={itemVariant}
          className="text-white/60 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed mb-4"
        >
          Des crêpes artisanales préparées avec passion, chaque jour.
        </motion.p>

        {/* ── Premium info strip ── */}
        <motion.div
          variants={itemVariant}
          className="w-full max-w-xs sm:max-w-none sm:w-auto"
        >
          <div
            className="mh-info-strip relative overflow-hidden rounded-xl"
            style={{ padding: 1.5 }}
          >
            <span
              aria-hidden="true"
              className="absolute"
              style={{
                inset: "-200%",
                background:
                  "conic-gradient(from 0deg, #D4AF37, transparent 20%, #7C3AED 40%, transparent 60%, #EDD060 80%, #D4AF37)",
                animation: "mh-rotate-border 5s linear infinite",
                willChange: "transform",
              }}
            />
            <div
              className="relative flex items-stretch rounded-xl overflow-x-auto"
              style={{
                background: "rgba(8,4,20,0.93)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow:
                  "0 6px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {/* Shimmer sweep over entire strip */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  width: "30%",
                  background:
                    "linear-gradient(105deg, transparent 30%, rgba(212,175,55,0.12) 50%, transparent 70%)",
                  animation: "mh-shimmer 4s ease-in-out infinite",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />

              {/* Delivery time */}
              <div className="flex items-center gap-1.5 px-2 sm:px-3 py-2 shrink-0">
                <div
                  className="flex items-center justify-center w-5 h-5 rounded-full shrink-0"
                  style={{
                    background: "rgba(212,175,55,0.12)",
                    boxShadow: "0 0 6px 1px rgba(212,175,55,0.08)",
                  }}
                >
                  <Zap
                    className="w-3 h-3"
                    style={{
                      color: "#D4AF37",
                      filter: "drop-shadow(0 0 3px rgba(212,175,55,0.5))",
                    }}
                  />
                </div>
                <div className="flex flex-col leading-none">
                  <span
                    className="text-[11px] font-black tracking-tight whitespace-nowrap"
                    style={{
                      color: "#D4AF37",
                      textShadow: "0 0 6px rgba(212,175,55,0.25)",
                    }}
                  >
                    {restaurant.estimatedDeliveryTime} min
                  </span>
                  <span className="text-[7px] uppercase tracking-[0.14em] text-white/30 font-medium mt-0.5 whitespace-nowrap">
                    Livraison
                  </span>
                </div>
              </div>

              {/* Cuisine tags with circuit-trace separators */}
              {restaurant.cuisines.slice(0, 3).map((c, i) => {
                const { label, icon } = resolveCuisine(c);
                return (
                  <div key={c} className="flex items-center shrink-0">
                    {/* Circuit-trace separator */}
                    <span
                      aria-hidden="true"
                      className="relative flex-shrink-0"
                      style={{
                        width: 1,
                        alignSelf: "stretch",
                        overflow: "hidden",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to bottom, transparent 10%, rgba(212,175,55,0.3) 50%, transparent 90%)",
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
                          animation: `mh-trace-flow ${2 + i * 0.3}s ease-in-out infinite`,
                        }}
                      />
                    </span>

                    <div className="flex items-center gap-1 px-2 sm:px-3 py-2">
                      <span
                        className="text-xs leading-none"
                        style={{
                          filter: "drop-shadow(0 0 6px rgba(212,175,55,0.4))",
                        }}
                      >
                        {icon}
                      </span>
                      <span
                        className="text-[10px] font-semibold text-white/75 tracking-wide whitespace-nowrap"
                        style={{ textShadow: "0 0 4px rgba(255,255,255,0.04)" }}
                      >
                        {label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Bottom gold line accent ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)",
        }}
      />
    </section>
  );
};

export default MenuHero;
