import { Flame } from "lucide-react";
import styles from "./PageLoader.module.css";

/**
 * PageLoader v3.1 — triple-arc spinner with embedded Flame logo.
 *
 * Outer: violet CW 1.4 s  |  Mid: gold CCW 1.0 s  |  Inner: white-dim CW 0.75 s
 * Center: Flame medallion with gentle pulse + inner gloss reflection
 * Glow halo behind arcs breathes slowly (opacity + scale)
 * All animations GPU-composited (transform + opacity only)
 */
const PageLoader = () => (
  <div className={styles.root} role="status" aria-label="Chargement…">
    <div className={styles.arcContainer}>
      <div className={styles.arcOuter} />
      <div className={styles.arcMid}   />
      <div className={styles.arcInner} />

      {/* Logo centered inside the concentric arcs */}
      <div className={styles.logoCenter}>
        <div className={styles.logoMedallion}>
          <Flame
            size={22}
            color="#FCD34D"
            aria-hidden="true"
            style={{ filter: "drop-shadow(0 0 6px rgba(252,211,77,0.65))" }}
          />
        </div>
      </div>
    </div>

    <div className={styles.brand}>
      <span className={styles.brandName}>Cr&#234;pe Time</span>
      <span className={styles.status}>Chargement</span>
      <div className={styles.dots} aria-hidden="true">
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
    </div>
  </div>
);

export default PageLoader;
