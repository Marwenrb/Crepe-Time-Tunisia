import { BRAND } from "@/config/brand";
import { motion, useReducedMotion, type Variants } from "framer-motion";

/**
 * AuthLogo v4.0 — animated medallion only.
 *
 * Brand text ("Crêpe Time", tagline) deliberately removed — it lives in
 * the Footer. This component is the visual anchor in LeftPanel; the
 * headline copy ("La douceur commence ici.") provides the brand voice.
 *
 * Layers:
 *   1. Sonar pulse ring (violet) — expands + fades on repeat
 *   2. Sonar pulse ring (gold)   — offset timing
 *   3. Slow-rotating dashed orbit (25 s/rev)
 *   4. White medallion + official logo + violet glow
 *   5. Gentle float animation on the medallion (y ± 4 px)
 */
const AuthLogo = () => {
  const reduced = useReducedMotion();

  const wrapVariants: Variants = reduced
    ? {}
    : {
        hidden:  { opacity: 0, y: -14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <motion.div
      style={{
        position:       "relative",
        width:          80,
        height:         80,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
      }}
      variants={wrapVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Sonar pulse 1 — violet */}
      {!reduced && (
        <motion.div
          aria-hidden="true"
          style={{
            position:     "absolute",
            inset:        0,
            borderRadius: 24,
            border:       "1.5px solid #7C3AED",
            willChange:   "transform, opacity",
          }}
          animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", repeatDelay: 0.6 }}
        />
      )}

      {/* Sonar pulse 2 — gold, offset */}
      {!reduced && (
        <motion.div
          aria-hidden="true"
          style={{
            position:     "absolute",
            inset:        0,
            borderRadius: 24,
            border:       "1px solid rgba(245,158,11,0.55)",
            willChange:   "transform, opacity",
          }}
          animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 1.1, repeatDelay: 0.6 }}
        />
      )}

      {/* Slow-rotating dashed orbit */}
      {!reduced && (
        <motion.div
          aria-hidden="true"
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

      {/* Official logo medallion */}
      <motion.div
        style={{
          width:          70,
          height:         70,
          borderRadius:   20,
          background:     "#FFFFFF",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          overflow:       "hidden",
          boxShadow: [
            "0 0 0 2px rgba(139,92,246,0.45)",
            "0 0 40px rgba(124,58,237,0.30)",
            "0 8px 24px rgba(0,0,0,0.45)",
          ].join(", "),
          flexShrink: 0,
        }}
        animate={!reduced ? { y: [0, -4, 0] } : {}}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src={BRAND.logo}
          alt={BRAND.name}
          width={62}
          height={62}
          style={{ objectFit: "contain", objectPosition: "center" }}
          loading="eager"
          decoding="async"
        />
      </motion.div>
    </motion.div>
  );
};

export default AuthLogo;
