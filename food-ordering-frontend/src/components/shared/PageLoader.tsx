import { BRAND } from "@/config/brand";
import styles from "./PageLoader.module.css";

/**
 * PageLoader v3.2 — triple-arc spinner with official logo center.
 *
 * Uses BRAND.logo (/crepe-time-logo.webp) — NOT the Lucide Flame icon.
 * White medallion matches the Header / Footer / AuthLogo treatment.
 *
 * Outer: violet CW 1.4 s  |  Mid: gold CCW 1.0 s  |  Inner: white-dim CW 0.75 s
 * Center: logo pulse + inner glow halo
 * All animations GPU-composited (transform + opacity only)
 */
const PageLoader = () => (
  <div className={styles.root} role="status" aria-label="Chargement…">
    <div className={styles.arcContainer}>
      <div className={styles.arcOuter} />
      <div className={styles.arcMid}   />
      <div className={styles.arcInner} />

      {/* Official logo centered inside the concentric arcs */}
      <div className={styles.logoCenter}>
        <div className={styles.logoMedallion}>
          <img
            src={BRAND.logo}
            alt={BRAND.name}
            width={34}
            height={34}
            style={{ objectFit: "contain", objectPosition: "center" }}
            loading="eager"
            decoding="async"
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
