import { memo } from "react";
import Marquee from "react-fast-marquee";

/* ── Brand phrases ─────────────────────────────────────────────────────────── */
const PHRASES = [
  "Crêpe Time Nabeul",
  "L'évasion la plus douce",
  "Artisan depuis 2021",
  "Saveurs d'exception",
] as const;

/* ── Luxury separator — animated golden star ───────────────────────────────── */
const Separator = () => (
  <span className="inline-flex items-center justify-center mx-5 sm:mx-7" aria-hidden>
    <span
      className="relative flex items-center justify-center w-[18px] h-[18px]"
      style={{ filter: "drop-shadow(0 0 6px rgba(212,175,55,0.5))" }}
    >
      {/* Outer rotating halo ring */}
      <span
        className="absolute inset-0 rounded-full"
        style={{
          border: "1px solid rgba(212,175,55,0.2)",
          animation: "sep-rotate 12s linear infinite",
        }}
      />
      {/* Core 4-point star */}
      <svg width="10" height="10" viewBox="0 0 10 10" className="relative z-10">
        <path
          d="M5 0 L6.2 3.8 L10 5 L6.2 6.2 L5 10 L3.8 6.2 L0 5 L3.8 3.8Z"
          fill="url(#sep-grad)"
        />
        <defs>
          <linearGradient id="sep-grad" x1="0" y1="0" x2="10" y2="10">
            <stop offset="0%" stopColor="#F7E08A" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#B8901F" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  </span>
);

/* ── Single phrase item ────────────────────────────────────────────────────── */
const Phrase = ({ text, primary }: { text: string; primary?: boolean }) => (
  <span
    className="inline-flex items-center font-heading font-semibold tracking-[0.22em] uppercase whitespace-nowrap select-none"
    style={
      primary
        ? {
            fontSize: "clamp(0.8rem, 1.5vw, 1.05rem)",
            background:
              "linear-gradient(95deg, #C9A227 0%, #E5C76B 25%, #FFF8E1 50%, #E5C76B 75%, #C9A227 100%)",
            backgroundSize: "300% 100%",
            animation: "mq-txt-shimmer 4s ease-in-out infinite",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter:
              "drop-shadow(0 0 10px rgba(212,175,55,0.35)) drop-shadow(0 1px 3px rgba(0,0,0,0.5))",
          }
        : {
            fontSize: "clamp(0.6rem, 1.1vw, 0.78rem)",
            color: "rgba(229,199,107,0.45)",
            letterSpacing: "0.32em",
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.35))",
          }
    }
  >
    {text}
  </span>
);

/* ── Main Marquee ──────────────────────────────────────────────────────────── */
const BrandMarquee = () => (
  <section
    className="relative overflow-hidden py-3 sm:py-3.5"
    aria-label="Brand tagline"
  >
    {/* Multi-stop purple gradient background */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(135deg, #1E0A3C 0%, #2E1065 25%, #4C1D95 50%, #3B0764 75%, #1E0A3C 100%)",
      }}
    />

    {/* Subtle inner glow — centred gold radial */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse 70% 100% at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 70%)",
      }}
    />

    {/* Animated gold light streak — sweeps left to right (GPU: translateX) */}
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      <div
        className="absolute inset-y-0"
        style={{
          width: "30%",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.07) 30%, rgba(255,248,225,0.10) 50%, rgba(212,175,55,0.07) 70%, transparent 100%)",
          animation: "mq-sweep 7s ease-in-out infinite",
        }}
      />
    </div>

    {/* Top ornamental border — triple hairline */}
    <div className="absolute top-0 inset-x-0 z-10">
      <div
        className="h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.08) 15%, rgba(212,175,55,0.45) 50%, rgba(212,175,55,0.08) 85%, transparent 95%)",
        }}
      />
      <div
        className="h-px mt-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 12%, rgba(212,175,55,0.04) 25%, rgba(212,175,55,0.18) 50%, rgba(212,175,55,0.04) 75%, transparent 88%)",
        }}
      />
      <div
        className="h-px mt-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 20%, rgba(212,175,55,0.02) 35%, rgba(212,175,55,0.08) 50%, rgba(212,175,55,0.02) 65%, transparent 80%)",
        }}
      />
    </div>

    {/* Scrolling content */}
    <Marquee speed={28} gradient={false} pauseOnHover className="relative z-10">
      {Array.from({ length: 4 }).map((_, i) =>
        PHRASES.map((phrase, j) => (
          <span key={`${i}-${j}`} className="inline-flex items-center">
            <Phrase text={phrase} primary={j === 0} />
            <Separator />
          </span>
        )),
      )}
    </Marquee>

    {/* Bottom ornamental border — mirror of top */}
    <div className="absolute bottom-0 inset-x-0 z-10">
      <div
        className="h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 20%, rgba(212,175,55,0.02) 35%, rgba(212,175,55,0.08) 50%, rgba(212,175,55,0.02) 65%, transparent 80%)",
        }}
      />
      <div
        className="h-px mt-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 12%, rgba(212,175,55,0.04) 25%, rgba(212,175,55,0.18) 50%, rgba(212,175,55,0.04) 75%, transparent 88%)",
        }}
      />
      <div
        className="h-px mt-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.08) 15%, rgba(212,175,55,0.45) 50%, rgba(212,175,55,0.08) 85%, transparent 95%)",
        }}
      />
    </div>

    {/* Edge fade masks — blend into surrounding content */}
    <div
      className="absolute inset-y-0 left-0 w-20 sm:w-32 z-20 pointer-events-none"
      style={{ background: "linear-gradient(to right, #1E0A3C, transparent)" }}
    />
    <div
      className="absolute inset-y-0 right-0 w-20 sm:w-32 z-20 pointer-events-none"
      style={{ background: "linear-gradient(to left, #1E0A3C, transparent)" }}
    />

    {/* Keyframes — GPU-composited where possible */}
    <style>{`
      @keyframes mq-txt-shimmer {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      @keyframes mq-sweep {
        0%, 100% { transform: translateX(-120%); }
        50% { transform: translateX(420%); }
      }
      @keyframes sep-rotate {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </section>
);

export default memo(BrandMarquee);
