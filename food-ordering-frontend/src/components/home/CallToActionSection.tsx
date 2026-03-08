import { memo, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ChevronRight, Search } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// ─── Time-based CTA teaser ────────────────────────────────
const getTimeBasedTeaser = (): string => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "Commander";
  if (hour >= 12 && hour < 17) return "Savourer";
  if (hour >= 17 && hour < 21) return "Craquer";
  return "Commander";
};

const getPersonalizedTeaser = (isLoggedIn: boolean): string | null => {
  if (!isLoggedIn) return null;
  try {
    const pref = localStorage.getItem("crepe_favorite_flavor");
    if (pref) return `Votre ${pref} vous attend`;
  } catch {
    /* ignore */
  }
  return null;
};

// ─── Haptic feedback ──────────────────────────────────────
const triggerHaptic = (): void => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(10);
  }
};

// ─── Animation constants ──────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Component ────────────────────────────────────────────
const CallToActionSection = () => {
  const { isLoggedIn } = useAppContext();
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  const ctaTeaser = useMemo(() => {
    return getPersonalizedTeaser(isLoggedIn) ?? getTimeBasedTeaser();
  }, [isLoggedIn]);

  const handleCtaInteraction = useCallback(() => {
    triggerHaptic();
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden rounded-xl my-3 sm:my-4"
      aria-labelledby="cta-heading"
      style={{
        background:
          "linear-gradient(135deg, #3B1275 0%, #4C1D95 50%, #3B1275 100%)",
        borderTop: "1px solid rgba(212,175,55,0.2)",
        borderBottom: "1px solid rgba(212,175,55,0.07)",
      }}
    >
      {/* Ambient glow — centered warmth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(212,175,55,0.08) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10 container mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-3.5">

        {/* Left — seductive copy */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">

          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.38, ease: EASE }}
            className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1"
            style={{ color: "rgba(212,175,55,0.68)" }}
          >
            Crêpes artisanales
          </motion.span>

          <motion.h2
            id="cta-heading"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.44, delay: 0.06, ease: EASE }}
            className="font-heading font-black text-white leading-tight tracking-tight mb-1 text-base sm:text-lg"
          >
            Craquez.{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #D4AF37 0%, #E5C76B 55%, #D4AF37 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Savourez.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.12, ease: EASE }}
            className="text-[11px] sm:text-xs leading-snug max-w-[260px]"
            style={{ color: "rgba(255,255,255,0.48)" }}
          >
            Livrées chaudes à votre porte.{" "}
            <span style={{ color: "rgba(212,175,55,0.85)" }}>
              Indulgence premium.
            </span>
          </motion.p>
        </div>

        {/* Right — premium CTA buttons */}
        <div className="flex flex-row items-center gap-2 shrink-0">

          {/* Primary button — Liquid Gold */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.45, delay: 0.16, ease: EASE }}
            whileHover={reducedMotion ? {} : { y: -2, scale: 1.03 }}
            whileTap={reducedMotion ? {} : { scale: 0.97 }}
            className="relative"
            style={{ borderRadius: "9999px" }}
          >
            {/* Breathing halo */}
            {!reducedMotion && (
              <motion.span
                aria-hidden
                className="absolute pointer-events-none"
                style={{
                  inset: "-12px",
                  borderRadius: "9999px",
                  background:
                    "radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.35) 0%, transparent 65%)",
                  filter: "blur(12px)",
                }}
                animate={{
                  opacity: [0.45, 0.85, 0.45],
                  scale: [0.92, 1.08, 0.92]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            <Link
              to="/menu"
              onClick={handleCtaInteraction}
              className="relative flex items-center justify-center px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-crepe-gold/70 focus-visible:ring-offset-1 focus-visible:ring-offset-crepe-purple transition-shadow text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap"
              style={{
                background:
                  "linear-gradient(135deg, #F7E07C 0%, #E5C76B 20%, #D4AF37 50%, #C2940E 80%, #B8901F 100%)",
                color: "#0F0A1F",
                boxShadow:
                  "0 0 0 1px rgba(212,175,55,0.30), 0 3px 12px rgba(212,175,55,0.35), 0 6px 24px rgba(212,175,55,0.12), inset 0 1px 0 rgba(255,255,255,0.38), inset 0 -1px 0 rgba(0,0,0,0.24)",
              }}
              aria-label={`${ctaTeaser} — Voir le menu`}
            >
              {/* Glass reflection */}
              <span
                aria-hidden
                className="absolute top-0 left-0 right-0 h-[40%] rounded-full pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, transparent 100%)",
                }}
              />

              <span className="relative z-10 flex items-center gap-1">
                <span className="font-bold">{ctaTeaser}</span>
                <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden />
              </span>
            </Link>
          </motion.div>

          {/* Secondary button — Glass */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.45, delay: 0.23, ease: EASE }}
            whileHover={reducedMotion ? {} : { y: -2, scale: 1.03 }}
            whileTap={reducedMotion ? {} : { scale: 0.97 }}
            className="relative"
            style={{ borderRadius: "9999px" }}
          >
            <div
              className="rounded-full p-px"
              style={{
                background:
                  "linear-gradient(135deg, rgba(247,224,124,0.85) 0%, rgba(212,175,55,0.90) 50%, rgba(184,144,31,0.85) 100%)",
              }}
            >
              <Link
                to="/search/Nabeul"
                onClick={handleCtaInteraction}
                className="relative flex items-center justify-center px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-crepe-gold/60 focus-visible:ring-offset-1 focus-visible:ring-offset-crepe-purple transition-shadow text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(24,15,46,0.97) 0%, rgba(15,10,31,0.97) 100%)",
                  color: "#D4AF37",
                  boxShadow: "inset 0 1px 0 rgba(212,175,55,0.12)",
                }}
                aria-label="Explorer toutes les crêpes"
              >
                <Search className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden />
                <span className="relative z-10 ml-1 font-semibold">Explorer</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(CallToActionSection);
