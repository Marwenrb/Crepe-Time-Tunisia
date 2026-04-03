import { memo } from "react";
import Marquee from "react-fast-marquee";

const PHRASES = [
  "Crêpe Time Nabeul",
  "L'évasion la plus douce",
  "Artisan depuis 2021",
  "Saveurs d'exception",
] as const;

const Diamond = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    className="inline-block mx-1 opacity-70"
    style={{ filter: "drop-shadow(0 0 3px rgba(212,175,55,0.6))" }}
  >
    <path d="M5 0L10 5L5 10L0 5Z" fill="url(#dmnd)" />
    <defs>
      <linearGradient id="dmnd" x1="0" y1="0" x2="10" y2="10">
        <stop offset="0%" stopColor="#E5C76B" />
        <stop offset="100%" stopColor="#C9A227" />
      </linearGradient>
    </defs>
  </svg>
);

const MarqueeItem = ({ text, accent }: { text: string; accent?: boolean }) => (
  <span
    className="inline-flex items-center mx-4 sm:mx-6 font-heading text-sm sm:text-base md:text-lg font-semibold tracking-[0.2em] sm:tracking-[0.25em] uppercase whitespace-nowrap select-none"
    style={
      accent
        ? {
            background:
              "linear-gradient(90deg, #E5C76B 0%, #FFF8E1 40%, #D4AF37 70%, #C9A227 100%)",
            backgroundSize: "200% 100%",
            animation: "marquee-shimmer 3s ease-in-out infinite",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter:
              "drop-shadow(0 0 8px rgba(212,175,55,0.5)) drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
          }
        : {
            color: "rgba(229,199,107,0.55)",
            letterSpacing: "0.3em",
            fontSize: "0.7em",
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
          }
    }
  >
    {text}
  </span>
);

const BrandMarquee = () => {
  return (
    <section
      className="relative overflow-hidden py-2.5 sm:py-3"
      aria-label="Brand tagline marquee"
    >
      {/* Deep layered background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #2E1065 0%, #4C1D95 40%, #3B0764 70%, #2E1065 100%)",
        }}
      />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Animated gold light sweep */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, transparent 30%, rgba(212,175,55,0.06) 45%, rgba(212,175,55,0.12) 50%, rgba(212,175,55,0.06) 55%, transparent 70%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "marquee-light-sweep 6s ease-in-out infinite",
        }}
      />

      {/* Top ornamental border — double line with glow */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.15) 20%, rgba(212,175,55,0.5) 50%, rgba(212,175,55,0.15) 80%, transparent 95%)",
          }}
        />
        <div
          className="h-px mt-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 15%, rgba(212,175,55,0.08) 30%, rgba(212,175,55,0.2) 50%, rgba(212,175,55,0.08) 70%, transparent 85%)",
          }}
        />
      </div>

      {/* Marquee content */}
      <Marquee speed={30} gradient={false} pauseOnHover className="relative z-10">
        {Array.from({ length: 5 }).map((_, i) =>
          PHRASES.map((phrase, j) => (
            <span key={`${i}-${j}`} className="inline-flex items-center">
              <MarqueeItem text={phrase} accent={j === 0} />
              <Diamond />
            </span>
          ))
        )}
      </Marquee>

      {/* Bottom ornamental border — double line with glow */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 15%, rgba(212,175,55,0.08) 30%, rgba(212,175,55,0.2) 50%, rgba(212,175,55,0.08) 70%, transparent 85%)",
          }}
        />
        <div
          className="h-px mt-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.15) 20%, rgba(212,175,55,0.5) 50%, rgba(212,175,55,0.15) 80%, transparent 95%)",
          }}
        />
      </div>

      {/* Edge fade masks */}
      <div
        className="absolute inset-y-0 left-0 w-16 sm:w-24 z-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, #2E1065, transparent)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-16 sm:w-24 z-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(to left, #2E1065, transparent)",
        }}
      />

      {/* Inline keyframes */}
      <style>{`
        @keyframes marquee-shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes marquee-light-sweep {
          0%, 100% { background-position: -100% 0; }
          50% { background-position: 200% 0; }
        }
      `}</style>
    </section>
  );
};

export default memo(BrandMarquee);
