import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BRAND } from "@/config/brand";

/* ── Ambient orbs for mobile strip ───────────────────────────── */
const MOBILE_ORBS = [
  { w: 200, h: 200, x: "15%",  y: "50%", color: "rgba(91,33,182,0.30)",  dur: 18, delay: 0 },
  { w: 160, h: 160, x: "82%", y: "45%",  color: "rgba(124,58,237,0.22)", dur: 22, delay: 4 },
] as const;

/**
 * MobileHero v5.0 — Compact atmospheric strip (mobile only).
 *
 * 120px tall, crepe-dark background, 2 drifting orbs, centered
 * logo + brand name. No typewriter — the form panel owns the page title.
 * Hidden on md+ (LeftPanel takes over on desktop).
 */
const MobileHero = () => {
  const reduced = useReducedMotion() ?? false;
  const [imgSrc, setImgSrc] = useState<string>(BRAND.logo);

  return (
    <div
      className="md:hidden"
      style={{
        position:       "relative",
        height:         120,
        background:     "#0F0A1F",
        overflow:       "hidden",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        flexShrink:     0,
        contain:        "layout style paint",
      }}
      aria-hidden="true"
    >
      {/* Ambient orbs */}
      {!reduced &&
        MOBILE_ORBS.map((orb, i) => (
          <motion.div
            key={i}
            style={{
              position:      "absolute",
              width:         orb.w,
              height:        orb.h,
              left:          orb.x,
              top:           orb.y,
              transform:     "translate(-50%, -50%)",
              background:    `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              borderRadius:  "50%",
              willChange:    "transform, opacity",
              pointerEvents: "none",
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.55, 1, 0.55] }}
            transition={{
              duration: orb.dur,
              repeat:   Infinity,
              ease:     "easeInOut",
              delay:    orb.delay,
            }}
          />
        ))}

      {/* Gold micro-dot grid */}
      <div
        aria-hidden="true"
        style={{
          position:        "absolute",
          inset:           0,
          backgroundImage: "radial-gradient(rgba(212,175,55,0.30) 1px, transparent 1px)",
          backgroundSize:  "22px 22px",
          opacity:         0.05,
          pointerEvents:   "none",
        }}
      />

      {/* Logo + brand name + tagline — centered */}
      <div
        style={{
          position:       "relative",
          zIndex:         2,
          display:        "flex",
          alignItems:     "center",
          gap:            12,
        }}
      >
        <img
          src={imgSrc}
          alt={BRAND.name}
          width={44}
          height={44}
          loading="eager"
          decoding="async"
          onError={() => setImgSrc("/logo.png")}
          style={{
            width:        44,
            height:       44,
            borderRadius: 11,
            objectFit:    "cover",
            flexShrink:   0,
            filter:       "drop-shadow(0 4px 14px rgba(212,175,55,0.45))",
          }}
        />

        <div>
          <div
            style={{
              fontFamily:    "var(--font-luxury, 'Cormorant Garamond', Georgia, serif)",
              fontSize:      22,
              fontWeight:    400,
              letterSpacing: "0.07em",
              color:         "#E5C76B",
              lineHeight:    1.1,
            }}
          >
            {BRAND.name}
          </div>
          <div
            style={{
              fontFamily:    "var(--font-ui, 'Jost', sans-serif)",
              fontSize:      10,
              fontStyle:     "italic",
              letterSpacing: "0.16em",
              color:         "rgba(212,175,55,0.55)",
              marginTop:     3,
              lineHeight:    1,
            }}
          >
            {BRAND.tagline}
          </div>
        </div>
      </div>

      {/* Bottom separator */}
      <div
        aria-hidden="true"
        style={{
          position:   "absolute",
          bottom:     0,
          left:       "15%",
          right:      "15%",
          height:     1,
          background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.35) 25%, rgba(212,175,55,0.55) 50%, rgba(212,175,55,0.35) 75%, transparent 100%)",
        }}
      />
    </div>
  );
};

export default MobileHero;
