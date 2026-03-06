/**
 * MenuHero — Cinematic hero section for the menu page.
 *
 * Design intent:
 *  - Restaurant banner image fills the viewport as a parallax-like backdrop
 *  - Multi-layer gradient veil (dark + purple) ensures contrast over any image
 *  - Animated glow orbs give depth without being distracting
 *  - Editorial Playfair Display headline with gold gradient on the key word
 *  - Sub-headline fades in with a slight delay for a staggered cinematic feel
 *  - Badge pill echoes the gold accent system-wide
 */

import { motion } from "framer-motion";
import { Restaurant } from "@/types";
import { MapPin, Zap } from "lucide-react";

// Map raw DB cuisine tags → catchy brand-aligned display labels + icons
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

// Cubic bezier as const tuple — satisfies Framer Motion's BezierDefinition type
const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as [number, number, number, number];

const containerVariants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.12 } },
};

const itemVariant = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_OUT_EXPO } },
};

// Glow orb animation — defined inline to avoid Variants typing clash
const ORB_ANIMATE = {
  scale:   [1, 1.06, 1],
  opacity: [0.18, 0.3, 0.18],
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const },
};

export const MenuHero = ({ restaurant }: Props) => {
  return (
    <section className="relative w-full overflow-hidden rounded-2xl"
      style={{ minHeight: "clamp(320px, 45vw, 520px)" }}>

      {/* ── Background layers ── */}
      <div className="absolute inset-0">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.restaurantName}
          className="w-full h-full object-cover object-center scale-105"
          style={{ filter: "brightness(0.55) saturate(1.2)" }}
          loading="eager"
        />
        {/* Dark radial gradient from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A1F] via-[#0F0A1F]/60 to-transparent" />
        {/* Purple side vignettes */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4C1D95]/40 via-transparent to-[#4C1D95]/25" />
      </div>

      {/* ── Animated glow orbs (inline animate to avoid Variants typing issues) ── */}
      <motion.div
        animate={ORB_ANIMATE}
        className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(76,29,149,0.45) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <motion.div
        animate={{ ...ORB_ANIMATE, transition: { ...ORB_ANIMATE.transition, delay: 2.5 } }}
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full pointer-events-none"
      />

      {/* ── Hero content ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 py-16"
        style={{ minHeight: "inherit" }}
      >
        {/* Location / badge pill */}
        <motion.div variants={itemVariant}>
          <span className="inline-flex items-center gap-2 text-crepe-gold text-xs font-semibold tracking-[0.2em] uppercase mb-6 border border-crepe-gold/30 px-4 py-1.5 rounded-full backdrop-blur-md"
            style={{ background: "rgba(212,175,55,0.06)" }}>
            <MapPin className="w-3 h-3" />
            {restaurant.city}
            <span className="w-px h-3 bg-crepe-gold/30" />
            Crêperie Artisanale
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariant}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-5"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Découvrez Nos{" "}
          <span
            className="block sm:inline"
            style={{
              background: "linear-gradient(135deg, #D4AF37 0%, #E5C76B 40%, #D4AF37 80%)",
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
          className="text-white/65 text-base sm:text-lg max-w-lg mx-auto leading-relaxed mb-8"
        >
          Des crêpes artisanales préparées avec passion,{" "}
          chaque jour, avec les meilleurs ingrédients.
        </motion.p>

        {/* ── Premium info strip ── */}
        <motion.div
          variants={itemVariant}
          className="flex items-stretch justify-center overflow-hidden rounded-2xl"
          style={{
            background: "rgba(10,6,24,0.65)",
            border: "1px solid rgba(212,175,55,0.22)",
            backdropFilter: "blur(24px)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
        >
          {/* Delivery time — gold accent */}
          <div className="flex items-center gap-2 px-5 py-2.5 border-r border-white/10">
            <div
              className="flex items-center justify-center w-6 h-6 rounded-full shrink-0"
              style={{ background: "rgba(212,175,55,0.15)" }}
            >
              <Zap className="w-3 h-3" style={{ color: "#D4AF37" }} />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="text-sm font-black tracking-tight"
                style={{ color: "#D4AF37" }}
              >
                {restaurant.estimatedDeliveryTime} min
              </span>
              <span className="text-[9px] uppercase tracking-[0.15em] text-white/35 font-medium mt-0.5">
                Livraison
              </span>
            </div>
          </div>

          {/* Cuisine tags */}
          {restaurant.cuisines.slice(0, 3).map((c, i, arr) => {
            const { label, icon } = resolveCuisine(c);
            return (
              <div
                key={c}
                className={`flex items-center gap-2 px-5 py-2.5${
                  i < arr.length - 1 ? " border-r border-white/10" : ""
                }`}
              >
                <span
                  className="text-xs leading-none"
                  style={{ filter: "drop-shadow(0 0 6px rgba(212,175,55,0.4))" }}
                >
                  {icon}
                </span>
                <span className="text-xs font-semibold text-white/80 tracking-wide">
                  {label}
                </span>
              </div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* ── Bottom gold line accent ── */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)" }} />
    </section>
  );
};

export default MenuHero;
