import { BRAND } from "@/config/brand";
import { motion, useReducedMotion, type Variants } from "framer-motion";

/**
 * AuthLogo v3.2 — official logo + next-gen animated rings.
 *
 * Uses BRAND.logo (the official /crepe-time-logo.webp) — NOT a Lucide icon.
 * Medallion: white background + object-contain image (same treatment as Header/Footer).
 *
 * Layers (bottom → top):
 *   1. Sonar pulse ring (violet) — expands + fades on repeat
 *   2. Sonar pulse ring (gold)   — offset timing
 *   3. Slow-rotating dashed ring (25 s/rev)
 *   4. White medallion with official logo + gold glow box-shadow
 *   5. Gentle float animation on the medallion (y ± 4 px)
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
          position:       "relative",
          width:          80,
          height:         80,
          display:        "flex",
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
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", repeatDelay: 0.6 }}
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
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 1.1, repeatDelay: 0.6 }}
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

        {/* ── Official logo medallion ── */}
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
            position:   "relative",
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

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
