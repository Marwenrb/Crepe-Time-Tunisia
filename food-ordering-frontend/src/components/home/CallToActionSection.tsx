import { memo, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import { ChevronRight, Search } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// ─── Marquee phrases ──────────────────────────────────────
const PREMIUM_PHRASES = [
  "L'évasion la plus douce vous attend",
  "Craquez pour l'artisanat",
  "Une douceur à portée de clic",
  "Créées avec passion",
  "Votre moment de bonheur",
  "Goût premium, à chaque bouchée",
];

// ─── Time-based CTA teaser ────────────────────────────────
const getTimeBasedTeaser = (): string => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "Petit-déj gourmand — Commandez";
  if (hour >= 12 && hour < 17) return "Pause gourmande — Commandez";
  if (hour >= 17 && hour < 21) return "Soirée indulgence — Commandez";
  return "Coup de cœur nocturne — Commandez";
};

const getPersonalizedTeaser = (isLoggedIn: boolean): string | null => {
  if (!isLoggedIn) return null;
  try {
    const pref = localStorage.getItem("crepe_favorite_flavor");
    if (pref) return `Craquez pour ${pref} — Commandez`;
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

/**
 * Variants shared between the primary button wrapper and its
 * motion children (shimmer span, arrow span).
 * Parent sets initial="rest" whileHover="hover" animate="rest".
 * Framer-motion propagates the variant name through context so
 * nested motion elements respond automatically.
 */
const SHIMMER_VARIANTS = {
  rest: { x: "-120%" },
  hover: { x: "230%" },
} as const;

const ARROW_VARIANTS = {
  rest: { x: 0 },
  hover: { x: 5 },
} as const;

// ─── Component ────────────────────────────────────────────
const CallToActionSection = () => {
  const { isLoggedIn } = useAppContext();
  const reducedMotion = useReducedMotion();

  const ctaTeaser = useMemo(() => {
    return getPersonalizedTeaser(isLoggedIn) ?? getTimeBasedTeaser();
  }, [isLoggedIn]);

  const handleCtaInteraction = useCallback(() => {
    triggerHaptic();
  }, []);

  return (
    <section
      className="relative mt-8 sm:mt-10"
      aria-labelledby="cta-heading"
      aria-describedby="cta-description"
    >
      {/* Card + marquee wrapper — entrance animation */}
      <motion.div
        className="relative max-w-2xl mx-auto"
        initial={reducedMotion ? false : { opacity: 0, y: 18 }}
        whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        {/* ── Purple card ── */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-crepe-purple">
          {/* Gold hairline top */}
          <div
            className="absolute top-0 left-0 right-0 h-px z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 10%, rgba(212,175,55,0.55) 50%, transparent 90%)",
            }}
          />

          <div className="relative px-4 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">

              {/* Left — text */}
              <div className="text-center sm:text-left">
                <motion.h2
                  id="cta-heading"
                  initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                  whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.42, delay: 0.1, ease: EASE }}
                  className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-white"
                >
                  Craquez maintenant !
                </motion.h2>
                <motion.p
                  id="cta-description"
                  initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                  whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.38, delay: 0.17, ease: EASE }}
                  className="mt-1 text-xs sm:text-sm"
                  style={{ color: "rgba(255,255,255,0.72)" }}
                >
                  Une douceur à portée de clic — livraison ou retrait.
                </motion.p>
              </div>

              {/* Right — CTA buttons */}
              <motion.div
                className="flex flex-col items-center sm:flex-row gap-3 sm:items-center sm:justify-end"
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.22, ease: EASE }}
              >
                {/* ── Primary CTA — Next-Gen Premium ── */}
                <motion.div
                  className="relative w-full sm:w-auto"
                  style={{ borderRadius: "0.5rem" }}
                  initial="rest"
                  animate="rest"
                  whileHover={reducedMotion ? "rest" : "hover"}
                  whileTap={reducedMotion ? {} : { scale: 0.965 }}
                  variants={{
                    rest: {
                      y: 0,
                      boxShadow:
                        "0 0 0 1px rgba(212,175,55,0.18), 0 4px 20px rgba(212,175,55,0.32), 0 8px 40px rgba(212,175,55,0.10), 0 1px 4px rgba(0,0,0,0.28)",
                    },
                    hover: {
                      y: -3,
                      boxShadow:
                        "0 0 0 1px rgba(212,175,55,0.48), 0 6px 32px rgba(212,175,55,0.72), 0 16px 64px rgba(212,175,55,0.28), 0 2px 8px rgba(0,0,0,0.28)",
                    },
                  }}
                  transition={{ duration: 0.28, ease: EASE }}
                >
                  {/* ── Ambient pulsing aura — breathes behind the surface ── */}
                  {!reducedMotion && (
                    <motion.span
                      aria-hidden
                      className="absolute pointer-events-none"
                      style={{
                        inset: "-10px",
                        borderRadius: "0.875rem",
                        background:
                          "radial-gradient(ellipse at 50% 60%, rgba(212,175,55,0.26) 0%, rgba(212,175,55,0.10) 45%, transparent 68%)",
                        filter: "blur(7px)",
                      }}
                      animate={{
                        opacity: [0.55, 1, 0.55],
                        scale: [0.95, 1.05, 0.95],
                      }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  <Link
                    to="/menu"
                    onClick={handleCtaInteraction}
                    onFocus={handleCtaInteraction}
                    className="relative flex items-center justify-center w-full px-5 py-1.5 rounded-lg overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-crepe-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-crepe-purple"
                    style={{
                      background:
                        "linear-gradient(135deg, #F7E07C 0%, #E5C76B 20%, #D4AF37 50%, #C2940E 78%, #B8901F 100%)",
                      color: "#0F0A1F",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -1px 0 rgba(0,0,0,0.20)",
                    }}
                    aria-label={`${ctaTeaser} — Voir le menu`}
                  >
                    {/* Layer 1 — top glass edge line */}
                    <span
                      aria-hidden
                      className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.72) 50%, transparent 95%)",
                      }}
                    />

                    {/* Layer 2 — upper surface gloss */}
                    <span
                      aria-hidden
                      className="absolute top-0 left-0 right-0 pointer-events-none"
                      style={{
                        height: "44%",
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)",
                      }}
                    />

                    {/* Layer 3 — blob energy orb, erupts on hover */}
                    {!reducedMotion && (
                      <motion.span
                        aria-hidden
                        className="absolute pointer-events-none"
                        style={{
                          width: "130%",
                          height: "220%",
                          top: "-60%",
                          left: "-15%",
                          background:
                            "radial-gradient(ellipse at 50% 55%, rgba(255,252,200,0.32) 0%, rgba(229,199,107,0.14) 38%, transparent 65%)",
                          borderRadius: "50%",
                        }}
                        variants={{
                          rest: { opacity: 0, scale: 0.78, y: 14 },
                          hover: { opacity: 1, scale: 1.06, y: 0 },
                        }}
                        transition={{ duration: 0.44, ease: EASE }}
                      />
                    )}

                    {/* Layer 4 — shimmer sweep */}
                    {!reducedMotion && (
                      <motion.span
                        aria-hidden
                        className="absolute top-0 bottom-0 left-0 pointer-events-none"
                        style={{
                          width: "62%",
                          background:
                            "linear-gradient(108deg, transparent 10%, rgba(255,255,255,0.42) 46%, rgba(255,255,255,0.18) 56%, transparent 90%)",
                          skewX: -18,
                        }}
                        variants={SHIMMER_VARIANTS}
                        transition={{ duration: 0.62, ease: EASE }}
                      />
                    )}

                    {/* Content */}
                    <span className="relative z-10 flex items-center gap-2.5 text-sm font-bold tracking-wide whitespace-nowrap">
                      <span>{ctaTeaser}</span>
                      {!reducedMotion ? (
                        <motion.span
                          className="flex-shrink-0 flex"
                          variants={ARROW_VARIANTS}
                          transition={{ duration: 0.22, ease: EASE }}
                        >
                          <ChevronRight className="w-4 h-4" aria-hidden />
                        </motion.span>
                      ) : (
                        <ChevronRight
                          className="w-4 h-4 flex-shrink-0"
                          aria-hidden
                        />
                      )}
                    </span>
                  </Link>
                </motion.div>

                {/* ── Secondary — Explorer ── */}
                <motion.div
                  className="w-full sm:w-auto"
                  whileHover={reducedMotion ? {} : { y: -1 }}
                  whileTap={reducedMotion ? {} : { scale: 0.97 }}
                  transition={{ duration: 0.2, ease: EASE }}
                >
                  <Link
                    to="/search/Nabeul"
                    onClick={handleCtaInteraction}
                    className="group flex items-center justify-center w-full px-5 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-crepe-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-crepe-purple"
                    style={{
                      border: "1px solid rgba(212,175,55,0.45)",
                      color: "#D4AF37",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.background = "rgba(212,175,55,0.1)";
                      el.style.borderColor = "rgba(212,175,55,0.65)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.background = "transparent";
                      el.style.borderColor = "rgba(212,175,55,0.45)";
                    }}
                    aria-label="Explorer les crêpes"
                  >
                    <Search
                      className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110"
                      aria-hidden
                    />
                    Explorer
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Marquee band — flush under card ── */}
        <div className="overflow-hidden -mt-px [&_.rfm-marquee-container]:!py-0">
          <Marquee
            speed={30}
            gradient={false}
            pauseOnHover
            className="opacity-90"
            aria-hidden="true"
          >
            {PREMIUM_PHRASES.map((phrase, i) => (
              <span
                key={`${phrase}-${i}`}
                className="mx-4 font-heading text-xs sm:text-sm tracking-[0.12em] uppercase whitespace-nowrap"
                style={{
                  background:
                    "linear-gradient(90deg, #E5C76B 0%, #D4AF37 50%, #C9A227 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {phrase} ✦
              </span>
            ))}
          </Marquee>
        </div>
      </motion.div>
    </section>
  );
};

export default memo(CallToActionSection);
