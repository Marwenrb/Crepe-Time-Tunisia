import { useState } from "react";
import { BRAND } from "@/config/brand";
import styles from "./PageLoader.module.css";

const PageLoader = () => {
  const [src, setSrc] = useState<string>(BRAND.logo);
  const [fallback, setFallback] = useState(false);

  return (
    <div
      className={styles.root}
      role="status"
      aria-live="polite"
      aria-label={`Chargement de ${BRAND.name}`}
    >
      {/* scene */}
      <div className={styles.scene}>
        {/* logo halo */}
        <div className={styles.logoWrap} aria-hidden="true">
          {!fallback ? (
            <img
              src={src}
              alt={BRAND.name}
              width={78}
              height={78}
              className={styles.logoImg}
              loading="eager"
              decoding="async"
              onError={() => {
                if (src !== "/logo.png") { setSrc("/logo.png"); return; }
                setFallback(true);
              }}
            />
          ) : (
            <span className={styles.logoFb}>CT</span>
          )}
        </div>

        {/* gold divider */}
        <div className={styles.line} aria-hidden="true" />

        {/* brand name */}
        <p className={styles.brand}>Crêpe Time</p>

        {/* tagline */}
        <p className={styles.tagline}>The Sweetest Escape</p>
      </div>

      {/* bottom edge gold accent */}
      <span className={styles.edge} aria-hidden="true" />
    </div>
  );
};

export default PageLoader;
