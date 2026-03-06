/**
 * WowExperienceSection — Next-gen premium homepage section for Crêpe Time
 *
 * Features:
 *  • Scroll-driven parallax (Framer Motion useScroll + useTransform)
 *  • Typing / typewriter text effect (custom hook)
 *  • Floating ingredient images at staggered depths
 *  • Interactive flavor explorer cards with glow + glassmorphism
 *  • Magnetic CTA button with spring physics
 *  • Animated gradient orbs + floating gold particles + dot-grid overlay
 *  • Fully responsive & reduced-motion aware
 */

import { memo, useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

// ── Image Assets ──────────────────────────────────────────────────────────────
import nutellaBananeFeature from "@/assets/hero/Crêpe Nutella Banane feature.jpg";
import fraiseCreme from "@/assets/menu-items/fraise-creme.jpg";
import pistacheRose from "@/assets/menu-items/pistache-rose.jpg";
import lotusBiscoff from "@/assets/menu-items/lotus-biscoff.jpg";
import nutellaMenuImg from "@/assets/menu-items/nutella-banane.jpg";
import fruitsDesBois from "@/assets/menu-items/fruits-des-bois.jpg";

// ── Types ─────────────────────────────────────────────────────────────────────
interface FlavorData {
  id: string;
  emoji: string;
  name: string;
  description: string;
  gradient: string;
  glow: string;
  borderColor: string;
  image: string;
  tag: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const FLAVORS: FlavorData[] = [
  {
    id: "fraise",
    emoji: "🍓",
    name: "Fraise & Crème",
    description: "Fraises fraîches, crème chantilly maison, coulis de fraise",
    gradient: "from-rose-500/20 to-pink-600/10",
    glow: "rgba(244, 63, 94, 0.45)",
    borderColor: "rgba(244, 63, 94, 0.35)",
    image: fraiseCreme,
    tag: "Best-seller",
  },
  {
    id: "nutella",
    emoji: "🍫",
    name: "Nutella Banane",
    description: "Nutella généreux, bananes fraîches, noisettes grillées",
    gradient: "from-amber-700/20 to-yellow-600/10",
    glow: "rgba(212, 175, 55, 0.55)",
    borderColor: "rgba(212, 175, 55, 0.45)",
    image: nutellaMenuImg,
    tag: "Signature",
  },
  {
    id: "pistache",
    emoji: "🌸",
    name: "Pistache & Rose",
    description: "Crème pistache artisanale, eau de rose, pétales séchés",
    gradient: "from-emerald-500/20 to-teal-500/10",
    glow: "rgba(16, 185, 129, 0.45)",
    borderColor: "rgba(16, 185, 129, 0.35)",
    image: pistacheRose,
    tag: "Premium",
  },
  {
    id: "fruits-des-bois",
    emoji: "🫐",
    name: "Fruits des Bois",
    description: "Myrthilles, framboises et mûres sur crème légère vanille",
    gradient: "from-violet-500/20 to-purple-600/10",
    glow: "rgba(139, 92, 246, 0.45)",
    borderColor: "rgba(139, 92, 246, 0.35)",
    image: fruitsDesBois,
    tag: "New",
  },
];

const TYPING_PHRASES = [
  "We craft experiences.",
  "We create memories.",
  "We define indulgence.",
  "We master artistry.",
];

const STATS = [
  { value: "12+", label: "Saveurs signatures" },
  { value: "100%", label: "Artisanal" },
  { value: "★ 4.9", label: "Satisfaction client" },
];

import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Cyclic typewriter effect with delete animation */
function useTypingEffect(
  phrases: string[],
  typingSpeed = 65,
  pauseDuration = 2400,
  deletingSpeed = 32
): string {
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];

    if (isPaused) {
      const t = setTimeout(() => { setIsPaused(false); setIsDeleting(true); }, pauseDuration);
      return () => clearTimeout(t);
    }

    if (isDeleting) {
      if (displayText.length === 0) {
        setIsDeleting(false);
        setPhraseIndex((i) => (i + 1) % phrases.length);
        return;
      }
      const t = setTimeout(() => setDisplayText((s) => s.slice(0, -1)), deletingSpeed);
      return () => clearTimeout(t);
    }

    if (displayText.length === currentPhrase.length) {
      setIsPaused(true);
      return;
    }

    const t = setTimeout(
      () => setDisplayText(currentPhrase.slice(0, displayText.length + 1)),
      typingSpeed
    );
    return () => clearTimeout(t);
  }, [displayText, phraseIndex, isDeleting, isPaused, phrases, typingSpeed, pauseDuration, deletingSpeed]);

  return displayText;
}

/** Spring-physics magnetic button effect */
function useMagneticButton(strength = 0.38) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 280, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 280, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      rawX.set((e.clientX - (rect.left + rect.width / 2)) * strength);
      rawY.set((e.clientY - (rect.top + rect.height / 2)) * strength);
    },
    [rawX, rawY, strength]
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { ref, springX, springY, handleMouseMove, handleMouseLeave };
}

// ── Sub-components ────────────────────────────────────────────────────────────

/** Animated gradient orbs + floating gold particles + dot-grid overlay */
const BackgroundAmbience = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {/* Purple orb — top-left */}
    <motion.div
      className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(109, 40, 217, 0.55) 0%, transparent 70%)",
        filter: "blur(72px)",
      }}
      animate={{ scale: [1, 1.18, 1], x: [0, 24, 0], y: [0, -18, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Gold orb — top-right */}
    <motion.div
      className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(212, 175, 55, 0.35) 0%, transparent 70%)",
        filter: "blur(88px)",
      }}
      animate={{ scale: [1, 1.14, 1], x: [0, -28, 0], y: [0, 22, 0] }}
      transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
    />
    {/* Deep purple orb — bottom-center */}
    <motion.div
      className="absolute -bottom-28 left-1/2 -translate-x-1/2 w-[700px] h-[280px] rounded-full"
      style={{
        background: "radial-gradient(ellipse, rgba(76, 29, 149, 0.7) 0%, transparent 70%)",
        filter: "blur(64px)",
      }}
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />
    {/* Rose accent orb — mid-right */}
    <motion.div
      className="absolute top-1/2 -right-16 w-72 h-72 rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(244, 63, 94, 0.18) 0%, transparent 70%)",
        filter: "blur(60px)",
      }}
      animate={{ scale: [1, 1.22, 1], y: [0, -30, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }}
    />

    {/* Floating micro-particles */}
    {Array.from({ length: 16 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: i % 4 === 0 ? 3 : 2,
          height: i % 4 === 0 ? 3 : 2,
          background:
            i % 3 === 0
              ? "rgba(212, 175, 55, 0.7)"
              : i % 3 === 1
              ? "rgba(139, 92, 246, 0.6)"
              : "rgba(255, 255, 255, 0.35)",
          left: `${8 + ((i * 5.9) % 84)}%`,
          top: `${10 + ((i * 7.1) % 80)}%`,
        }}
        animate={{
          y: [0, -22 - (i % 5) * 8, 0],
          x: [0, i % 2 === 0 ? 12 : -12, 0],
          opacity: [0.15, 0.65, 0.15],
          scale: [0.7, 1.5, 0.7],
        }}
        transition={{
          duration: 3.5 + (i % 6) * 0.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.35,
        }}
      />
    ))}

    {/* Fine dot-grid */}
    <div
      className="absolute inset-0 opacity-[0.025]"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(212,175,55,1) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    />
  </div>
));
BackgroundAmbience.displayName = "BackgroundAmbience";

// ─────────────────────────────────────────────────────────────────────────────

/** Single interactive flavor card with glow ring + image zoom + glassmorphism */
const FlavorCard = memo(function FlavorCard({
  flavor,
  index,
  reducedMotion,
}: {
  flavor: FlavorData;
  index: number;
  reducedMotion: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: index * 0.09 }}
      whileHover={reducedMotion ? {} : { y: -10, scale: 1.025 }}
      whileTap={{ scale: 0.975 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative group cursor-pointer"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Outer glow ring */}
      <AnimatePresence>
        {hovered && !reducedMotion && (
          <motion.div
            className="absolute -inset-px rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              boxShadow: `0 0 36px ${flavor.glow}, 0 0 72px ${flavor.glow}55`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Card body */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          height: "clamp(220px, 28vw, 288px)",
          background: "rgba(15, 10, 31, 0.82)",
          border: `1px solid ${hovered ? flavor.borderColor : "rgba(255,255,255,0.07)"}`,
          backdropFilter: "blur(24px)",
          transition: "border-color 0.35s ease, box-shadow 0.35s ease",
          boxShadow: hovered
            ? `0 24px 64px ${flavor.glow}40, inset 0 1px 0 rgba(255,255,255,0.12)`
            : "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Zooming background image */}
        <motion.div
          className="absolute inset-0"
          animate={hovered && !reducedMotion ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={flavor.image}
            alt={flavor.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Layered darkening gradient */}
          <div
            className="absolute inset-0 transition-all duration-500"
            style={{
              background: hovered
                ? `linear-gradient(to top, rgba(15,10,31,0.97) 0%, rgba(15,10,31,0.5) 55%, transparent 100%)`
                : `linear-gradient(to top, rgba(15,10,31,1) 0%, rgba(15,10,31,0.75) 50%, rgba(15,10,31,0.25) 100%)`,
            }}
          />
        </motion.div>

        {/* Tag badge */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase"
            style={{
              background: `${flavor.glow}28`,
              border: `1px solid ${flavor.borderColor}`,
              color: "#D4AF37",
              backdropFilter: "blur(12px)",
            }}
          >
            {flavor.tag}
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-2xl leading-none">{flavor.emoji}</span>
            <span className="font-heading font-bold text-white text-sm sm:text-base leading-tight">
              {flavor.name}
            </span>
          </div>

          <motion.p
            className="text-xs leading-relaxed mb-2"
            initial={false}
            animate={
              hovered && !reducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0.55, y: 3 }
            }
            transition={{ duration: 0.3 }}
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            {flavor.description}
          </motion.p>

          {/* Hover action */}
          <motion.div
            initial={false}
            animate={
              hovered && !reducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 6 }
            }
            transition={{ duration: 0.28, delay: 0.04 }}
          >
            <span
              className="text-xs font-bold tracking-wider uppercase"
              style={{ color: "#D4AF37" }}
            >
              Commander →
            </span>
          </motion.div>
        </div>

        {/* Top shimmer line on hover */}
        <AnimatePresence>
          {hovered && !reducedMotion && (
            <motion.div
              className="absolute top-0 left-0 right-0 h-px z-20"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.45 }}
              style={{
                background: `linear-gradient(90deg, transparent, ${flavor.borderColor}, transparent)`,
                transformOrigin: "left",
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

// ── Main Section ──────────────────────────────────────────────────────────────

const WowExperienceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const typingText = useTypingEffect(TYPING_PHRASES);
  const magnetic = useMagneticButton(0.42);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax transforms for layered depth
  const img1Y = useTransform(scrollYProgress, [0, 1], [50, -90]);
  const img2Y = useTransform(scrollYProgress, [0, 1], [-25, 65]);
  const img3Y = useTransform(scrollYProgress, [0, 1], [70, -45]);
  const img1Rotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);
  const img2Rotate = useTransform(scrollYProgress, [0, 1], [4, -4]);
  const bodyTextY = useTransform(scrollYProgress, [0, 0.6], [0, -28]);

  // Entrance variants
  const slideUp = {
    hidden: reducedMotion ? {} : { opacity: 0, y: 36 },
    visible: reducedMotion ? {} : { opacity: 1, y: 0 },
  };
  const slideLeft = {
    hidden: reducedMotion ? {} : { opacity: 0, x: -28 },
    visible: reducedMotion ? {} : { opacity: 1, x: 0 },
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden mt-8 sm:mt-10"
      aria-labelledby="wow-heading"
      style={{
        background:
          "linear-gradient(180deg, #4C1D95 0%, #3B0764 45%, #4C1D95 100%)",
      }}
    >
      <BackgroundAmbience />

      {/* ─── PART 1 — Scroll Story: Split hero ─────────────────────────────── */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── Left — Animated headline + CTA ──────────────────────────── */}
          <motion.div
            style={reducedMotion ? undefined : { y: bodyTextY }}
            className="flex flex-col gap-6 z-10"
          >
            {/* Eyebrow label */}
            <motion.div
              variants={slideLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.14em] uppercase"
                style={{
                  background: "rgba(212, 175, 55, 0.08)",
                  border: "1px solid rgba(212, 175, 55, 0.22)",
                  color: "#D4AF37",
                  backdropFilter: "blur(12px)",
                }}
              >
                <Sparkles className="w-3 h-3" aria-hidden />
                L'art créatif de la crêpe
              </span>
            </motion.div>

            {/* Main headline with typing effect */}
            <div id="wow-heading">
              <motion.h2
                variants={slideUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
                className="font-heading font-bold leading-[1.05] tracking-tight"
                style={{ fontSize: "clamp(2rem, 4.8vw + 0.5rem, 3.75rem)" }}
              >
                <span className="block" style={{ color: "rgba(255,255,255,0.88)" }}>
                  We don't just
                </span>
                <span
                  className="block"
                  style={{
                    background:
                      "linear-gradient(135deg, #FFFFFF 0%, #E5C76B 40%, #D4AF37 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  make crêpes.
                </span>

                {/* Typing line with animated cursor */}
                <span className="block mt-1 min-h-[1.15em]">
                  <span
                    style={{
                      background:
                        "linear-gradient(90deg, #7C3AED 0%, #A855F7 60%, #C084FC 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {typingText}
                  </span>
                  <motion.span
                    className="inline-block w-[3px] bg-crepe-gold ml-1 align-middle"
                    style={{ height: "0.85em" }}
                    animate={{ opacity: [1, 1, 0, 0] }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      times: [0, 0.44, 0.5, 1],
                      ease: "linear",
                    }}
                    aria-hidden
                  />
                </span>
              </motion.h2>
            </div>

            {/* Body copy */}
            <motion.p
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
              className="text-base sm:text-lg leading-relaxed max-w-md"
              style={{ color: "rgba(255,255,255,0.58)" }}
            >
              Chaque crêpe est une toile blanche. Chaque ingrédient, une note de
              perfection. Bienvenue dans l'univers{" "}
              <span style={{ color: "#D4AF37", fontWeight: 600 }}>Crêpe Time</span>.
            </motion.p>

            {/* Stats row */}
            <motion.div
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.26 }}
              className="flex items-center gap-6 sm:gap-10"
            >
              {STATS.map((stat, i) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <motion.span
                    className="font-heading font-bold"
                    style={{
                      fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                      background: "linear-gradient(135deg, #E5C76B, #D4AF37)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                    initial={reducedMotion ? {} : { opacity: 0, scale: 0.7 }}
                    whileInView={reducedMotion ? {} : { opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.32 + i * 0.07,
                    }}
                  >
                    {stat.value}
                  </motion.span>
                  <span
                    className="text-[11px] whitespace-nowrap"
                    style={{ color: "rgba(255,255,255,0.42)" }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}

              {/* Divider pip */}
              <div
                className="hidden sm:block w-px h-10 self-center"
                style={{ background: "rgba(212, 175, 55, 0.2)" }}
              />
            </motion.div>

            {/* Magnetic CTA button */}
            <motion.div
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.34 }}
            >
              <motion.div
                ref={magnetic.ref}
                onMouseMove={magnetic.handleMouseMove}
                onMouseLeave={magnetic.handleMouseLeave}
                style={
                  reducedMotion
                    ? undefined
                    : { x: magnetic.springX, y: magnetic.springY }
                }
                className="inline-block"
              >
                <Link
                  to="/menu"
                  className="group relative inline-flex items-center gap-3 px-7 py-4 rounded-full font-bold text-sm overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-crepe-gold/60 focus-visible:ring-offset-2"
                  style={{
                    background:
                      "linear-gradient(135deg, #D4AF37 0%, #C9A227 55%, #B8901F 100%)",
                    color: "#0F0A1F",
                    boxShadow:
                      "0 6px 28px rgba(212, 175, 55, 0.42), 0 0 48px rgba(212, 175, 55, 0.18)",
                  }}
                  aria-label="Découvrir le menu Crêpe Time"
                >
                  {/* Pulsing glow ring */}
                  <motion.span
                    className="absolute inset-0 rounded-full pointer-events-none"
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(212, 175, 55, 0)",
                        "0 0 28px rgba(212, 175, 55, 0.5)",
                        "0 0 0px rgba(212, 175, 55, 0)",
                      ],
                    }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                    aria-hidden
                  />
                  {/* Shine sweep */}
                  <span
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(105deg, transparent 28%, rgba(255,255,255,0.32) 50%, transparent 72%)",
                    }}
                    aria-hidden
                  />
                  <Sparkles
                    className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:rotate-[18deg]"
                    aria-hidden
                  />
                  <span className="relative z-10 tracking-wide">Découvrir le menu</span>
                  <ArrowRight
                    className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ── Right — Floating parallax images ─────────────────────────── */}
          <div
            className="relative h-[320px] sm:h-[420px] lg:h-[500px] hidden sm:block"
            aria-hidden="true"
          >
            {/* Large hero image (top-right, deepest layer) */}
            <motion.div
              style={reducedMotion ? undefined : { y: img1Y, rotate: img1Rotate }}
              className="absolute top-0 right-0 w-[260px] sm:w-[300px] lg:w-[350px] z-20"
            >
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  boxShadow:
                    "0 24px 64px rgba(0,0,0,0.55), 0 0 48px rgba(212,175,55,0.12)",
                  border: "1px solid rgba(212,175,55,0.18)",
                }}
              >
                <img
                  src={nutellaBananeFeature}
                  alt="Crêpe Nutella Banane signature"
                  className="w-full object-cover"
                  style={{ height: "clamp(180px, 24vw, 270px)" }}
                  loading="lazy"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(76,29,149,0.28) 0%, transparent 55%)",
                  }}
                />
                {/* Floating label */}
                <div
                  className="absolute bottom-3 left-3 px-3 py-1 rounded-lg text-xs font-semibold text-white"
                  style={{
                    background: "rgba(15,10,31,0.82)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(212,175,55,0.28)",
                  }}
                >
                  ✦ Nutella Banane
                </div>
              </div>
            </motion.div>

            {/* Medium second image (bottom-left, mid-layer) */}
            <motion.div
              style={reducedMotion ? undefined : { y: img2Y, rotate: img2Rotate }}
              className="absolute bottom-2 left-0 w-[195px] sm:w-[215px] lg:w-[240px] z-30"
            >
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  boxShadow:
                    "0 20px 56px rgba(0,0,0,0.5), 0 0 32px rgba(16,185,129,0.18)",
                  border: "1px solid rgba(16,185,129,0.28)",
                }}
              >
                <img
                  src={pistacheRose}
                  alt="Crêpe Pistache Rose"
                  className="w-full object-cover"
                  style={{ height: "clamp(150px, 18vw, 215px)" }}
                  loading="lazy"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(16,185,129,0.2) 0%, transparent 55%)",
                  }}
                />
                <div
                  className="absolute bottom-3 left-3 px-3 py-1 rounded-lg text-xs font-semibold text-white"
                  style={{
                    background: "rgba(15,10,31,0.82)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(16,185,129,0.28)",
                  }}
                >
                  🌸 Pistache Rose
                </div>
              </div>
            </motion.div>

            {/* Small accent image (mid-center, foreground) */}
            <motion.div
              style={reducedMotion ? undefined : { y: img3Y }}
              className="absolute top-16 left-[calc(50%-60px)] sm:left-1/4 w-[118px] sm:w-[138px] lg:w-[160px] z-10"
            >
              <div
                className="relative rounded-xl overflow-hidden opacity-80"
                style={{
                  boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <img
                  src={fraiseCreme}
                  alt="Crêpe Fraise Crème"
                  className="w-full object-cover"
                  style={{ height: "clamp(110px, 12vw, 145px)" }}
                  loading="lazy"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(244,63,94,0.18) 0%, transparent 55%)",
                  }}
                />
              </div>
            </motion.div>

            {/* Glassmorphism floating badge */}
            <motion.div
              className="absolute right-[16%] top-6 z-40"
              animate={reducedMotion ? {} : { y: [0, -12, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div
                className="px-4 py-2 rounded-full"
                style={{
                  background: "rgba(15,10,31,0.72)",
                  border: "1px solid rgba(212,175,55,0.28)",
                  backdropFilter: "blur(22px)",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.3), 0 0 22px rgba(212,175,55,0.1)",
                }}
              >
                <span
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: "#D4AF37" }}
                >
                  ✦ Artisan depuis 2021
                </span>
              </div>
            </motion.div>

            {/* Second floating badge */}
            <motion.div
              className="absolute left-[10%] top-1/2 -translate-y-1/2 z-40"
              animate={reducedMotion ? {} : { y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            >
              <div
                className="px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(109,40,217,0.18)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  backdropFilter: "blur(22px)",
                  boxShadow: "0 4px 20px rgba(109,40,217,0.2)",
                }}
              >
                <span className="text-xs font-bold" style={{ color: "rgba(167,139,250,0.9)" }}>
                  ★ 4.9 / 5
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ─── Ornamental divider ────────────────────────────────────────────── */}
      <div
        className="relative h-px mx-6 sm:mx-12 lg:mx-20"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.18), rgba(109,40,217,0.28), rgba(212,175,55,0.18), transparent)",
        }}
        aria-hidden="true"
      />

      {/* ─── PART 2 — Interactive Flavor Explorer ──────────────────────────── */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-14 sm:py-16 lg:py-20">
        {/* Section header */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 24 }}
          whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 sm:mb-12"
        >
          <span
            className="inline-block mb-3 px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.14em] uppercase"
            style={{
              background: "rgba(109,40,217,0.12)",
              border: "1px solid rgba(109,40,217,0.28)",
              color: "rgba(167,139,250,0.9)",
            }}
          >
            Explorer les saveurs
          </span>
          <h3
            className="font-heading font-bold"
            style={{
              fontSize: "clamp(1.5rem, 3.5vw, 2.6rem)",
              background: "linear-gradient(135deg, #FFFFFF 0%, #E5C76B 50%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.025em",
            }}
          >
            Choisissez votre moment de plaisir
          </h3>
          <p
            className="mt-2.5 text-sm sm:text-base max-w-sm mx-auto leading-relaxed"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Survolez chaque saveur pour la découvrir.
          </p>
        </motion.div>

        {/* Flavor cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {FLAVORS.map((flavor, i) => (
            <FlavorCard
              key={flavor.id}
              flavor={flavor}
              index={i}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        {/* Bottom CTA link */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          className="text-center mt-10 sm:mt-12"
        >
          <Link
            to="/menu"
            className="group inline-flex items-center gap-2 text-sm font-semibold tracking-wide transition-all duration-300"
            style={{ color: "rgba(212,175,55,0.8)" }}
          >
            <span className="border-b border-current border-opacity-40 group-hover:border-opacity-100 transition-all duration-300 pb-0.5">
              Voir toutes les saveurs
            </span>
            <ArrowRight
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5"
              aria-hidden
            />
          </Link>
        </motion.div>
      </div>

      {/* ─── Bottom fade-out ────────────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(76,29,149,0.7))",
        }}
        aria-hidden="true"
      />
    </section>
  );
};

export default memo(WowExperienceSection);
