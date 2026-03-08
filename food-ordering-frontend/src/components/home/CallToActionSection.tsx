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
          {/* Ambient radial glow — subtle gold warmth behind content */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 18%, rgba(212,175,55,0.08) 0%, transparent 65%)",
            }}
          />

          {/* Gold hairline — top edge */}
          <div
            className="absolute top-0 left-0 right-0 h-px z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.65) 50%, transparent 95%)",
            }}
          />

          {/* ── Centered content ── */}
          <div className="relative px-5 py-7 sm:px-8 sm:py-9 text-center">
            {/* Eyebrow */}
            <motion.span
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.38, delay: 0.06, ease: EASE }}
              className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-[0.24em] uppercase mb-3"
              style={{ color: "rgba(212,175,55,0.75)" }}
            >
              Crêpes artisanales
            </motion.span>

            {/* Hero headline — gradient gold/white */}
            <motion.h2
              id="cta-heading"
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.48, delay: 0.12, ease: EASE }}
              className="font-heading text-[1.65rem] sm:text-3xl md:text-[2.4rem] font-bold tracking-tight leading-[1.12]"
              style={{
                background:
                  "linear-gradient(135deg, #FFFFFF 0%, #F5E5A0 38%, #D4AF37 72%, #FFFFFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 1px 12px rgba(212,175,55,0.28))",
              }}
            >
              Laissez-vous tenter
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              id="cta-description"
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.42, delay: 0.19, ease: EASE }}
              className="mt-2 sm:mt-3 text-sm sm:text-[15px] max-w-md mx-auto leading-relaxed"
              style={{ color: "rgba(255,255,255,0.58)" }}
            >
              Livrées chaudes à votre porte, ou prêtes à emporter.
              <br className="hidden sm:block" />
              L'indulgence n'a jamais été aussi simple.
            </motion.p>

            {/* Gold hairline divider — expands from center */}
            <motion.div
              aria-hidden
              initial={reducedMotion ? false : { scaleX: 0, opacity: 0 }}
              whileInView={reducedMotion ? {} : { scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.26, ease: EASE }}
              className="mx-auto my-5 sm:my-6 h-px w-16 sm:w-24"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(212,175,55,0.50), transparent)",
                transformOrigin: "center",
              }}
            />

            {/* ── CTA Buttons — centered ── */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.32, ease: EASE }}
            >
              {/* ── Primary — Liquid Gold Capsule ── */}
              <motion.div
                className="relative w-full sm:w-auto"
                style={{ borderRadius: "9999px" }}
                initial="rest"
                animate="rest"
                whileHover={reducedMotion ? "rest" : "hover"}
                whileTap={reducedMotion ? {} : { scale: 0.952 }}
                variants={{
                  rest: {
                    y: 0,
                    boxShadow:
                      "0 0 0 1px rgba(212,175,55,0.22), 0 4px 20px rgba(212,175,55,0.36), 0 8px 42px rgba(212,175,55,0.12), 0 1px 4px rgba(0,0,0,0.32)",
                  },
                  hover: {
                    y: -3,
                    boxShadow:
                      "0 0 0 1px rgba(212,175,55,0.60), 0 6px 28px rgba(212,175,55,0.80), 0 18px 58px rgba(212,175,55,0.36), 0 2px 8px rgba(0,0,0,0.32)",
                  },
                }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                {/* Breathing corona */}
                {!reducedMotion && (
                  <motion.span
                    aria-hidden
                    className="absolute pointer-events-none"
                    style={{
                      inset: "-14px",
                      borderRadius: "9999px",
                      background:
                        "radial-gradient(ellipse at 50% 55%, rgba(212,175,55,0.32) 0%, rgba(212,175,55,0.08) 52%, transparent 70%)",
                      filter: "blur(9px)",
                    }}
                    animate={{ opacity: [0.45, 1, 0.45], scale: [0.92, 1.08, 0.92] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}

                <Link
                  to="/menu"
                  onClick={handleCtaInteraction}
                  onFocus={handleCtaInteraction}
                  className="relative flex items-center justify-center w-full px-5 py-1 rounded-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-crepe-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-crepe-purple"
                  style={{
                    background:
                      "linear-gradient(135deg, #F7E07C 0%, #E5C76B 18%, #D4AF37 48%, #C2940E 78%, #B8901F 100%)",
                    color: "#0F0A1F",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.36), inset 0 -1px 0 rgba(0,0,0,0.26)",
                  }}
                  aria-label={`${ctaTeaser} — Voir le menu`}
                >
                  {/* L1 — top glass hairline */}
                  <span
                    aria-hidden
                    className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.82) 50%, transparent 95%)",
                    }}
                  />
                  {/* L2 — convex surface gloss */}
                  <span
                    aria-hidden
                    className="absolute top-0 left-0 right-0 pointer-events-none"
                    style={{
                      height: "42%",
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.24) 0%, transparent 100%)",
                    }}
                  />
                  {/* L3 — blob energy core */}
                  {!reducedMotion && (
                    <motion.span
                      aria-hidden
                      className="absolute pointer-events-none"
                      style={{
                        width: "130%",
                        height: "250%",
                        top: "-75%",
                        left: "-15%",
                        background:
                          "radial-gradient(ellipse at 50% 58%, rgba(255,253,215,0.40) 0%, rgba(229,199,107,0.15) 38%, transparent 65%)",
                        borderRadius: "50%",
                      }}
                      variants={{
                        rest: { opacity: 0, scale: 0.70, y: 20 },
                        hover: { opacity: 1, scale: 1.12, y: 0 },
                      }}
                      transition={{ duration: 0.42, ease: EASE }}
                    />
                  )}
                  {/* L4 — shimmer sweep */}
                  {!reducedMotion && (
                    <motion.span
                      aria-hidden
                      className="absolute top-0 bottom-0 left-0 pointer-events-none"
                      style={{
                        width: "60%",
                        background:
                          "linear-gradient(110deg, transparent 10%, rgba(255,255,255,0.48) 46%, rgba(255,255,255,0.20) 56%, transparent 90%)",
                        skewX: -18,
                      }}
                      variants={SHIMMER_VARIANTS}
                      transition={{ duration: 0.56, ease: EASE }}
                    />
                  )}
                  {/* L5 — sparkle burst */}
                  {!reducedMotion && (
                    <>
                      <motion.span
                        aria-hidden
                        className="absolute pointer-events-none select-none"
                        style={{ color: "rgba(255,246,160,0.95)", top: 0, left: "18%", fontSize: "7px", lineHeight: 1 }}
                        variants={{
                          rest: { opacity: 0, y: 0, scale: 0 },
                          hover: { opacity: [0, 1, 0], y: -10, scale: [0, 1.4, 0] },
                        }}
                        transition={{ duration: 0.55, ease: EASE }}
                      >✦</motion.span>
                      <motion.span
                        aria-hidden
                        className="absolute pointer-events-none select-none"
                        style={{ color: "rgba(255,230,110,0.85)", bottom: 0, right: "22%", fontSize: "6px", lineHeight: 1 }}
                        variants={{
                          rest: { opacity: 0, y: 0, scale: 0 },
                          hover: { opacity: [0, 1, 0], y: 10, scale: [0, 1.1, 0] },
                        }}
                        transition={{ duration: 0.50, ease: EASE, delay: 0.08 }}
                      >✦</motion.span>
                      <motion.span
                        aria-hidden
                        className="absolute pointer-events-none select-none"
                        style={{ color: "rgba(255,218,70,0.90)", top: "16%", right: "5%", fontSize: "5px", lineHeight: 1 }}
                        variants={{
                          rest: { opacity: 0, x: 0, scale: 0 },
                          hover: { opacity: [0, 1, 0], x: 9, scale: [0, 1, 0] },
                        }}
                        transition={{ duration: 0.48, ease: EASE, delay: 0.05 }}
                      >✦</motion.span>
                    </>
                  )}
                  {/* Content */}
                  <span className="relative z-10 flex items-center gap-2 text-sm font-bold tracking-wide whitespace-nowrap">
                    <span>{ctaTeaser}</span>
                    {!reducedMotion ? (
                      <motion.span
                        className="flex-shrink-0 flex"
                        variants={ARROW_VARIANTS}
                        transition={{ duration: 0.22, ease: EASE }}
                      >
                        <ChevronRight className="w-3.5 h-3.5" aria-hidden />
                      </motion.span>
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" aria-hidden />
                    )}
                  </span>
                </Link>
              </motion.div>

              {/* ── Secondary — Glass Capsule ── */}
              <motion.div
                className="relative w-full sm:w-auto"
                style={{ borderRadius: "9999px" }}
                initial="rest"
                animate="rest"
                whileHover={reducedMotion ? "rest" : "hover"}
                whileTap={reducedMotion ? {} : { scale: 0.952 }}
                variants={{
                  rest: { y: 0 },
                  hover: { y: -2 },
                }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                {/* Gradient border shell */}
                <motion.div
                  className="rounded-full p-px"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(247,224,124,0.9) 0%, rgba(212,175,55,1) 50%, rgba(184,144,31,0.9) 100%)",
                  }}
                  variants={{
                    rest: { opacity: 0.36 },
                    hover: { opacity: 1 },
                  }}
                  transition={{ duration: 0.28, ease: EASE }}
                >
                  <Link
                    to="/search/Nabeul"
                    onClick={handleCtaInteraction}
                    className="relative flex items-center justify-center w-full px-5 py-1 rounded-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-crepe-gold/50 focus-visible:ring-offset-1 focus-visible:ring-offset-crepe-purple"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(24,15,46,0.97) 0%, rgba(15,10,31,0.97) 100%)",
                      color: "#C9A820",
                      boxShadow: "inset 0 1px 0 rgba(212,175,55,0.10)",
                    }}
                    aria-label="Explorer les crêpes"
                  >
                    {/* Warm glow on hover */}
                    {!reducedMotion && (
                      <motion.span
                        aria-hidden
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                          background:
                            "radial-gradient(ellipse at 50% 100%, rgba(212,175,55,0.20) 0%, transparent 65%)",
                        }}
                        variants={{
                          rest: { opacity: 0 },
                          hover: { opacity: 1 },
                        }}
                        transition={{ duration: 0.32, ease: EASE }}
                      />
                    )}
                    {/* Search icon */}
                    <motion.span
                      className="relative z-10 flex mr-1.5 flex-shrink-0"
                      variants={{
                        rest: { rotate: 0, scale: 1 },
                        hover: { rotate: 14, scale: 1.18 },
                      }}
                      transition={{ duration: 0.32, ease: EASE }}
                    >
                      <Search className="w-3.5 h-3.5" aria-hidden />
                    </motion.span>
                    <span className="relative z-10 text-sm font-semibold tracking-wide">Explorer</span>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Gold hairline — bottom edge */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 10%, rgba(212,175,55,0.32) 50%, transparent 90%)",
            }}
          />
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
