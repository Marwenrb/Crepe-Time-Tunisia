import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* ── Typing-effect hook ──────────────────────────────────────── */

interface TypewriterState {
  displayed: string[];
  allDone:   boolean;
}

/**
 * Types an array of lines sequentially, one character at a time.
 *
 * Uses a recursive argument-passing pattern (not mutable closure vars)
 * to eliminate off-by-one bugs and React StrictMode double-invoke issues.
 *
 * @param lines        - Text lines to type in order
 * @param charMs       - Milliseconds per character (default 58)
 * @param lineGapMs    - Pause between completing one line and starting the next (default 260)
 * @param startDelayMs - Initial delay before first character appears (default 400)
 * @param reduced      - Prefers-reduced-motion: skip typing, show all text immediately
 */
function useTypewriterLines(
  lines:        readonly string[],
  charMs        = 58,
  lineGapMs     = 260,
  startDelayMs  = 400,
  reduced       = false,
): TypewriterState {
  const [displayed, setDisplayed] = useState<string[]>(() =>
    reduced ? [...lines] : lines.map(() => "")
  );
  const [allDone, setAllDone] = useState(reduced);

  useEffect(() => {
    if (reduced) return;

    /*
     * `alive` flag + stored timer ID ensure we can cancel everything on
     * cleanup (e.g. React 18 StrictMode double-invoke or component unmount).
     */
    let alive     = true;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    /**
     * Recursive ticker — arguments are immutable per call, so there is
     * zero shared mutable state that could cause off-by-one bugs.
     */
    const go = (lineIdx: number, charIdx: number) => {
      if (!alive) return;

      /* All lines finished */
      if (lineIdx >= lines.length) {
        setAllDone(true);
        return;
      }

      const line    = lines[lineIdx];
      const nextIdx = charIdx + 1; // characters shown after this tick

      /* Update displayed text for current line */
      setDisplayed((prev) => {
        const next = [...prev];
        next[lineIdx] = line.slice(0, nextIdx);
        return next;
      });

      if (nextIdx >= line.length) {
        /* Current line complete — move to next or finish */
        const nextLine = lineIdx + 1;
        if (nextLine < lines.length) {
          timerId = setTimeout(() => go(nextLine, 0), lineGapMs);
        } else {
          /* All lines done — set state after the final display update settles */
          timerId = setTimeout(() => {
            if (alive) setAllDone(true);
          }, 80);
        }
      } else {
        /* More chars in current line */
        timerId = setTimeout(() => go(lineIdx, nextIdx), charMs);
      }
    };

    /* Initial start delay */
    timerId = setTimeout(() => go(0, 0), startDelayMs);

    return () => {
      alive = false;
      if (timerId !== null) clearTimeout(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — runs once on mount, lines captured by ref semantics

  return { displayed, allDone };
}

/* ── Component ───────────────────────────────────────────────── */

export interface MobileHeroProps {
  /** Lines to type sequentially — 2 lines recommended for mobile layout */
  lines:    string[];
  /** Subtitle that fades in after all lines finish typing */
  subtitle: string;
}

/**
 * MobileHero — mobile-only welcome section with a typewriter effect.
 *
 * Always wrapped in `md:hidden` by the caller. Replaces LeftPanel which
 * is hidden on mobile. The subtitle fades in only AFTER typing completes —
 * guaranteeing zero visual overlap at any frame.
 *
 * Line 0: white (#FAFAFA)
 * Line 1: gold gradient (linear-gradient 135deg, #FAFAFA → #FCD34D)
 * Cursor: violet (#8B5CF6), opacity blink via Framer Motion (GPU only)
 * Subtitle: DM Sans 14 px, color text-500 (#6B6B8A), fade-up on appear
 */
const MobileHero = ({ lines, subtitle }: MobileHeroProps) => {
  const prefersReduced = useReducedMotion() ?? false;

  const { displayed, allDone } = useTypewriterLines(
    lines,
    /* charMs       */ 58,
    /* lineGapMs    */ 260,
    /* startDelayMs */ 400,
    prefersReduced,
  );

  /* Index of the currently-typing line (-1 when all done) */
  const activeIdx = allDone
    ? -1
    : displayed.findIndex((d, i) => d.length < lines[i].length);

  /* Explicit pixel height = 2 lines × (32 px fontSize × 1.2 lineHeight) */
  const headlineMinHeight = 2 * Math.ceil(32 * 1.2) + 4; // ≈ 80 px

  return (
    <div className="w-full max-w-sm">
      {/* Typed headline — stable height prevents layout shift */}
      <div
        style={{ marginBottom: 8, minHeight: headlineMinHeight }}
        aria-live="polite"
        aria-label={lines.join(" ")}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              display:    "flex",
              alignItems: "baseline",
              minHeight:  Math.ceil(32 * 1.2), // per-line stable height
            }}
          >
            <span
              style={{
                fontFamily:    "var(--font-display, 'Syne', sans-serif)",
                fontSize:      32,
                fontWeight:    800,
                letterSpacing: "-0.03em",
                lineHeight:    1.2,
                display:       "inline",
                /* Gold gradient on second line once it starts appearing */
                ...(i === 1
                  ? {
                      background:           "linear-gradient(135deg, #FAFAFA 0%, #FCD34D 65%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor:  "transparent",
                      backgroundClip:       "text",
                    }
                  : { color: "#FAFAFA" }),
              }}
            >
              {displayed[i]}
            </span>

            {/* Blinking cursor — only on the active (currently-typing) line */}
            {!prefersReduced && activeIdx === i && (
              <motion.span
                aria-hidden="true"
                style={{
                  display:       "inline-block",
                  width:         2.5,
                  height:        "0.8em",
                  background:    "#8B5CF6",
                  borderRadius:  1,
                  marginLeft:    2,
                  verticalAlign: "baseline",
                  willChange:    "opacity",
                }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.72, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Subtitle fades in only after all lines finish typing */}
      <AnimatePresence>
        {allDone && (
          <motion.p
            key="subtitle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.12 }}
            style={{
              fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
              fontSize:   14,
              color:      "#6B6B8A",
              lineHeight: 1.65,
              marginTop:  10,
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
