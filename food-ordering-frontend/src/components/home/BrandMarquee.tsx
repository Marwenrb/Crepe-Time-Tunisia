import { memo } from "react";
import Marquee from "react-fast-marquee";

const MARQUEE_TEXT = "Crêpe Time Nabeul — L'évasion la plus douce";

const BrandMarquee = () => {
  return (
    <section
      className="relative overflow-hidden py-2 sm:py-2.5"
      aria-label="Brand tagline marquee"
    >
      {/* Layered gradient background */}
      <div
        className="absolute inset-0"
        style={{ background: "#4C1D95" }}
      />
      {/* Top edge highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-10"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent)",
        }}
      />
      <Marquee
        speed={35}
        gradient={false}
        pauseOnHover
        className="relative z-10"
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="mx-5 sm:mx-6 font-heading text-sm sm:text-base md:text-lg font-medium tracking-[0.2em] sm:tracking-[0.25em] uppercase whitespace-nowrap"
            style={{
              background: "linear-gradient(90deg, #E5C76B 0%, #D4AF37 50%, #C9A227 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 12px rgba(212, 175, 55, 0.4)) drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
            }}
          >
            {MARQUEE_TEXT} ✦
          </span>
        ))}
      </Marquee>
      {/* Bottom edge glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px z-10"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.25), transparent)",
        }}
      />
    </section>
  );
};

export default memo(BrandMarquee);
