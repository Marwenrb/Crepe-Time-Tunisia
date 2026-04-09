import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import BrandSignature from "@/components/shared/BrandSignature";

interface TypewriterState {
  displayed: string[];
  allDone: boolean;
}

function useTypewriterLines(
  lines: readonly string[],
  charMs = 58,
  lineGapMs = 260,
  startDelayMs = 400,
  reduced = false,
): TypewriterState {
  const [displayed, setDisplayed] = useState<string[]>(() =>
    reduced ? [...lines] : lines.map(() => "")
  );
  const [allDone, setAllDone] = useState(reduced);

  useEffect(() => {
    if (reduced) return;

    let alive = true;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    const go = (lineIdx: number, charIdx: number) => {
      if (!alive) return;

      if (lineIdx >= lines.length) {
        setAllDone(true);
        return;
      }

      const line = lines[lineIdx];
      const nextIdx = charIdx + 1;

      setDisplayed((prev) => {
        const next = [...prev];
        next[lineIdx] = line.slice(0, nextIdx);
        return next;
      });

      if (nextIdx >= line.length) {
        const nextLine = lineIdx + 1;
        if (nextLine < lines.length) {
          timerId = setTimeout(() => go(nextLine, 0), lineGapMs);
        } else {
          timerId = setTimeout(() => {
            if (alive) setAllDone(true);
          }, 80);
        }
      } else {
        timerId = setTimeout(() => go(lineIdx, nextIdx), charMs);
      }
    };

    timerId = setTimeout(() => go(0, 0), startDelayMs);

    return () => {
      alive = false;
      if (timerId !== null) clearTimeout(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { displayed, allDone };
}

export interface MobileHeroProps {
  lines: string[];
  subtitle: string;
}

const MobileHero = ({ lines, subtitle }: MobileHeroProps) => {
  const prefersReduced = useReducedMotion() ?? false;

  const { displayed, allDone } = useTypewriterLines(
    lines,
    58,
    260,
    400,
    prefersReduced,
  );

  const activeIdx = allDone
    ? -1
    : displayed.findIndex((displayedLine, index) => displayedLine.length < lines[index].length);

  const headlineMinHeight = 2 * Math.ceil(32 * 1.2) + 4;

  return (
    <div className="w-full max-w-sm">
      <div className="flex justify-center mb-6">
        <BrandSignature
          size="sm"
          align="center"
          surface="glass"
          loading="eager"
        />
      </div>

      <div
        style={{ marginBottom: 8, minHeight: headlineMinHeight }}
        aria-live="polite"
        aria-label={lines.join(" ")}
      >
        {lines.map((line, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "baseline",
              minHeight: Math.ceil(32 * 1.2),
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display, 'Syne', sans-serif)",
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
                display: "inline",
                ...(index === 1
                  ? {
                      background: "linear-gradient(135deg, #FAFAFA 0%, #FCD34D 65%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }
                  : { color: "#FAFAFA" }),
              }}
            >
              {displayed[index]}
            </span>

            {!prefersReduced && activeIdx === index && (
              <motion.span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  width: 2.5,
                  height: "0.8em",
                  background: "#8B5CF6",
                  borderRadius: 1,
                  marginLeft: 2,
                  verticalAlign: "baseline",
                  willChange: "opacity",
                }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.72, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {allDone && (
          <motion.p
            key="subtitle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.12 }}
            style={{
              fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
              fontSize: 14,
              color: "#6B6B8A",
              lineHeight: 1.65,
              marginTop: 10,
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
