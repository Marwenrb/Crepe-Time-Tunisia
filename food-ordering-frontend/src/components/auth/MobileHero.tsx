import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import AuthLogo from "./AuthLogo";

/* ── Typing-effect hook ──────────────────────────────────────── */

interface TypewriterState {
  displayed: string[];
  allDone:   boolean;
}

/**
 * Types an array of lines sequentially, one character at a time.
 * When `reduced` is true the lines appear instantly (no animation).
 *
 * @param lines - Text lines to type in order
 * @param charMs - Milliseconds per character (default 55)
 * @param lineGapMs - Pause between lines (default 260)
 * @param startDelayMs - Initial delay before first character (default 450)
 * @param reduced - Prefers-reduced-motion flag (skips typing)
 */
function useTypewriterLines(
  lines:        string[],
  charMs        = 55,
  lineGapMs     = 260,
  startDelayMs  = 450,
  reduced       = false,
): TypewriterState {
  const [displayed, setDisplayed] = useState<string[]>(() =>
    reduced ? [...lines] : lines.map(() => "")
  );
  const [allDone, setAllDone] = useState(reduced);

  useEffect(() => {
    if (reduced) return;

    let cancelled  = false;
    let lineIdx    = 0;
    let charIdx    = 0;

    const tick = () => {
      if (cancelled) return;

      if (lineIdx >= lines.length) {
        setAllDone(true);
        return;
      }

      const line = lines[lineIdx];
      charIdx += 1;

      setDisplayed((prev) => {
        const next = [...prev];
        next[lineIdx] = line.slice(0, charIdx);
        return next;
      });

      if (charIdx >= line.length) {
        lineIdx += 1;
        charIdx  = 0;
        if (lineIdx < lines.length) {
          setTimeout(tick, lineGapMs);
        } else {
          setAllDone(true);
        }
      } else {
        setTimeout(tick, charMs);
      }
    };

    const start = setTimeout(tick, startDelayMs);
    return () => {
      cancelled = true;
      clearTimeout(start);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — runs once on mount

  return { displayed, allDone };
}

/* ── Component ───────────────────────────────────────────────── */

export interface MobileHeroProps {
  /** Lines to type sequentially (max 2 recommended) */
  lines:    string[];
  /** Subtitle shown with fade-in after all lines finish typing */
  subtitle: string;
}

/**
 * MobileHero — mobile-only welcome section with a typewriter effect.
 *
 * Shown on mobile (the caller wraps it in `md:hidden`).
 * Replaces the split LeftPanel that is hidden below the md breakpoint.
 * The subtitle fades in only after all lines finish typing, ensuring
 * there is never any visual overlap between the typing text and the
 * subtitle below it.
 */
const MobileHero = ({ lines, subtitle }: MobileHeroProps) => {
  const prefersReduced = useReducedMotion() ?? false;
  const { displayed, allDone } = useTypewriterLines(
    lines,
    /* charMs */ 58,
    /* lineGapMs */ 260,
    /* startDelayMs */ 400,
    prefersReduced,
  );

  /* Index of the currently-typing line (-1 when all done) */
  const activeIdx = allDone
    ? -1
    : displayed.findIndex((d, i) => d.length < lines[i].length);

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <AuthLogo />
      </div>

      {/* Typed headline */}
      <div
        style={{
          marginBottom: 6,
          /* Reserve a stable min-height for both lines so the card below doesn't jump */
          minHeight: "calc(2 * 1.2em + 4px)",
        }}
        aria-live="polite"
        aria-label={lines.join(" ")}
      >
        {lines.map((line, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            {/* Only render once we're about to type OR have started */}
            {(displayed[i].length > 0 || i === 0) && (
              <span
                style={{
                  fontFamily:    "var(--font-display, 'Syne', sans-serif)",
                  fontSize:      32,
                  fontWeight:    800,
                  letterSpacing: "-0.03em",
                  lineHeight:    1.2,
                  color:         "#FAFAFA",
                  display:       "inline",
                  /* The gradient text on the second line */
                  ...(i === 1 && displayed[i].length > 0
                    ? {
                        background:           "linear-gradient(135deg, #FAFAFA 0%, #FCD34D 60%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor:  "transparent",
                        backgroundClip:       "text",
                      }
                    : {}),
                }}
              >
                {displayed[i]}
              </span>
            )}

            {/* Blinking cursor — only on the currently active line */}
            {!prefersReduced && activeIdx === i && (
              <motion.span
                aria-hidden="true"
                style={{
                  display:       "inline-block",
                  width:         2,
                  height:        "0.85em",
                  background:    "#8B5CF6",
                  borderRadius:  1,
                  marginLeft:    3,
                  verticalAlign: "middle",
                  willChange:    "opacity",
                }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.75, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Subtitle: fades in after typing is complete */}
      <AnimatePresence>
        {allDone && (
          <motion.p
            key="subtitle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
            style={{
              fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
              fontSize:   14,
              color:      "#6B6B8A",
              lineHeight: 1.65,
              marginTop:  8,
            }}
          >
            {subtitle}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileHero;
