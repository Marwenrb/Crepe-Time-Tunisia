import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// ─── Constants ────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;
const SCROLL_THRESHOLD = 300; // Show button after scrolling 300px

// ─── Haptic feedback ──────────────────────────────────────
const triggerHaptic = (): void => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(10);
  }
};

// ─── Component ────────────────────────────────────────────
const FOOTER_CLEARANCE = 20; // px above footer
const DEFAULT_BOTTOM = 24;   // px from viewport bottom

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [bottomPx, setBottomPx] = useState(DEFAULT_BOTTOM);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min((scrollY / docHeight) * 100, 100) : 0;

        setScrollProgress(progress);
        setIsVisible(scrollY > SCROLL_THRESHOLD);

        // Slide button up smoothly as footer enters viewport
        const footer = document.querySelector('footer');
        if (footer) {
          const footerRect = footer.getBoundingClientRect();
          const viewportH = window.innerHeight;
          const btnHeight = 48; // button approximate height
          if (footerRect.top < viewportH) {
            // Footer is overlapping viewport — push button up
            const needed = viewportH - footerRect.top + FOOTER_CLEARANCE;
            // Cap so button doesn't fly off the top
            const maxBottom = viewportH - btnHeight - 8;
            setBottomPx(Math.min(needed, maxBottom));
          } else {
            setBottomPx(DEFAULT_BOTTOM);
          }
        } else {
          setBottomPx(DEFAULT_BOTTOM);
        }

        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    triggerHaptic();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // Calculate stroke dash offset for circular progress
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ duration: 0.28, ease: EASE }}
          className="fixed right-4 sm:right-6 z-50"
          style={{ bottom: `${bottomPx}px`, transition: "bottom 0.25s ease-out" }}
        >
          {/* Ultra-Compact Premium Button */}
          <motion.div
            className="relative"
            style={{ borderRadius: "9999px" }}
            initial="rest"
            animate="rest"
            whileHover={reducedMotion ? "rest" : "hover"}
            whileTap={reducedMotion ? {} : { scale: 0.94 }}
            variants={{
              rest: {
                y: 0,
                boxShadow:
                  "0 0 0 1px rgba(212,175,55,0.28), 0 2px 10px rgba(212,175,55,0.32), 0 4px 20px rgba(212,175,55,0.10), inset 0 1px 0 rgba(255,255,255,0.36), inset 0 -1px 0 rgba(0,0,0,0.22)",
              },
              hover: {
                y: -3,
                boxShadow:
                  "0 0 0 1.5px rgba(212,175,55,0.60), 0 4px 16px rgba(212,175,55,0.55), 0 8px 32px rgba(212,175,55,0.20), inset 0 1px 0 rgba(255,255,255,0.40), inset 0 -1px 0 rgba(0,0,0,0.26)",
              },
            }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            {/* Breathing halo — compact */}
            {!reducedMotion && (
              <motion.span
                aria-hidden
                className="absolute pointer-events-none"
                style={{
                  inset: "-10px",
                  borderRadius: "9999px",
                  background:
                    "radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.32) 0%, transparent 62%)",
                  filter: "blur(10px)",
                }}
                animate={{
                  opacity: [0.40, 0.75, 0.40],
                  scale: [0.90, 1.10, 0.90],
                }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            <button
              onClick={scrollToTop}
              className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-crepe-gold/70 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent transition-shadow"
              style={{
                background:
                  "linear-gradient(135deg, #F7E07C 0%, #E5C76B 20%, #D4AF37 50%, #C2940E 80%, #B8901F 100%)",
                color: "#4C1D95",
              }}
              aria-label="Retour en haut"
            >
              {/* Circular progress ring */}
              <svg
                className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                aria-hidden
              >
                {/* Background ring — subtle */}
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  stroke="rgba(76,29,149,0.15)"
                  strokeWidth="2"
                  fill="none"
                />
                {/* Progress ring — animated purple */}
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  stroke="url(#purpleGradient)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: strokeOffset }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                />
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(76,29,149,0.90)" />
                    <stop offset="50%" stopColor="rgba(59,18,117,0.95)" />
                    <stop offset="100%" stopColor="rgba(76,29,149,0.90)" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Glass reflection — compact */}
              <span
                aria-hidden
                className="absolute top-0 left-0 right-0 h-[38%] rounded-full pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.26) 0%, transparent 100%)",
                }}
              />

              {/* Icon with micro animation */}
              <motion.span
                className="relative z-10 flex items-center justify-center"
                variants={{
                  rest: { y: 0 },
                  hover: { y: -2 },
                }}
                transition={{ duration: 0.22, ease: EASE }}
              >
                <ChevronUp className="w-4.5 h-4.5 sm:w-5 sm:h-5" strokeWidth={2.8} aria-hidden />
              </motion.span>

              {/* Progress indicator removed — clean minimal look */}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
