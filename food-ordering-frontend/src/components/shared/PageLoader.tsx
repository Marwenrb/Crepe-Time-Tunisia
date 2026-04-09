import { BRAND } from "@/config/brand";
import styles from "./PageLoader.module.css";

/**
 * PageLoader v4.0 — Aurora Dial
 *
 * Next-level premium loader matching Crêpe Time's Liquid Dark aesthetic.
 *
 * Composition:
 *   Scan beam → triple arcs (violet CW · gold CCW · white CW)
 *   → dual sonar rings → white logo medallion → shimmer brand text
 *
 * All animation is CSS-only (no Framer Motion) — optimal performance.
 * GPU-composited: transform + opacity exclusively.
 */
const PageLoader = () => (
  <div className={styles.root} role="status" aria-label="Chargement…">

    {/* ── Arc system + logo ── */}
    <div className={styles.arcContainer}>

      {/* Radar sweep beam (behind all arcs) */}
      <div className={styles.scanBeam} aria-hidden="true" />

      {/* Triple concentric arcs */}
      <div className={styles.arcOuter} aria-hidden="true" />
      <div className={styles.arcMid}   aria-hidden="true" />
      <div className={styles.arcInner} aria-hidden="true" />

      {/* Logo + dual sonar rings */}
      <div className={styles.logoCenter}>
        <div className={styles.logoWrap}>
          <span className={styles.sonarRing}  aria-hidden="true" />
          <span className={styles.sonarRing2} aria-hidden="true" />
          <div className={styles.logoMedallion}>
            <img
              src={BRAND.logo}
              alt={BRAND.name}
              width={40}
              height={40}
              style={{ objectFit: "contain", objectPosition: "center" }}
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </div>

    </div>

    {/* ── Brand strip ── */}
    <div className={styles.brand}>
      <span className={styles.brandName}>Cr&#234;pe Time</span>
      <span className={styles.subtitle}>Nabeul · Tunisia</span>
      <div className={styles.dots} aria-hidden="true">
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
    </div>

  </div>
);

export default PageLoader;
