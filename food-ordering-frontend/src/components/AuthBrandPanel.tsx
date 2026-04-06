/**
 * AuthBrandPanel — immersive brand identity block.
 * Used by RegisterPage and SignInPage above the form.
 *
 * Features:
 *   • 5-ring medallion: outermost slowly spins (dashed), inner rings static
 *   • Shine sweep animation on logo circle at mount
 *   • SVG corner ornaments on the glassmorphism card
 *   • Staggered stats pills with icon + value hierarchy
 *   • Lazy BrandMarquee teaser at bottom
 *   • All animations opacity + transform only (GPU-composited)
 *   • Respects prefers-reduced-motion
 */
import { useReducedMotion, motion } from "framer-motion";
import { lazy, Suspense } from "react";
import { BRAND } from "@/config/brand";

const BrandMarquee = lazy(() => import("@/components/home/BrandMarquee"));

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════ */

const EASE = [0.22, 1, 0.36, 1] as const;

/* ═══════════════════════════════════════════════════════════════
   CORNER ORNAMENT — L-shaped gold bracket SVG
═══════════════════════════════════════════════════════════════ */

function CornerOrnament({
  top, right, bottom, left, rotate,
}: {
  top?: number | string; right?: number | string;
  bottom?: number | string; left?: number | string;
  rotate?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="rgba(212,175,55,0.45)"
      strokeWidth="1.5"
      strokeLinecap="round"
      style={{
        position: "absolute",
        top, right, bottom, left,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        pointerEvents: "none",
      }}
    >
      <path d="M1 7V1h6" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INLINE KEYFRAMES
═══════════════════════════════════════════════════════════════ */

const KEYFRAMES = `
  @keyframes ab-spin-ring {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes ab-spin-ring-reverse {
    from { transform: rotate(360deg); }
    to   { transform: rotate(0deg); }
  }
  @keyframes ab-halo {
    0%, 100% { opacity: 0.65; transform: scale(1); }
    50%      { opacity: 1;    transform: scale(1.06); }
  }
  @keyframes ab-float {
    0%, 100% { transform: translateY(0px); }
    50%      { transform: translateY(-6px); }
  }
  @keyframes ab-shine {
    from { transform: translateX(-155%) rotate(15deg); opacity: 0; }
    20%  { opacity: 1; }
    80%  { opacity: 1; }
    to   { transform: translateX(155%) rotate(15deg); opacity: 0; }
  }
  /* ── Rotating conic gradient border ── */
  @keyframes ab-rotate-border {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* Outer glow ring breathing */
  @keyframes ab-glow-breathe {
    0%, 100% { filter: drop-shadow(0 0 12px rgba(212,175,55,0.12)) drop-shadow(0 0 30px rgba(212,175,55,0.06)); }
    50%      { filter: drop-shadow(0 0 18px rgba(212,175,55,0.18)) drop-shadow(0 0 40px rgba(212,175,55,0.1)); }
  }
  .ab-outer-glow {
    animation: ab-glow-breathe 4s ease-in-out infinite;
  }
`;

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════ */

const AuthBrandPanel = () => {
  const reduced = useReducedMotion() ?? false;

  return (
    <>
      <style>{KEYFRAMES}</style>

      <div
        role="complementary"
        aria-label="Crêpe Time — identité de marque"
        className="flex flex-col items-center pb-4"
      >
        {/* ── Glassmorphism card ──────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            background: "rgba(26,18,51,0.78)",
            border: "1px solid rgba(212,175,55,0.18)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderRadius: 22,
            padding: "clamp(14px,2.5vw,20px) clamp(18px,3vw,28px) clamp(10px,2vw,16px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* SVG corner ornaments */}
          <CornerOrnament top={8} left={8} />
          <CornerOrnament top={8} right={8}  rotate={90} />
          <CornerOrnament bottom={8} right={8} rotate={180} />
          <CornerOrnament bottom={8} left={8}  rotate={270} />

          {/* ── Logo medallion ────────────────────────────────────── */}
          <div className="relative" style={{ width: 150, height: 150 }}>

            {/* Ring 6 — rotating conic gradient border */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "-50%",
                  background:
                    "conic-gradient(from 0deg, #D4AF37, transparent 20%, #7C3AED 35%, transparent 50%, #EDD060 65%, transparent 80%, #D4AF37)",
                  animation: reduced ? "none" : "ab-rotate-border 5s linear infinite",
                  willChange: "transform",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 2,
                  borderRadius: "50%",
                  background: "#0F0A1F",
                }}
              />
            </div>

            {/* Ring 5 — dashed, spinning with neon glow */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 5,
                borderRadius: "50%",
                border: "1.5px dashed rgba(212,175,55,0.2)",
                boxShadow: "inset 0 0 8px 1px rgba(212,175,55,0.05)",
                animation: reduced ? "none" : "ab-spin-ring 28s linear infinite",
                pointerEvents: "none",
              }}
            />

            {/* Ring 4 — counter-rotating dotted */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 12,
                borderRadius: "50%",
                border: "1px dotted rgba(212,175,55,0.12)",
                animation: reduced ? "none" : "ab-spin-ring-reverse 35s linear infinite",
                pointerEvents: "none",
              }}
            />

            {/* Ring 3 — solid thin with dual neon glow */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 17,
                borderRadius: "50%",
                border: "1px solid rgba(212,175,55,0.22)",
                boxShadow:
                  "0 0 6px 1px rgba(212,175,55,0.08), inset 0 0 6px 1px rgba(212,175,55,0.06)",
                pointerEvents: "none",
              }}
            />

            {/* Ring 2 — halo pulse */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 20,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle,rgba(212,175,55,0.15) 0%,transparent 70%)",
                animation: reduced ? "none" : "ab-halo 3.5s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />

            {/* Ring 1 — logo circle with enhanced multi-glow */}
            <div
              style={{
                position: "absolute",
                inset: 27,
                borderRadius: "50%",
                background: "linear-gradient(155deg,#1C1040 0%,#0F0A1F 100%)",
                boxShadow: [
                  "0 0 0 1.5px rgba(212,175,55,0.55)",
                  "0 0 12px 2px rgba(212,175,55,0.15)",
                  "0 8px 32px rgba(76,29,149,0.5)",
                  "0 0 24px 4px rgba(212,175,55,0.08)",
                  "inset 0 1px 0 rgba(212,175,55,0.12)",
                  "inset 0 0 8px 2px rgba(76,29,149,0.2)",
                ].join(", "),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {/* Shine sweep — runs once on mount */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.22) 50%,transparent 70%)",
                  animation: reduced ? "none" : "ab-shine 1.4s ease forwards",
                  pointerEvents: "none",
                }}
              />
              <img
                src={BRAND.logo}
                alt="Crêpe Time — Logo"
                loading="eager"
                width={48}
                height={48}
                className="object-contain relative z-10"
                style={{
                  animation: reduced ? "none" : "ab-float 4s ease-in-out infinite",
                  filter: "drop-shadow(0 0 8px rgba(212,175,55,0.3))",
                }}
              />
            </div>
          </div>

          {/* Brand name */}
          <p
            aria-hidden="true"
            className="font-heading text-xl font-light uppercase"
            style={{ color: "#D4AF37", letterSpacing: "0.2em" }}
          >
            Crêpe Time
          </p>

          {/* Tagline */}
          <p
            className="font-heading italic text-sm"
            style={{
              background: "linear-gradient(135deg,#C9A227 0%,#E5C76B 50%,#D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "0.04em",
            }}
          >
            {BRAND.tagline}
          </p>

          {/* Separator */}
          <div
            aria-hidden="true"
            style={{
              height: 1,
              width: 36,
              background:
                "linear-gradient(to right,transparent,rgba(212,175,55,0.5),transparent)",
            }}
          />
        </div>

        {/* ── Brand marquee teaser ——————————————————————————————— */}
        <div
          aria-hidden="true"
          className="w-full mt-2 overflow-hidden"
          style={{ maxWidth: 320 }}
        >
          <Suspense fallback={null}>
            <BrandMarquee />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default AuthBrandPanel;
