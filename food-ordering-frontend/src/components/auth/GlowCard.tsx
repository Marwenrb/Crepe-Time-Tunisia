import type { ReactNode } from "react";
import styles from "./GlowCard.module.css";

interface GlowCardProps {
  children: ReactNode;
}

/**
 * GlowCard — animated conic-gradient rotating border card.
 *
 * Uses the CSS @property --rotation Houdini trick to animate
 * the conic-gradient continuously. Falls back to a static gold
 * border in browsers that don't support @property or reduced-motion.
 */
const GlowCard = ({ children }: GlowCardProps) => (
  <div className={styles.cardOuter}>
    <div className={styles.cardInner}>{children}</div>
  </div>
);

export default GlowCard;
