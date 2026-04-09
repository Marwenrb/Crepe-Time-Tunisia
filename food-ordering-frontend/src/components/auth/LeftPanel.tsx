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
    {/* Outermost guide rings */}
    <circle cx="130" cy="130" r="108" stroke="rgba(212,175,55,0.10)" strokeWidth="0.5" />
    <circle cx="130" cy="130" r="80"  stroke="rgba(212,175,55,0.07)" strokeWidth="0.4" />
    <circle
      cx="130" cy="130" r="55"
      stroke="rgba(212,175,55,0.13)" strokeWidth="0.5"
      strokeDasharray="3 8"
    />

    {/* 8 radial guide lines (very subtle) */}
    <line x1="130" y1="130" x2="238" y2="130" stroke="rgba(212,175,55,0.05)" strokeWidth="0.5" />
    <line x1="130" y1="130" x2="206" y2="206" stroke="rgba(212,175,55,0.05)" strokeWidth="0.5" />
    <line x1="130" y1="130" x2="130" y2="238" stroke="rgba(212,175,55,0.05)" strokeWidth="0.5" />
    <line x1="130" y1="130" x2="54"  y2="206" stroke="rgba(212,175,55,0.05)" strokeWidth="0.5" />
    <line x1="130" y1="130" x2="22"  y2="130" stroke="rgba(212,175,55,0.05)" strokeWidth="0.5" />
    <line x1="130" y1="130" x2="54"  y2="54"  stroke="rgba(212,175,55,0.05)" strokeWidth="0.5" />
    <line x1="130" y1="130" x2="130" y2="22"  stroke="rgba(212,175,55,0.05)" strokeWidth="0.5" />
    <line x1="130" y1="130" x2="206" y2="54"  stroke="rgba(212,175,55,0.05)" strokeWidth="0.5" />

    {/* Main arcs — outer radius R=108 (layered opacity) */}
    <path
      d="M 130 22 A 108 108 0 0 1 238 130"
      stroke="url(#arcGold1)"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M 238 130 A 108 108 0 0 1 130 238"
      stroke="rgba(212,175,55,0.32)"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M 130 238 A 108 108 0 0 1 22 130"
      stroke="rgba(212,175,55,0.16)"
      strokeWidth="0.8"
      strokeLinecap="round"
    />
    <path
      d="M 22 130 A 108 108 0 0 1 130 22"
      stroke="rgba(212,175,55,0.07)"
      strokeWidth="0.4"
      strokeLinecap="round"
    />

    {/* Inner arcs — mid radius R=80 */}
    <path
      d="M 130 50 A 80 80 0 0 1 210 130"
      stroke="rgba(212,175,55,0.22)"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <path
      d="M 210 130 A 80 80 0 0 1 130 210"
      stroke="rgba(212,175,55,0.12)"
      strokeWidth="0.6"
      strokeLinecap="round"
    />

    {/* Cardinal accent dots on outer ring */}
    <circle cx="238" cy="130" r="3.5" fill="rgba(212,175,55,0.60)" />
    <circle cx="130" cy="22"  r="3.5" fill="rgba(212,175,55,0.60)" />
    <circle cx="22"  cy="130" r="2.5" fill="rgba(212,175,55,0.22)" />
    <circle cx="130" cy="238" r="2.5" fill="rgba(212,175,55,0.22)" />
    {/* Diagonal accent dots */}
    <circle cx="206" cy="54"  r="2" fill="rgba(212,175,55,0.38)" />
    <circle cx="206" cy="206" r="2" fill="rgba(212,175,55,0.14)" />
    <circle cx="54"  cy="54"  r="2" fill="rgba(212,175,55,0.14)" />
    <circle cx="54"  cy="206" r="2" fill="rgba(212,175,55,0.10)" />

    {/* Center ornament */}
    <circle cx="130" cy="130" r="22" stroke="rgba(212,175,55,0.48)" strokeWidth="1" />
    <circle
      cx="130" cy="130" r="13"
      stroke="rgba(212,175,55,0.22)" strokeWidth="0.5"
      strokeDasharray="2 5"
    />

    {/* Compass-rose cross arms (diamond petals) */}
    <path
      d="M 130 108 L 133 118 L 130 126 L 127 118 Z"
      fill="rgba(212,175,55,0.42)"
    />
    <path
      d="M 130 134 L 133 142 L 130 152 L 127 142 Z"
      fill="rgba(212,175,55,0.42)"
    />
    <path
      d="M 108 130 L 118 133 L 126 130 L 118 127 Z"
      fill="rgba(212,175,55,0.42)"
    />
    <path
      d="M 134 130 L 142 133 L 152 130 L 142 127 Z"
      fill="rgba(212,175,55,0.42)"
    />

    {/* Center nucleus */}
    <circle cx="130" cy="130" r="6" fill="rgba(212,175,55,0.18)" />
    <circle cx="130" cy="130" r="3" fill="rgba(229,199,107,0.85)" />

    {/* Gradient definitions */}
    <defs>
      <linearGradient
        id="arcGold1"
        x1="130" y1="22"
        x2="238" y2="130"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%"   stopColor="#E5C76B" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#D4AF37"  stopOpacity="0.3" />
      </linearGradient>
    </defs>
  </svg>
));
GoldenSwirl.displayName = "GoldenSwirl";

/* ── LeftPanel ────────────────────────────────────────────────── */
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
      {/* ── Vertical gold separator (right edge) ─────────────── */}
      <div
        style={{
          position:   "absolute",
          right:      0,
          top:        "6%",
          bottom:     "6%",
          width:      1,
          background: "linear-gradient(to bottom, transparent 0%, rgba(212,175,55,0.28) 25%, rgba(212,175,55,0.48) 50%, rgba(212,175,55,0.28) 75%, transparent 100%)",
          zIndex:     10,
          pointerEvents: "none",
        }}
      />

      {/* ── Ambient floating orbs ─────────────────────────────── */}
      {!reduced &&
        ORBS.map((orb, i) => (
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
            animate={{
              scale:   [1, 1.15, 1],
              opacity: [0.55, 1, 0.55],
            }}
            transition={{
              duration: orb.dur,
              repeat:   Infinity,
              ease:     "easeInOut",
              delay:    orb.delay,
            }}
          />
        ))}

      {/* ── Subtle dot grid overlay ───────────────────────────── */}
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

      {/* ── Content ───────────────────────────────────────────── */}
      <div
        style={{
          position:       "relative",
          zIndex:         2,
          display:        "flex",
          flexDirection:  "column",
          height:         "100%",
          minHeight:      "100dvh",
          padding:        "52px 52px 44px",
        }}
      >
        {/* Logo + brand identity — top section */}
        <motion.div
          initial={reduced ? false : { opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Logo — standalone, proud, no box */}
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
              borderRadius: 12,
              objectFit:    "cover",
              display:      "block",
              marginBottom: 18,
              filter:       "drop-shadow(0 6px 20px rgba(212,175,55,0.50))",
            }}
          />

          {/* Brand name — Cormorant Garamond, thin, gold-light */}
          <h1
            style={{
              fontFamily:    "var(--font-luxury, 'Cormorant Garamond', Georgia, serif)",
              fontSize:      40,
              fontWeight:    300,
              letterSpacing: "0.08em",
              color:         "#E5C76B",
              lineHeight:    1.1,
              margin:        0,
            }}
          >
            {BRAND.name}
          </h1>

          {/* Tagline — italic, gold, subtle small-caps feel */}
          <p
            style={{
              fontFamily:    "var(--font-ui, 'Jost', sans-serif)",
              fontSize:      12,
              fontStyle:     "italic",
              color:         "rgba(212,175,55,0.65)",
              letterSpacing: "0.14em",
              marginTop:     10,
              lineHeight:    1,
            }}
          >
            {BRAND.tagline}
          </p>
        </motion.div>

        {/* Golden compass rose — center of panel, floating */}
        <div
          style={{
            flex:            1,
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            paddingTop:      40,
            paddingBottom:   40,
          }}
        >
          <motion.div
            animate={reduced ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: "transform" }}
          >
            {/* Outer glow behind the swirl */}
            <div
              style={{
                position: "relative",
                display:  "inline-flex",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position:     "absolute",
                  inset:        "-20%",
                  background:   "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 65%)",
                  borderRadius: "50%",
                  pointerEvents:"none",
                }}
              />
              <GoldenSwirl />
            </div>
          </motion.div>
        </div>

        {/* Bottom inscription */}
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
        >
          <p
            style={{
              fontFamily:    "var(--font-ui, 'Jost', sans-serif)",
              fontSize:      10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color:         "rgba(212,175,55,0.42)",
              lineHeight:    1,
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
