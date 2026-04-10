import { useState } from "react";
import { BRAND } from "@/config/brand";
import styles from "./PageLoader.module.css";

/* ── Staggered letters: "Crêpe Time" ─────────────────────────── */
const LETTERS = ["C","r","ê","p","e"," ","T","i","m","e"] as const;

const PageLoader = () => {
  const [src, setSrc]           = useState<string>(BRAND.logo);
  const [fallback, setFallback] = useState(false);

  return (
    <div
      className={styles.root}
      role="status"
      aria-live="polite"
      aria-label={`Chargement de ${BRAND.name}`}
    >
      <div className={styles.scene}>

        {/* ── Gold ring + logo ───────────────────────────────── */}
        <div className={styles.ringWrap} aria-hidden="true">
          {/* SVG ring draw */}
          <svg
            className={styles.ringSvg}
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="pgRingGrad" x1="160" y1="0" x2="0" y2="160" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="#E5C76B" />
                <stop offset="50%"  stopColor="#D4AF37" />
                <stop offset="100%" stopColor="rgba(212,175,55,0.3)" />
              </linearGradient>
            </defs>
            {/* track */}
            <circle cx="80" cy="80" r="70" className={styles.ringTrack} strokeWidth="1" />
            {/* animated draw stroke */}
            <circle
              cx="80" cy="80" r="70"
              className={styles.ringStroke}
              stroke="url(#pgRingGrad)"
              strokeWidth="1.5"
            />
            {/* 12-o'clock accent dot */}
            <circle cx="80" cy="10" r="3.5" className={styles.ringDot} fill="rgba(229,199,107,0.75)" />
          </svg>

          {/* logo inside ring */}
          <div className={styles.logoCircle}>
            {!fallback ? (
              <img
                src={src}
                alt={BRAND.name}
                width={128}
                height={128}
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
        </div>

        {/* ── Staggered brand letters ─────────────────────────── */}
        <div className={styles.letters} aria-label={BRAND.name}>
          {LETTERS.map((ch, i) => (
            <span
              key={i}
              className={`${styles.letter}${ch === " " ? ` ${styles.letterSp}` : ""}`}
              style={{ "--i": i } as React.CSSProperties}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </div>

        {/* ── Tagline ─────────────────────────────────────────── */}
        <p className={styles.tagline}>{BRAND.tagline}</p>
      </div>

      {/* bottom edge gold accent */}
      <span className={styles.edge} aria-hidden="true" />
    </div>
  );
};

export default PageLoader;
