import { useState } from "react";
import { BRAND } from "@/config/brand";
import BrandSignature from "@/components/shared/BrandSignature";
import styles from "./PageLoader.module.css";

const FALLBACK_LOGO = "/logo.png";

const EXPERIENCE_CHIPS = [
  "Freshly folded",
  "Nabeul delivery",
  "Sweet ritual",
] as const;

const PageLoader = () => {
  const [src, setSrc] = useState<string>(BRAND.logo);
  const [showFallback, setShowFallback] = useState(false);

  return (
    <div
      className={styles.root}
      role="status"
      aria-live="polite"
      aria-label={`Chargement de ${BRAND.name}`}
    >
      <div className={styles.stage}>
        <span className={styles.badge}>Crafting the next bite</span>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.visualGlow} />
          <div className={`${styles.orbit} ${styles.orbitOuter}`}>
            <span className={`${styles.spark} ${styles.sparkOne}`} />
            <span className={`${styles.spark} ${styles.sparkTwo}`} />
          </div>
          <div className={`${styles.orbit} ${styles.orbitMid}`} />
          <div className={`${styles.orbit} ${styles.orbitInner}`}>
            <span className={`${styles.spark} ${styles.sparkThree}`} />
          </div>

          <div className={styles.logoDock}>
            <div className={styles.logoShell}>
              {!showFallback && (
                <img
                  src={src}
                  alt={BRAND.name}
                  width={96}
                  height={96}
                  className={styles.logoImage}
                  loading="eager"
                  decoding="async"
                  onError={() => {
                    if (src !== FALLBACK_LOGO) {
                      setSrc(FALLBACK_LOGO);
                      return;
                    }

                    setShowFallback(true);
                  }}
                />
              )}

              {showFallback && <span className={styles.logoFallback}>CT</span>}
            </div>
          </div>
        </div>

        <div className={styles.brandBlock}>
          <BrandSignature
            size="md"
            align="center"
            surface="glass"
            interactive={false}
          />
        </div>

        <p className={styles.statusText}>
          Preparation de votre experience gourmande, avec une arrivee qui doit deja donner faim.
        </p>

        <div className={styles.progressTrack} aria-hidden="true">
          <span className={styles.progressLine} />
        </div>

        <div className={styles.chips} aria-hidden="true">
          {EXPERIENCE_CHIPS.map((chip) => (
            <span key={chip} className={styles.chip}>
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
