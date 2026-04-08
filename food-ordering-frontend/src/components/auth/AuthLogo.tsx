import { Flame } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

/**
 * AuthLogo v3.1 — next-gen animated medallion.
 *
 * Layers (bottom → top):
 *   1. Sonar pulse ring (violet) — expands + fades on repeat
 *   2. Sonar pulse ring (gold)   — offset timing
 *   3. Slow-rotating dashed ring (violet, 25 s/rev)
 *   4. Medallion with layered gradient + inner gloss reflection
 *   5. Flame icon with gentle float animation
 *   6. Syne gradient brand name + line-separator tagline
 */
const AuthLogo = () => {
  const reduced = useReducedMotion();

  const wrapVariants: Variants = reduced
    ? {}
    : {
        hidden:  { opacity: 0, y: -16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <motion.div
      className="flex flex-col items-center gap-5"
      variants={wrapVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Medallion wrapper ── */}
      <div
        style={{
          position: "relative",
          width:    80,
          height:   80,
          display:  "flex",
          alignItems:     "center",
          justifyContent: "center",
        }}
      >
        {/* Sonar pulse 1 — violet */}
        {!reduced && (
          <motion.div
            style={{
              position:     "absolute",
              inset:        0,
              borderRadius: 24,
              border:       "1.5px solid #7C3AED",
              willChange:   "transform, opacity",
            }}
            animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
            transition={{
              duration:    2.2,
              repeat:      Infinity,
              ease:        "easeOut",
              repeatDelay: 0.6,
            }}
          />
        )}

        {/* Sonar pulse 2 — gold, offset */}
        {!reduced && (
          <motion.div
            style={{
              position:     "absolute",
              inset:        0,
              borderRadius: 24,
              border:       "1px solid rgba(245,158,11,0.55)",
              willChange:   "transform, opacity",
            }}
            animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
            transition={{
              duration:    2.2,
              repeat:      Infinity,
              ease:        "easeOut",
              delay:       1.1,
              repeatDelay: 0.6,
            }}
          />
        )}

        {/* Slow-rotating dashed orbit */}
        {!reduced && (
          <motion.div
            style={{
              position:     "absolute",
              inset:        -10,
              borderRadius: 32,
              border:       "1px dashed rgba(139,92,246,0.28)",
              willChange:   "transform",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* ── Medallion ── */}
        <motion.div
          style={{
            width:          70,
            height:         70,
            borderRadius:   20,
            background:     "linear-gradient(145deg, #3B0764 0%, #4C1D95 45%, #6D28D9 100%)",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            boxShadow: [
              "0 0 0 1px rgba(139,92,246,0.45)",
              "0 0 48px rgba(124,58,237,0.35)",
              "0 12px 32px rgba(0,0,0,0.55)",
              "inset 0 1px 0 rgba(255,255,255,0.1)",
            ].join(", "),
            position:   "relative",
            flexShrink: 0,
            overflow:   "hidden",
          }}
          animate={!reduced ? { y: [0, -4, 0] } : {}}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Inner gloss reflection */}
          <div
            style={{
              position:   "absolute",
              inset:      0,
              borderRadius: 20,
              background: "radial-gradient(ellipse at 38% 30%, rgba(255,255,255,0.18) 0%, transparent 55%)",
              pointerEvents: "none",
            }}
          />
          <Flame
            size={30}
            color="#FCD34D"
            aria-hidden="true"
            style={{ filter: "drop-shadow(0 0 8px rgba(252,211,77,0.7))" }}
          />
        </motion.div>
      </div>

      {/* ── Brand name + tagline ── */}
      <div className="flex flex-col items-center gap-2">
        <span
          style={{
            fontFamily:           "var(--font-display, 'Syne', sans-serif)",
            fontSize:             28,
            fontWeight:           800,
            letterSpacing:        "-0.03em",
            lineHeight:           1.0,
            background:           "linear-gradient(135deg, #FFFFFF 0%, #FCD34D 48%, #F59E0B 72%, #FAFAFA 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor:  "transparent",
            backgroundClip:       "text",
          }}
        >
          Cr&#234;pe Time
        </span>

        {/* Line-separator tagline */}
        <div
          style={{
            display:     "flex",
            alignItems:  "center",
            gap:         8,
          }}
        >
          <span
            style={{
              width:      20,
              height:     1,
              background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.5))",
              display:    "inline-block",
            }}
          />
          <span
            style={{
              fontFamily:    "var(--font-body, 'DM Sans', sans-serif)",
              fontSize:      10,
              color:         "#6B6B8A",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Nabeul · Tunisia
          </span>
          <span
            style={{
              width:      20,
              height:     1,
              background: "linear-gradient(90deg, rgba(139,92,246,0.5), transparent)",
              display:    "inline-block",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AuthLogo;
