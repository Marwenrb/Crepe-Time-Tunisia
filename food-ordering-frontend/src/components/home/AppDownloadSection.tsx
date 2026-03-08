/**
 * AppDownloadSection — Minimal premium strip.
 *
 * Layout : left = headline copy  |  right = official store badges
 * Mobile : stacked, badges centered
 *
 * Store URLs: update APP_LINKS below when live.
 * Badge files: /public/badges/app-store.svg  /public/badges/google-play.svg
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ─── Replace with real URLs when available ───────────────
const APP_LINKS = {
  appStore: "#",
  googlePlay: "#",
} as const;
// ─────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;

const BadgeLink = ({
  href,
  ariaLabel,
  src,
  alt,
  delay,
}: {
  href: string;
  ariaLabel: string;
  src: string;
  alt: string;
  delay: number;
}) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={ariaLabel}
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-20px" }}
    transition={{ duration: 0.45, delay, ease: EASE }}
    whileHover={{ y: -2, scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crepe-gold"
    style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLAnchorElement).style.filter =
        "drop-shadow(0 4px 14px rgba(212,175,55,0.3)) drop-shadow(0 2px 5px rgba(0,0,0,0.4))";
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLAnchorElement).style.filter =
        "drop-shadow(0 2px 8px rgba(0,0,0,0.5))";
    }}
  >
    <img
      src={src}
      alt={alt}
      width={120}
      height={36}
      className="block h-9 w-auto"
      draggable={false}
    />
  </motion.a>
);

const AppDownloadSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden rounded-xl my-3 sm:my-4"
      style={{
        background:
          "linear-gradient(135deg, #3B1275 0%, #4C1D95 50%, #3B1275 100%)",
        borderTop: "1px solid rgba(212,175,55,0.2)",
        borderBottom: "1px solid rgba(212,175,55,0.07)",
      }}
    >
      {/* Minimal glow — left edge only */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 45% 100% at 8% 50%, rgba(109,40,217,0.18) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10 container mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-3.5">

        {/* Left — minimal copy */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">

          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.38, ease: EASE }}
            className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1"
            style={{ color: "rgba(212,175,55,0.68)" }}
          >
            Disponible bientôt
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.44, delay: 0.06, ease: EASE }}
            className="font-heading font-black text-white leading-tight tracking-tight mb-1 text-base sm:text-lg"
          >
            Téléchargez{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #D4AF37 0%, #E5C76B 55%, #D4AF37 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              l'App
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.12, ease: EASE }}
            className="text-[11px] sm:text-xs leading-snug max-w-[240px]"
            style={{ color: "rgba(255,255,255,0.42)" }}
          >
            Commandez vos crêpes artisanales directement depuis votre poche.
          </motion.p>
        </div>

        {/* Right — official store badges */}
        <div className="flex flex-row items-center gap-2 sm:gap-2.5 shrink-0">
          <BadgeLink
            href={APP_LINKS.appStore}
            ariaLabel="Télécharger sur l'App Store"
            src="/badges/app-store.svg"
            alt="Download on the App Store"
            delay={0.16}
          />
          <BadgeLink
            href={APP_LINKS.googlePlay}
            ariaLabel="Disponible sur Google Play"
            src="/badges/google-play.svg"
            alt="Get it on Google Play"
            delay={0.23}
          />
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;
