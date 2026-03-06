/**
 * LuxurySignatureTitle
 * ─────────────────────────────────────────────────────────────────────────────
 * Ultra-premium cinematic hero title for "La Signature".
 *
 * Purple brand palette — all four layers work in harmony:
 *   • Base text  : deep violet → vivid purple → soft lavender gradient
 *   • Shimmer    : lavender-white highlight sweeps like starlight across the text
 *   • Glow halo  : radial purple ambient bloom
 *   • Underline  : violet-to-lavender animated line
 *
 * Animation choreography:
 *   Phase 1 — Typing reveal     : characters appear one-by-one with y-lift,
 *             opacity fade and blur resolution. A purple cursor blinks alongside.
 *   Phase 2 — Signature moment  : glow halo bursts open, a lavender shimmer
 *             sweeps across the text (clipPath wipe), then the underline draws in.
 *   Phase 3 — Alive             : a subtle violet shimmer repeats every ~5.5 s.
 *
 * Tech: Framer Motion v12 · React · TypeScript · Tailwind
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimation,
} from "framer-motion";

// ─── Brand colour tokens (pure purple palette) ───────────────────────────────

/** Deep luxury foundation — almost midnight violet. */
const C_DEEP       = "#1E0A4E";
/** Rich brand purple — bold presence. */
const C_RICH       = "#4C1D95";
/** Core vibrant purple — the brand star. */
const C_VIVID      = "#7C3AED";
/** Energetic purple — brightens the centre. */
const C_BRIGHT     = "#9333EA";
/** Soft violet — mid-range elegance. */
const C_SOFT       = "#A78BFA";
/** Pale lavender — light highlight. */
const C_LAVENDER   = "#C4B5FD";
/** Near-white lavender — shimmer peak. */
const C_SHIMMER    = "#EDE9FE";

// ─── Constants ───────────────────────────────────────────────────────────────

const TITLE = "La Signature";
const CHARS = Array.from(TITLE);

/** Seconds before the first character starts animating. */
const INITIAL_DELAY = 0.18;
/** Seconds between each successive character reveal. */
const CHAR_STAGGER  = 0.068;
/** Duration of each character's enter animation. */
const CHAR_DURATION = 0.65;

/** Wall-clock time (seconds) when the last character finishes animating. */
const TYPING_DONE_S =
  INITIAL_DELAY + (CHARS.length - 1) * CHAR_STAGGER + CHAR_DURATION;

// ─── Easing presets ──────────────────────────────────────────────────────────

/** Expo-out: snappy settle — used for character entry. */
const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
/** Silky-smooth: used for sweeps, glow, underline. */
const EASE_SILK: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

// ─── Framer variants ─────────────────────────────────────────────────────────

const charVariants = {
  hidden: {
    opacity: 0,
    y: 15,
    filter: "blur(8px)",
    scale: 0.88,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      delay: INITIAL_DELAY + i * CHAR_STAGGER,
      duration: CHAR_DURATION,
      ease: EASE_EXPO,
    },
  }),
};

// ─── Component ───────────────────────────────────────────────────────────────

export function LuxurySignatureTitle() {
  const [phase, setPhase] = useState<"typing" | "done">("typing");
  const [hovered, setHovered] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);

  const glowCtrl  = useAnimation();
  const sweepCtrl = useAnimation();

  /**
   * Runs a full lavender shimmer across the text:
   *   inset(0 100% 0  0%)  → hidden on the right  (pre-enter)
   *   inset(0   0% 0  0%)  → fully revealed        (peak glow)
   *   inset(0   0% 0 100%) → hidden on the left    (exit)
   */
  const runShimmer = useCallback(
    (duration = 1.25) =>
      sweepCtrl.start({
        clipPath: [
          "inset(0 100% 0 0%)",
          "inset(0 0% 0 0%)",
          "inset(0 0% 0 100%)",
        ],
        transition: {
          duration,
          ease: EASE_SILK,
          times: [0, 0.42, 1],
        },
      }),
    [sweepCtrl]
  );

  // Phase transition: typing → done
  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setPhase("done");

      // Simultaneous: ambient purple glow bursts open
      glowCtrl.start({
        opacity: [0, 1, 0.6],
        scale:   [0.7, 1.12, 1],
        transition: { duration: 1.7, ease: EASE_SILK },
      });

      // Brief pause, then the lavender shimmer sweep
      await new Promise<void>((r) => window.setTimeout(r, 280));
      await runShimmer(1.3);
    }, TYPING_DONE_S * 1000 + 120);

    return () => window.clearTimeout(timer);
  }, [glowCtrl, runShimmer]);

  // Periodic shimmer while alive
  useEffect(() => {
    if (phase !== "done") return;
    const id = window.setInterval(() => runShimmer(1.5), 5500);
    return () => window.clearInterval(id);
  }, [phase, runShimmer]);

  return (
    <span
      ref={rootRef}
      className="relative inline-flex flex-col items-center cursor-default"
      style={{ fontSize: "clamp(1.3rem, 3.2vw, 2.4rem)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Ambient glow halo — pure purple bloom ─────────────────────────── */}
      <motion.span
        animate={glowCtrl}
        initial={{ opacity: 0, scale: 0.7 }}
        className="absolute pointer-events-none select-none"
        aria-hidden="true"
        style={{
          inset: "-80% -120%",
          background: `radial-gradient(
            ellipse at 50% 55%,
            rgba(139, 92, 246, 0.50) 0%,
            rgba(124, 58, 237, 0.28) 36%,
            rgba(76,  29, 149, 0.12) 60%,
            transparent              80%
          )`,
          filter: "blur(22px)",
          zIndex: 0,
        }}
      />

      {/* ── Hover outer glow ring (extra premium hover feel) ──────────────── */}
      <motion.span
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.85 }}
        transition={{ duration: 0.45, ease: EASE_SILK }}
        className="absolute pointer-events-none select-none"
        aria-hidden="true"
        style={{
          inset: "-50% -80%",
          background: `radial-gradient(
            ellipse at 50% 50%,
            rgba(167, 139, 250, 0.30) 0%,
            rgba(124,  58, 237, 0.14) 50%,
            transparent               75%
          )`,
          filter: "blur(14px)",
          zIndex: 0,
        }}
      />

      {/* ── Text row ──────────────────────────────────────────────────────── */}
      <motion.span
        className="relative inline-flex items-center z-10"
        animate={{ scale: hovered ? 1.025 : 1 }}
        transition={{ duration: 0.38, ease: EASE_SILK }}
      >
        {/* Container that holds both text layers (base + shimmer) */}
        <span
          className="relative inline-block font-heading font-bold leading-none tracking-tight"
          style={{
            // Outer purple glow that always lives on the text
            filter: `drop-shadow(0 0 18px rgba(139, 92, 246, ${hovered ? "0.55" : "0.30"}))
                     drop-shadow(0 2px 8px rgba(76, 29, 149, 0.20))`,
            transition: "filter 0.4s ease",
          }}
        >
          {/* ── Layer 1: Base gradient text — deep violet to pale lavender ── */}
          <span
            style={{
              display: "block",
              background: `linear-gradient(
                135deg,
                ${C_DEEP}     0%,
                ${C_RICH}    18%,
                ${C_VIVID}   40%,
                ${C_BRIGHT}  58%,
                ${C_SOFT}    74%,
                ${C_LAVENDER} 88%,
                ${C_SHIMMER} 100%
              )`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor:  "transparent",
              backgroundClip:       "text",
            }}
          >
            {CHARS.map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={charVariants}
                initial="hidden"
                animate="visible"
                style={{
                  display:    char === " " ? "inline" : "inline-block",
                  willChange: "transform, opacity, filter",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </span>

          {/* ── Layer 2: Lavender shimmer — clipPath wipe over base text ──── */}
          <motion.span
            animate={sweepCtrl}
            initial={{ clipPath: "inset(0 100% 0 0%)" }}
            aria-hidden="true"
            className="absolute inset-0 font-heading font-bold leading-none tracking-tight pointer-events-none select-none whitespace-nowrap"
            style={{
              background: `linear-gradient(
                135deg,
                ${C_RICH}     0%,
                ${C_VIVID}   16%,
                ${C_SOFT}    30%,
                #F5F3FF      46%,
                ${C_SHIMMER} 50%,
                #F5F3FF      54%,
                ${C_LAVENDER} 64%,
                ${C_SOFT}    76%,
                ${C_VIVID}   90%,
                ${C_RICH}   100%
              )`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor:  "transparent",
              backgroundClip:       "text",
              // Soft violet luminance glow on the shimmer pass
              filter:
                "drop-shadow(0 0 12px rgba(196, 181, 253, 0.70)) " +
                "drop-shadow(0 0  6px rgba(139,  92, 246, 0.50))",
            }}
          >
            {TITLE}
          </motion.span>
        </span>

        {/* ── Blinking luxury cursor — violet ───────────────────────────── */}
        <AnimatePresence>
          {phase === "typing" && (
            <motion.span
              exit={{
                opacity: 0,
                scaleY: 0.2,
                transition: { duration: 0.3, ease: "easeIn" },
              }}
              animate={{ opacity: [1, 0.05] }}
              transition={{
                duration:   0.52,
                repeat:     Infinity,
                repeatType: "mirror",
                ease:       "easeInOut",
              }}
              aria-hidden="true"
              style={{
                display:     "inline-block",
                flexShrink:  0,
                width:       "1.5px",
                height:      "0.82em",
                marginLeft:  "2.5px",
                marginBottom:"0.04em",
                borderRadius:"1px",
                alignSelf:   "center",
                background:  `linear-gradient(to bottom, ${C_SHIMMER} 0%, ${C_SOFT} 40%, ${C_VIVID} 100%)`,
                boxShadow:   "0 0 8px 2px rgba(139, 92, 246, 0.80)",
                willChange:  "opacity",
              }}
            />
          )}
        </AnimatePresence>
      </motion.span>

      {/* ── Animated underline — violet gradient ─────────────────────────── */}
      <AnimatePresence>
        {phase === "done" && (
          <motion.span
            aria-hidden="true"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.0, ease: EASE_EXPO, delay: 0.14 }}
            style={{
              display:         "block",
              height:          "1px",
              width:           "100%",
              marginTop:       "4px",
              transformOrigin: "left center",
              background: `linear-gradient(
                90deg,
                transparent  0%,
                ${C_RICH}    8%,
                ${C_VIVID}  24%,
                ${C_SOFT}   40%,
                ${C_SHIMMER} 50%,
                ${C_SOFT}   60%,
                ${C_VIVID}  76%,
                ${C_RICH}   92%,
                transparent 100%
              )`,
              boxShadow: "0 0 6px 1px rgba(139, 92, 246, 0.45)",
            }}
          />
        )}
      </AnimatePresence>
    </span>
  );
}

export default LuxurySignatureTitle;
