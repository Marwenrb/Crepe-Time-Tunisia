import type { ReactNode } from "react";
import styles from "./AuthFormCard.module.css";

/**
 * AuthFormCard — UIverse ElSombrero2/tricky-robin-67 inspired card.
 *
 * Uses CSS `@property --ct-card-angle` + conic-gradient animation
 * to create a spinning gradient border effect around a dark glass panel.
 *
 * Drop this around any auth form body — it handles all visual framing.
 */
const AuthFormCard = ({ children }: { children: ReactNode }) => (
  <div className={styles.card}>
    <div className={styles.inner}>{children}</div>
  </div>
);

export default AuthFormCard;
