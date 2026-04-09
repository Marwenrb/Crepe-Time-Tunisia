import { memo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BRAND } from "@/config/brand";

type Variant = "signin" | "register";

interface LeftPanelProps {
  variant: Variant;
}

/* ── Ambient orb configuration ────────────────────────────────── */
const ORBS = [
  { w: 480, h: 480, x: "75%", y: "8%",  color: "rgba(91,33,182,0.18)",  dur: 22, delay: 0 },
  { w: 360, h: 360, x: "15%", y: "55%", color: "rgba(124,58,237,0.14)", dur: 28, delay: 5 },
  { w: 280, h: 280, x: "55%", y: "80%", color: "rgba(76,29,149,0.12)",  dur: 19, delay: 9 },
] as const;

/* ── Golden compass-rose illustration — memo: pure, never changes ─ */
const GoldenSwirl = memo(() => (
  <svg
    width="240"
    height="240"
    viewBox="0 0 260 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
  >
    <circle cx="130" cy="130" r="108" stroke="rgba(212,175,55,0.10)" strokeWidth="0.5" />
    <circle cx="130" cy="130" r="80"  stroke="rgba(212,175,55,0.07)" strokeWidth="0.4" />
    <circle cx="130" cy="130" r="55"  stroke="rgba(212,175,55,0.13)" strokeWidth="0.5" strokeDasharray="3 8" />
    <line x1="130" y1="130" x2="238" y2="130" stroke="rgba(212,175,55,0.05)" strokeWidth="0.5" />
    <line x1="130" y1="130" x2="206" y2="206" stroke="rgba(212,175,55,0.05)" strokeWidth="0.5" />
    <line x1="130" y1="130" x2="130" y2="238" stroke="rgba(212,175,55,0.05)" strokeWidth="0.5" />
    <line x1="130" y1="130" x2="54"  y2="206" stroke="rgba(212,175,55,0.05)" strokeWidth="0.5" />
    <line x1="130" y1="130" x2="22"  y2="130" stroke="rgba(212,175,55,0.05)" strokeWidth="0.5" />
    <line x1="130" y1="130" x2="54"  y2="54"  stroke="rgba(212,175,55,0.05)" strokeWidth="0.5" />
    <line x1="130" y1="130" x2="130" y2="22"  stroke="rgba(212,175,55,0.05)" strokeWidth="0.5" />
    <line x1="130" y1="130" x2="206" y2="54"  stroke="rgba(212,175,55,0.05)" strokeWidth="0.5" />
    <path d="M 130 22 A 108 108 0 0 1 238 130" stroke="url(#arcGold1)" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M 238 130 A 108 108 0 0 1 130 238" stroke="rgba(212,175,55,0.32)" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M 130 238 A 108 108 0 0 1 22 130"  stroke="rgba(212,175,55,0.16)" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M 22 130 A 108 108 0 0 1 130 22"   stroke="rgba(212,175,55,0.07)" strokeWidth="0.4" strokeLinecap="round" />
    <path d="M 130 50 A 80 80 0 0 1 210 130"  stroke="rgba(212,175,55,0.22)" strokeWidth="1"   strokeLinecap="round" />
    <path d="M 210 130 A 80 80 0 0 1 130 210" stroke="rgba(212,175,55,0.12)" strokeWidth="0.6" strokeLinecap="round" />
    <circle cx="238" cy="130" r="3.5" fill="rgba(212,175,55,0.60)" />
    <circle cx="130" cy="22"  r="3.5" fill="rgba(212,175,55,0.60)" />
    <circle cx="22"  cy="130" r="2.5" fill="rgba(212,175,55,0.22)" />
    <circle cx="130" cy="238" r="2.5" fill="rgba(212,175,55,0.22)" />
    <circle cx="206" cy="54"  r="2"   fill="rgba(212,175,55,0.38)" />
    <circle cx="206" cy="206" r="2"   fill="rgba(212,175,55,0.14)" />
    <circle cx="54"  cy="54"  r="2"   fill="rgba(212,175,55,0.14)" />
    <circle cx="54"  cy="206" r="2"   fill="rgba(212,175,55,0.10)" />
    <circle cx="130" cy="130" r="22" stroke="rgba(212,175,55,0.48)" strokeWidth="1" />
    <circle cx="130" cy="130" r="13" stroke="rgba(212,175,55,0.22)" strokeWidth="0.5" strokeDasharray="2 5" />
    <path d="M 130 108 L 133 118 L 130 126 L 127 118 Z" fill="rgba(212,175,55,0.42)" />
    <path d="M 130 134 L 133 142 L 130 152 L 127 142 Z" fill="rgba(212,175,55,0.42)" />
    <path d="M 108 130 L 118 133 L 126 130 L 118 127 Z" fill="rgba(212,175,55,0.42)" />
    <path d="M 134 130 L 142 133 L 152 130 L 142 127 Z" fill="rgba(212,175,55,0.42)" />
    <circle cx="130" cy="130" r="6" fill="rgba(212,175,55,0.18)" />
    <circle cx="130" cy="130" r="3" fill="rgba(229,199,107,0.85)" />
    <defs>
      <linearGradient id="arcGold1" x1="130" y1="22" x2="238" y2="130" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stopColor="#E5C76B" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#D4AF37"  stopOpacity="0.3" />
      </linearGradient>
    </defs>
  </svg>
));
GoldenSwirl.displayName = "GoldenSwirl";

/* ── LeftPanel ─────────────────────────────────────────────────────────
   Desktop only (hidden md:flex). Full-height atmospheric brand panel.
   Composition: small logo watermark top-left ▸ GoldenSwirl centered
   ▸ brand identity (logo + name + tagline) below swirl ▸ inscription bottom.
   AuthFooter is hidden on desktop (md:hidden in AuthLayout), so brand
   name appears ONCE here — no duplication.
   ──────────────────────────────────────────────────────────────────── */
const LeftPanel = ({ variant: _variant }: LeftPanelProps) => {
  const reduced = useReducedMotion() ?? false;
  const [imgSrc, setImgSrc] = useState<string>(BRAND.logo);

  return (
    <aside
      className="hidden md:flex flex-col"
      style={{
        width:      "42%",
        flexShrink: 0,
        position:   "relative",
        minHeight:  "100dvh",
        background: "#0F0A1F",
        overflow:   "hidden",
        contain:    "layout style paint",
      }}
      aria-hidden="true"
    >
      {/* Vertical gold separator — right edge */}
      <div
        aria-hidden="true"
        style={{
          position:      "absolute",
          right:         0,
          top:           "6%",
          bottom:        "6%",
          width:         1,
          background:    "linear-gradient(to bottom, transparent 0%, rgba(212,175,55,0.28) 25%, rgba(212,175,55,0.48) 50%, rgba(212,175,55,0.28) 75%, transparent 100%)",
          zIndex:        10,
          pointerEvents: "none",
        }}
      />

      {/* Ambient floating orbs */}
      {!reduced && ORBS.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            position:      "absolute",
            width:         orb.w,
            height:        orb.h,
            left:          orb.x,
            top:           orb.y,
            transform:     "translate(-50%, -50%)",
            background:    `radial-gradient(circle, ${orb.color} 0%, transparent 68%)`,
            borderRadius:  "50%",
            willChange:    "transform, opacity",
            pointerEvents: "none",
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: "easeInOut", delay: orb.delay }}
        />
      ))}

      {/* Subtle gold dot grid */}
      <div
        aria-hidden="true"
        style={{
          position:        "absolute",
          inset:           0,
          backgroundImage: "radial-gradient(rgba(212,175,55,0.28) 1px, transparent 1px)",
          backgroundSize:  "26px 26px",
          opacity:         0.06,
          pointerEvents:   "none",
          zIndex:          1,
        }}
      />

      {/* ── Content ─────────────────────────────────────────── */}
      <div
        style={{
          position:      "relative",
          zIndex:        2,
          display:       "flex",
          flexDirection: "column",
          height:        "100%",
          minHeight:     "100dvh",
          padding:       "48px 52px",
          alignItems:    "center",
        }}
      >
        {/* Small logo watermark — top-left, no text */}
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ alignSelf: "flex-start" }}
        >
          <img
            src={imgSrc}
            alt=""
            aria-hidden="true"
            width={36}
            height={36}
            onError={() => setImgSrc("/logo.png")}
            style={{
              width:        36,
              height:       36,
              borderRadius: 9,
              objectFit:    "cover",
              opacity:      0.65,
              filter:       "drop-shadow(0 2px 8px rgba(212,175,55,0.28))",
            }}
          />
        </motion.div>

        {/* Center: GoldenSwirl hero + brand identity below */}
        <div
          style={{
            flex:           1,
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            justifyContent: "center",
          }}
        >
          {/* Floating swirl */}
          <motion.div
            animate={reduced ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: "transform", position: "relative" }}
          >
            <div
              aria-hidden="true"
              style={{
                position:     "absolute",
                inset:        "-25%",
                background:   "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 65%)",
                borderRadius: "50%",
                pointerEvents:"none",
              }}
            />
            <GoldenSwirl />
          </motion.div>

          {/* Brand identity: logo + name + tagline (centered, below swirl) */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.35, ease: "easeOut" }}
            style={{ textAlign: "center", marginTop: 28 }}
          >
            <img
              src={imgSrc}
              alt={BRAND.name}
              width={52}
              height={52}
              loading="eager"
              decoding="async"
              onError={() => setImgSrc("/logo.png")}
              style={{
                width:        52,
                height:       52,
                borderRadius: 13,
                objectFit:    "cover",
                display:      "block",
                margin:       "0 auto 14px",
                filter:       "drop-shadow(0 6px 22px rgba(212,175,55,0.52))",
              }}
            />

            <h1
              style={{
                fontFamily:    "var(--font-luxury, 'Cormorant Garamond', Georgia, serif)",
                fontSize:      34,
                fontWeight:    300,
                letterSpacing: "0.10em",
                color:         "#E5C76B",
                lineHeight:    1.1,
                margin:        0,
                textAlign:     "center",
              }}
            >
              {BRAND.name}
            </h1>

            <p
              style={{
                fontFamily:    "var(--font-ui, 'Jost', sans-serif)",
                fontSize:      11,
                fontStyle:     "italic",
                letterSpacing: "0.18em",
                color:         "rgba(212,175,55,0.60)",
                marginTop:     8,
                lineHeight:    1,
                textAlign:     "center",
              }}
            >
              {BRAND.tagline}
            </p>
          </motion.div>
        </div>

        {/* Bottom inscription */}
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <p
            style={{
              fontFamily:    "var(--font-ui, 'Jost', sans-serif)",
              fontSize:      9,
              letterSpacing: "0.30em",
              textTransform: "uppercase",
              color:         "rgba(212,175,55,0.38)",
              lineHeight:    1,
              textAlign:     "center",
            }}
          >
            L&rsquo;art de la crêpe à Nabeul
          </p>
        </motion.div>
      </div>
    </aside>
  );
};

export default LeftPanel;
