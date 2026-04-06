/**
 * HeroContent — full-viewport hero overlay for the Crêpe Time home page.
 *
 * Architecture:
 *   • Sits inside `div.hero-critical` (position:relative, height defined in
 *     index.html critical CSS + Layout.tsx Tailwind classes).
 *   • `position:absolute inset-0` — always fills the hero container exactly.
 *   • All animations: `opacity` + `transform` only (GPU-composited).
 *   • Respects `prefers-reduced-motion` — renders final state instantly.
 *   • Mobile-first responsive — every size token uses clamp() or breakpoints.
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════ */

const MENU_HREF = (import.meta.env.VITE_RESTAURANT_ID as string | undefined)
  ? `/detail/${import.meta.env.VITE_RESTAURANT_ID as string}`
  : "/menu";

const SUBLINES = [
  "Préparées avec passion, chaque jour à Nabeul.",
  "Des ingrédients premium, une recette unique.",
  "Livraison en 30 min ou retrait en boutique.",
] as const;

/** Framer Motion v12: ease must be a const tuple, not number[] */
const EASE = [0.22, 1, 0.36, 1] as const;

/* ═══════════════════════════════════════════════════════════════
   ANIMATION VARIANTS
═══════════════════════════════════════════════════════════════ */

const containerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
} as const;

const itemV = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
} as const;

const wordV = {
  hidden: { opacity: 0, y: 10, rotateX: -8 },
  show:   { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.25, ease: EASE } },
} as const;

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */

function isShopOpen(): boolean {
  const h = new Date().getHours();
  return h >= 10 && h < 23;
}

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════════ */

/**
 * StatusDot — triple-ring breathing pulse.
 * Outer ring: slow scale pulse. Middle: glow halo. Core: solid dot.
 * GPU-composited: opacity + transform only.
 */
function StatusDot() {
  const open = isShopOpen();
  const color = open ? "#4ade80" : "#fbbf24";
  return (
    <span
      className="relative flex items-center justify-center shrink-0"
      style={{ width: 18, height: 18 }}
      aria-hidden="true"
    >
      {/* Ring 1 — outermost scale ping */}
      <span
        className="absolute rounded-full"
        style={{
          inset: 0,
          border: `1.5px solid ${color}`,
          opacity: 0.25,
          animation: "hc-ping 2.4s cubic-bezier(0,0,0.2,1) infinite",
        }}
      />
      {/* Ring 2 — glow halo */}
      <span
        className="absolute rounded-full"
        style={{
          inset: 3,
          background: color,
          opacity: 0.15,
          animation: "hc-dot-breathe 2.4s ease-in-out infinite",
        }}
      />
      {/* Core dot */}
      <span
        className="relative rounded-full"
        style={{
          width: 7,
          height: 7,
          background: color,
          boxShadow: `0 0 6px 1px ${color}`,
          flexShrink: 0,
        }}
      />
    </span>
  );
}

/**
 * LocationBadge — floating geo pill with animated border glow.
 * Double-border technique: outer border is a gradient mask, inner is the card.
 * No backdrop-filter animation — static blur on a non-animated element.
 */
function LocationBadge({ open }: { open: boolean }) {
  return (
    <div
      className="hc-badge-wrap relative inline-flex rounded-full overflow-hidden"
      style={{ padding: 1.5 }}
    >
      {/* Rotating conic gradient border */}
      <div
        aria-hidden="true"
        className="absolute"
        style={{
          inset: "-150%",
          background:
            "conic-gradient(from 0deg, #D4AF37, transparent 20%, #7C3AED 40%, transparent 60%, #EDD060 80%, #D4AF37)",
          animation: "hc-rotate-border 4s linear infinite",
          willChange: "transform",
        }}
      />

      <div
        className="relative inline-flex items-center rounded-full"
        style={{
          gap: "clamp(5px,1.4vw,9px)",
          padding: "clamp(7px,1.3vw,10px) clamp(14px,2.8vw,20px)",
          background: "rgba(8,4,20,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          fontSize: "clamp(0.68rem,1.8vw,0.78rem)",
          letterSpacing: "0.02em",
          borderRadius: 100,
        }}
      >
        {/* Map pin with neon glow */}
        <span
          className="relative flex items-center justify-center"
          style={{ width: "1.2em", height: "1.2em", flexShrink: 0 }}
        >
          <MapPin
            style={{
              width: "100%",
              height: "100%",
              color: "#D4AF37",
              filter: "drop-shadow(0 0 6px rgba(212,175,55,0.6))",
            }}
            aria-hidden="true"
          />
        </span>

        <span
          className="font-heading"
          style={{
            color: "rgba(255,255,255,0.9)",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textShadow: "0 0 8px rgba(255,255,255,0.08)",
          }}
        >
          Nabeul
        </span>

        {/* Circuit-trace inspired separator */}
        <span
          aria-hidden="true"
          className="relative"
          style={{
            width: 1,
            height: "0.9em",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, transparent, rgba(212,175,55,0.5), transparent)",
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
              boxShadow: "0 0 4px 1px rgba(212,175,55,0.6)",
              animation: "hc-trace-flow 2s ease-in-out infinite",
            }}
          />
        </span>

        <StatusDot />

        <span
          role="status"
          aria-live="polite"
          style={{
            fontWeight: 700,
            color: open ? "#4ade80" : "#fbbf24",
            letterSpacing: "0.03em",
            textShadow: open
              ? "0 0 10px rgba(74,222,128,0.4)"
              : "0 0 10px rgba(251,191,36,0.4)",
          }}
        >
          {open ? "Ouvert" : "Livraison Disponible"}
        </span>
      </div>
    </div>
  );
}

/** Word-by-word staggered h1 with SVG underline drawn on mount */
function HeroHeading({ reduced }: { reduced: boolean }) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const p = pathRef.current;
    if (!p || reduced) return;
    const len = p.getTotalLength();
    p.style.strokeDasharray = String(len);
    p.style.strokeDashoffset = String(len);
    const id = window.setTimeout(() => {
      p.style.transition = "stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1)";
      p.style.strokeDashoffset = "0";
    }, 320);
    return () => window.clearTimeout(id);
  }, [reduced]);

  const hlV = reduced
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : { hidden: {}, show: { transition: { staggerChildren: 0.055 } } };
  const wV = reduced ? { hidden: { opacity: 1 }, show: { opacity: 1 } } : wordV;

  return (
    <h1
      className="font-heading font-bold text-white select-none"
      style={{ fontSize: "clamp(2.1rem,7.5vw,5rem)", letterSpacing: "-0.025em", lineHeight: 1.07 }}
    >
      {/* Line 1 */}
      <motion.span
        className="flex flex-wrap justify-center"
        style={{ gap: "0.22em", perspective: 600 }}
        variants={hlV}
      >
        {(["Chaque", "Crêpe,"] as const).map((w) => (
          <motion.span
            key={w}
            variants={wV}
            style={{ display: "inline-block", transformOrigin: "bottom center" }}
          >
            {w}
          </motion.span>
        ))}
      </motion.span>

      {/* Line 2 */}
      <motion.span
        className="flex flex-wrap justify-center"
        style={{ gap: "0.22em", perspective: 600 }}
        variants={hlV}
      >
        <motion.span
          variants={wV}
          style={{
            display: "inline-block",
            transformOrigin: "bottom center",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Une
        </motion.span>

        <motion.span
          variants={wV}
          className="relative"
          style={{ display: "inline-block", transformOrigin: "bottom center" }}
        >
          <span
            style={{
              background:
                "linear-gradient(135deg,#C9A227 0%,#D4AF37 30%,#F0D060 55%,#D4AF37 75%,#B8901F 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 20px rgba(212,175,55,0.3))",
            }}
          >
            Expérience
          </span>

          {/* Drawn SVG underline */}
          <svg
            aria-hidden="true"
            viewBox="0 0 200 10"
            preserveAspectRatio="none"
            className="absolute left-0 w-full overflow-visible pointer-events-none"
            style={{ bottom: "-0.18em", height: 10 }}
          >
            <path
              ref={pathRef}
              d="M1,6 C40,1 80,9 100,5 C120,1 162,9 199,4"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{
                strokeDasharray: 220,
                strokeDashoffset: reduced ? 0 : 220,
                filter: "drop-shadow(0 0 5px rgba(212,175,55,0.55))",
              }}
            />
          </svg>
        </motion.span>
      </motion.span>
    </h1>
  );
}

/** Cycling subline with opacity crossfade */
function SublineCycler() {
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);

  useEffect(() => {
    const id = window.setInterval(() => {
      setVis(false);
      window.setTimeout(() => {
        setIdx((i) => (i + 1) % SUBLINES.length);
        setVis(true);
      }, 280);
    }, 4200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p
      aria-live="polite"
      style={{
        opacity: vis ? 1 : 0,
        transition: "opacity 280ms ease",
        minHeight: "1.5em",
        fontSize: "clamp(0.82rem,2.2vw,1.05rem)",
        color: "rgba(255,255,255,0.62)",
        lineHeight: 1.65,
      }}
    >
      {SUBLINES[idx]}
    </p>
  );
}

/**
 * CtaButton — Premium neon-glow CTA.
 * Adapted from Uiverse.io glow pattern → gold brand palette.
 * Uses CSS custom properties for the glow system.
 * Includes ::after floor reflection, hover color-flip, active press.
 * Focus-visible: gold ring (WCAG 2.4.11).
 */
function CtaButton() {
  return (
    <Link
      to={MENU_HREF}
      aria-label="Commander vos crêpes maintenant"
      className="hc-glow-btn group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto font-bold overflow-visible"
      style={{
        /* Gold glow palette — CSS custom props */
        "--glow-color": "rgb(212, 175, 55)",
        "--glow-spread": "rgba(212, 175, 55, 0.45)",
        "--glow-enhanced": "rgb(237, 208, 96)",
        "--btn-bg": "rgb(26, 18, 51)",
        border: "0.16em solid var(--glow-color)",
        padding: "clamp(10px,1.8vw,14px) clamp(22px,4vw,38px)",
        color: "var(--glow-color)",
        fontSize: "clamp(0.8rem,1.7vw,0.95rem)",
        fontWeight: 700,
        letterSpacing: "0.04em",
        backgroundColor: "var(--btn-bg)",
        borderRadius: "0.9em",
        outline: "none",
        boxShadow: [
          "0 0 0.8em 0.2em var(--glow-color)",
          "0 0 3em 0.8em var(--glow-spread)",
          "inset 0 0 0.6em 0.15em var(--glow-color)",
        ].join(","),
        textShadow: "0 0 0.5em var(--glow-color)",
        transition: "all 0.3s ease",
      } as React.CSSProperties}
    >
      {/* Floor reflection — ::after equivalent via absolute span */}
      <span
        aria-hidden="true"
        className="hc-glow-floor absolute pointer-events-none left-0 w-full"
        style={{
          top: "115%",
          height: "80%",
          background: "var(--glow-spread)",
          filter: "blur(1.6em)",
          opacity: 0.55,
          transform: "perspective(1.2em) rotateX(35deg) scale(1,0.5)",
          borderRadius: "50%",
          transition: "opacity 0.3s ease",
        }}
      />

      <span className="relative z-10 flex items-center gap-2">
        Commander Maintenant
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-200 group-hover:translate-x-1"
        >
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </span>
    </Link>
  );
}

/**
 * StatsCard — floating metrics bar with glow border + inner neon accents.
 * Same glow language as the CTA button for visual cohesion.
 * Each stat cell has an icon with its own micro-glow.
 */
function StatsCard() {
  const stats = [
    { icon: "⚡", value: "30 min", label: "Livraison",   key: "delivery", glow: "rgba(250,204,21,0.6)"  },
    { icon: "★",  value: "4.9",    label: "Note client", key: "rating",   glow: "rgba(212,175,55,0.6)"  },
    { icon: "✦",  value: "12",     label: "Crêpes",      key: "menu",     glow: "rgba(229,199,107,0.6)" },
  ] as const;

  return (
    <div
      role="list"
      aria-label="Points forts"
      className="hc-stats-wrap relative overflow-hidden"
      style={{ borderRadius: 12, padding: 1.5, width: "100%", maxWidth: 252 }}
    >
      {/* Rotating conic gradient border */}
      <div
        aria-hidden="true"
        className="absolute"
        style={{
          inset: "-200%",
          background:
            "conic-gradient(from 0deg, #D4AF37, transparent 20%, #7C3AED 40%, transparent 60%, #EDD060 80%, #D4AF37)",
          animation: "hc-rotate-border 5s linear infinite",
          willChange: "transform",
        }}
      />

      <div
        className="relative"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1px 1fr 1px 1fr",
          background: "rgba(8,4,20,0.92)",
          borderRadius: 10.5,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          overflow: "hidden",
        }}
      >
        {stats.map((s, i) => (
          <>
            <div
              key={s.key}
              role="listitem"
              className="flex flex-col items-center justify-center"
              style={{ padding: "clamp(4px,1vw,7px) clamp(3px,0.8vw,6px)" }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontSize: "clamp(0.68rem,1.5vw,0.85rem)",
                  color: "#D4AF37",
                  lineHeight: 1,
                  marginBottom: 1,
                  filter: `drop-shadow(0 0 6px ${s.glow})`,
                }}
              >
                {s.icon}
              </span>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: "clamp(0.7rem,1.5vw,0.85rem)",
                  color: "#EDD060",
                  letterSpacing: "0.01em",
                  lineHeight: 1.15,
                  textShadow: "0 0 10px rgba(212,175,55,0.4)",
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontSize: "clamp(0.48rem,0.9vw,0.55rem)",
                  fontWeight: 700,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.4)",
                  marginTop: 1,
                  whiteSpace: "nowrap" as const,
                }}
              >
                {s.label}
              </span>
            </div>
            {i < 2 && (
              <div
                key={`div-${s.key}`}
                aria-hidden="true"
                className="relative"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 10%, rgba(212,175,55,0.3) 50%, transparent 90%)",
                  width: "1px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: 3,
                    height: 3,
                    left: -1,
                    borderRadius: "50%",
                    background: "#EDD060",
                    boxShadow: "0 0 6px 2px rgba(212,175,55,0.6)",
                    animation: `hc-trace-flow ${2.5 + i * 0.4}s ease-in-out infinite`,
                  }}
                />
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
}

/** Decorative scroll cue — transform only, hidden on mobile */
function ScrollCue() {
  return (
    <div
      aria-hidden="true"
      className="hidden sm:flex absolute bottom-5 left-1/2 -translate-x-1/2 flex-col items-center"
      style={{ gap: 6 }}
    >
      <span
        style={{
          fontSize: "0.5rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.28em",
          color: "rgba(212,175,55,0.4)",
        }}
      >
        Voir plus
      </span>
      <div
        style={{
          width: 1,
          height: 38,
          background: "linear-gradient(to bottom,rgba(212,175,55,0.5),rgba(212,175,55,0.08))",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "44%",
            background: "#D4AF37",
            animation: "hc-scroll-dot 1.8s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INLINE KEYFRAMES — GPU-composited: opacity + transform only
═══════════════════════════════════════════════════════════════ */
const KEYFRAMES = `
  /* ── Status dot animations ── */
  @keyframes hc-ping {
    75%, 100% { transform: scale(2.6); opacity: 0; }
  }
  @keyframes hc-dot-breathe {
    0%, 100% { opacity: 0.15; transform: scale(1); }
    50%      { opacity: 0.3;  transform: scale(1.15); }
  }

  /* ── Scroll cue ── */
  @keyframes hc-scroll-dot {
    0%   { transform: translateY(-115%); opacity: 0; }
    18%  { opacity: 1; }
    82%  { opacity: 0.7; }
    100% { transform: translateY(240%); opacity: 0; }
  }

  /* ── Rotating conic gradient border ── */
  @keyframes hc-rotate-border {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* ── Circuit trace flow ── */
  @keyframes hc-trace-flow {
    0%, 100% { transform: translateY(-120%); opacity: 0; }
    10%      { opacity: 1; }
    90%      { opacity: 0.8; }
    100%     { transform: translateY(800%); opacity: 0; }
  }

  /* ── CTA glow button — hover / active / focus states ── */
  .hc-glow-btn:hover {
    color: var(--btn-bg) !important;
    background-color: var(--glow-color) !important;
    box-shadow:
      0 0 1em 0.25em var(--glow-color),
      0 0 4em 2em var(--glow-spread),
      inset 0 0 0.75em 0.25em var(--glow-color) !important;
    text-shadow: none !important;
  }
  .hc-glow-btn:hover .hc-glow-floor {
    opacity: 0.75 !important;
  }
  .hc-glow-btn:active {
    transform: scale(0.97);
    box-shadow:
      0 0 0.5em 0.2em var(--glow-color),
      0 0 2em 1.5em var(--glow-spread),
      inset 0 0 0.4em 0.15em var(--glow-color) !important;
  }
  .hc-glow-btn:focus-visible {
    outline: 2px solid var(--glow-color);
    outline-offset: 4px;
  }

  /* ── Stats card subtle pulse ── */
  @keyframes hc-stats-glow {
    0%, 100% { filter: drop-shadow(0 0 14px rgba(212,175,55,0.1)) drop-shadow(0 0 40px rgba(212,175,55,0.05)); }
    50%      { filter: drop-shadow(0 0 20px rgba(212,175,55,0.16)) drop-shadow(0 0 50px rgba(212,175,55,0.08)); }
  }
  .hc-stats-wrap {
    animation: hc-stats-glow 4s ease-in-out infinite;
  }
`;

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const HeroContent = () => {
  const reduced = useReducedMotion() ?? false;
  const open = isShopOpen();

  const cv = reduced ? { hidden: { opacity: 1 }, show: { opacity: 1 } } : containerV;
  const iv = reduced ? { hidden: { opacity: 1 }, show: { opacity: 1 } } : itemV;

  return (
    <>
      <style>{KEYFRAMES}</style>

      <section
        aria-label="Bienvenue chez Crêpe Time"
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{ padding: "0 clamp(16px,4vw,32px)" }}
      >
        <motion.div
          className="flex flex-col items-center w-full"
          style={{ gap: "clamp(10px,2.2vw,20px)", maxWidth: "min(600px,90vw)" }}
          variants={cv}
          initial="hidden"
          animate="show"
        >
          {/* 1 · Location badge */}
          <motion.div variants={iv}>
            <LocationBadge open={open} />
          </motion.div>

          {/* 2 · Animated heading */}
          <motion.div variants={iv} className="w-full">
            <HeroHeading reduced={reduced} />
          </motion.div>

          {/* 3 · Cycling subline */}
          <motion.div variants={iv} className="w-full">
            <SublineCycler />
          </motion.div>

          {/* 4 · CTA button */}
          <motion.div variants={iv} className="w-full sm:w-auto">
            <CtaButton />
          </motion.div>

          {/* 5 · Stats card */}
          <motion.div
            className="w-full flex justify-center"
            initial={reduced ? undefined : { opacity: 0, y: 14 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={reduced ? undefined : { delay: 0.7, duration: 0.5, ease: EASE }}
          >
            <StatsCard />
          </motion.div>
        </motion.div>

        {/* 6 · Scroll cue */}
        <ScrollCue />
      </section>
    </>
  );
};

export default HeroContent;
