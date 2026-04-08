import { motion, useReducedMotion } from "framer-motion";
import styles from "./AuthBackground.module.css";

/* Three floating orbs — GPU-only (scale + opacity). */
const ORB_CONFIG = [
  { size: 360, x: "72%",  y: "12%",  color: "rgba(124,58,237,0.13)",  duration: 20 },
  { size: 240, x: "12%",  y: "62%",  color: "rgba(245,158,11,0.09)",   duration: 26 },
  { size: 180, x: "48%",  y: "82%",  color: "rgba(91,33,182,0.11)",    duration: 17 },
] as const;

/**
 * AuthBackground — full-screen atmospheric layer (v3.0 Liquid Dark Premium).
 *
 * Layer stack (bottom → top):
 *   1. CSS module :: background-color + nebula glow pockets (::before/::after)
 *   2. CSS module grid — micro-dot grid with radial mask
 *   3. Framer Motion orbs — floating radial blobs (skipped on reduced-motion)
 *
 * Positioned fixed so it covers the full viewport regardless of scroll.
 * Must be a sibling (not an ancestor) of scrollable content.
 */
const AuthBackground = () => {
  const reduced = useReducedMotion();

  return (
    <div className={styles.bgRoot} aria-hidden="true">
      <div className={styles.bgGrid} />

      {!reduced &&
        ORB_CONFIG.map((orb, i) => (
          <motion.div
            key={i}
            style={{
              position:      "absolute",
              width:         orb.size,
              height:        orb.size,
              left:          orb.x,
              top:           orb.y,
              background:    `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              borderRadius:  "50%",
              transform:     "translate(-50%, -50%)",
              willChange:    "transform, opacity",
              pointerEvents: "none",
            }}
            animate={{ scale: [1, 1.18, 1], opacity: [0.55, 1, 0.55] }}
            transition={{
              duration: orb.duration,
              repeat:   Infinity,
              ease:     "easeInOut",
              delay:    i * 3,
            }}
          />
        ))}
    </div>
  );
};

export default AuthBackground;
