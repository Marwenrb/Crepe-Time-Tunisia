import { memo, useCallback, useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Marquee from "react-fast-marquee";
import { ChevronRight, Search } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

/** Phrases premium pour le marquee — accrocheuses en français */
const PREMIUM_PHRASES = [
  "L'évasion la plus douce vous attend",
  "Craquez pour l'artisanat",
  "Une douceur à portée de clic",
  "Créées avec passion",
  "Votre moment de bonheur",
  "Goût premium, à chaque bouchée",
];

/** Teaser CTA selon l'heure — messages accrocheurs en français */
const getTimeBasedTeaser = (): string => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "Petit-déj gourmand — Commandez";
  if (hour >= 12 && hour < 17) return "Pause gourmande — Commandez";
  if (hour >= 17 && hour < 21) return "Soirée indulgence — Commandez";
  return "Coup de cœur nocturne — Commandez";
};

/** Teaser personnalisé selon la préférence utilisateur */
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

/** Trigger haptic feedback on supported devices */
const triggerHaptic = (): void => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(10);
  }
};

/** Particle burst count for hover effect */
const PARTICLE_COUNT = 12;

import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Particle burst component — gold sparks on button hover */
const ParticleBurst = memo(function ParticleBurst({
  active,
  reducedMotion,
}: {
  active: boolean;
  reducedMotion: boolean;
}) {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        angle: (i / PARTICLE_COUNT) * 360,
      })),
    []
  );

  if (reducedMotion) return null;

  return (
    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
      {particles.map(({ id, angle }) => {
        const rad = (angle * Math.PI) / 180;
        const distance = 40;
        const x = Math.cos(rad) * distance;
        const y = Math.sin(rad) * distance;
        return (
          <motion.span
            key={id}
            className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-crepe-gold"
            style={{
              boxShadow: "0 0 6px rgba(212, 175, 55, 0.9)",
            }}
            initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
            animate={
              active
                ? {
                    scale: [0, 1.2, 0],
                    opacity: [0, 0.9, 0],
                    x: [0, x],
                    y: [0, y],
                  }
                : {}
            }
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        );
      })}
    </span>
  );
});

const CallToActionSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { isLoggedIn } = useAppContext();
  const reducedMotion = useReducedMotion();
  const [ctaHover, setCtaHover] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0.3, 0.7], [30, -30]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.4], [0.6, 1]);

  const ctaTeaser = useMemo(() => {
    const personalized = getPersonalizedTeaser(isLoggedIn);
    return personalized ?? getTimeBasedTeaser();
  }, [isLoggedIn]);

  const handleCtaInteraction = useCallback(() => {
    triggerHaptic();
  }, []);

  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: reducedMotion
        ? { opacity: 1 }
        : {
            opacity: 1,
            transition: {
              staggerChildren: 0.08,
              delayChildren: 0.1,
            },
          },
    }),
    [reducedMotion]
  );

  const itemVariants = useMemo(
    () => ({
      hidden: reducedMotion ? {} : { opacity: 0, y: 24 },
      visible: reducedMotion ? {} : { opacity: 1, y: 0 },
    }),
    [reducedMotion]
  );

  return (
    <section
      ref={sectionRef}
      className={`relative mt-8 sm:mt-10 ${reducedMotion ? "cta-reduce-motion" : ""}`}
      aria-labelledby="cta-heading"
      aria-describedby="cta-description"
    >
      <motion.div
        style={reducedMotion ? undefined : { y: parallaxY, opacity }}
        className="relative max-w-2xl mx-auto flex flex-col gap-0"
      >
        {/* Button card — on top */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-crepe-purple"
        >
          {/* Footer-style: solid purple with gold accents */}
          <div
            className="absolute top-0 left-0 right-0 h-px z-10"
            style={{
              background:
                "linear-gradient(90deg, transparent 10%, rgba(212, 175, 55, 0.5) 50%, transparent 90%)",
            }}
          />

          <div className="relative px-4 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Left: text only (compact — Lottie removed for density) */}
              <div className="text-center sm:text-left">
                <motion.h2
                  id="cta-heading"
                  variants={itemVariants}
                  className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-white"
                >
                  Craquez maintenant !
                </motion.h2>
                <motion.p
                  id="cta-description"
                  variants={itemVariants}
                  className="mt-1 text-xs sm:text-sm text-white/85"
                >
                  Une douceur à portée de clic — livraison ou retrait.
                </motion.p>
              </div>

              {/* Right: CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-end">
                <motion.div
                  variants={itemVariants}
                  onHoverStart={() => setCtaHover(true)}
                  onHoverEnd={() => setCtaHover(false)}
                  whileHover={reducedMotion ? {} : { scale: 1.03, y: -2 }}
                  whileTap={reducedMotion ? {} : { scale: 0.98 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                >
                  <Link
                    to="/menu"
                    onClick={handleCtaInteraction}
                    onFocus={handleCtaInteraction}
                    className="group relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-crepe-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-crepe-purple"
                    style={{
                      background:
                        "linear-gradient(135deg, #D4AF37 0%, #C9A227 100%)",
                      color: "#0F0A1F",
                      boxShadow:
                        "0 2px 12px rgba(212, 175, 55, 0.3)",
                    }}
                    aria-label={`${ctaTeaser} — Voir le menu`}
                  >
                    <ParticleBurst active={ctaHover} reducedMotion={reducedMotion} />
                    <span className="relative z-10 flex items-center gap-2">
                      <span className="font-medium whitespace-nowrap truncate max-w-[200px] sm:max-w-none">
                        {ctaTeaser}
                      </span>
                      <ChevronRight
                        className="w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                    {/* Hover shine */}
                    <span
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)",
                        backgroundSize: "200% 100%",
                      }}
                    />
                  </Link>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={reducedMotion ? {} : { scale: 1.03, y: -2 }}
                  whileTap={reducedMotion ? {} : { scale: 0.98 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                >
                  <Link
                    to="/search/Nabeul"
                    onClick={handleCtaInteraction}
                    className="group inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg border transition-all duration-300 border-crepe-gold/50 text-crepe-gold hover:border-crepe-gold/70 hover:bg-crepe-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-crepe-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-crepe-purple"
                    aria-label="Explorer les crêpes"
                  >
                    <Search
                      className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110"
                      aria-hidden
                    />
                    Explorer
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Marquee — under the button card, no gap */}
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
                  background: "linear-gradient(90deg, #E5C76B 0%, #D4AF37 50%, #C9A227 100%)",
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
