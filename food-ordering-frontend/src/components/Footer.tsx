/**
 * Footer v3 — Celestial Forge Edition
 *
 * Truly next-level Crêpe Time footer — not generic:
 *  - Rich purple gradient bg matching brand palette (#3B0764 → #4C1D95 → #0F0A1F)
 *  - Dual radial gold nebula orbs (warm ambient glow spots)
 *  - Frosted glass brand pillar with rotating conic-gradient neon halo
 *  - Social links as neon-bordered glass orbs with orbital hover animation
 *  - Contact items with gold accent bar + constellation connector dots
 *  - Double prismatic neon trim (top + bottom)
 *  - Constellation star-field dots (pure CSS, no canvas)
 *  - Circuit-trace separator with dual flowing dots
 *  - Desktop: 3-column layout (Contact | Brand pillar | Social)
 *  - Mobile: Brand top → Contact + Social side-by-side → Legal
 *  - ALL animations GPU-composited (transform + opacity + filter only)
 */

import { Phone, MessageCircle, Instagram, Facebook, MapPin, Heart, Code2 } from "lucide-react";
import { BRAND } from "@/config/brand";

const CONTACT = {
  phone: "+216 25 799 066",
  whatsapp: "21625799066",
  instagram: "crepe.time_nabeul",
  instagramUrl: "https://www.instagram.com/crepe.time_nabeul?igsh=M3R2MXU4bzgwODZt",
  facebookUrl: "https://www.facebook.com/share/1CZt76ZdtW/?mibextid=wwXIfr",
  tiktok: "crepetime_nabeul",
  address: "Nabeul, Tunisia",
};

const TikTokIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

/* ── GPU-composited keyframes + interactions ── */
const FOOTER_STYLES = `
  /* ── Keyframes (all GPU: transform / opacity / filter) ── */
  @keyframes ft3-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes ft3-shimmer {
    0%   { transform: translateX(-200%) skewX(-18deg); opacity: 0; }
    12%  { opacity: 0.55; }
    88%  { opacity: 0.1; }
    100% { transform: translateX(300%) skewX(-18deg); opacity: 0; }
  }
  @keyframes ft3-dot-flow {
    0%   { transform: translateX(0); opacity: 0; }
    8%   { opacity: 1; }
    92%  { opacity: 0.4; }
    100% { transform: translateX(calc(100vw - 40px)); opacity: 0; }
  }
  @keyframes ft3-dot-flow-reverse {
    0%   { transform: translateX(calc(100vw - 40px)); opacity: 0; }
    8%   { opacity: 0.7; }
    92%  { opacity: 0.3; }
    100% { transform: translateX(0); opacity: 0; }
  }
  @keyframes ft3-glow-breathe {
    0%, 100% { filter: drop-shadow(0 0 8px rgba(212,175,55,0.25)); }
    50%      { filter: drop-shadow(0 0 18px rgba(212,175,55,0.6)); }
  }
  @keyframes ft3-nebula-drift {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.35; }
    33%      { transform: translate(8px, -6px) scale(1.05); opacity: 0.5; }
    66%      { transform: translate(-5px, 4px) scale(0.97); opacity: 0.3; }
  }
  @keyframes ft3-star-twinkle {
    0%, 100% { opacity: 0.15; }
    50%      { opacity: 0.6; }
  }
  @keyframes ft3-orb-pulse {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.06); }
  }

  /* ── Social orbs ── */
  .ft3-orb {
    transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
                border-color 220ms ease, background 220ms ease;
  }
  .ft3-orb:hover {
    transform: translateY(-3px) scale(1.05);
    border-color: rgba(212,175,55,0.5) !important;
    background: rgba(212,175,55,0.1) !important;
  }
  .ft3-orb:active { transform: scale(0.95); }
  .ft3-orb .ft3-orb-icon {
    transition: filter 220ms ease, color 220ms ease, transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .ft3-orb:hover .ft3-orb-icon {
    color: #E5C76B !important;
    filter: drop-shadow(0 0 10px rgba(212,175,55,0.7));
    transform: scale(1.12);
  }
  .ft3-orb .ft3-orb-ring {
    transition: opacity 280ms ease;
    opacity: 0;
  }
  .ft3-orb:hover .ft3-orb-ring {
    opacity: 1;
  }
  .ft3-orb .ft3-orb-label {
    transition: color 220ms ease, text-shadow 220ms ease;
  }
  .ft3-orb:hover .ft3-orb-label {
    color: #E5C76B !important;
    text-shadow: 0 0 12px rgba(212,175,55,0.35);
  }

  /* ── Contact tiles ── */
  .ft3-tile {
    transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
               border-color 220ms ease, background 220ms ease,
               box-shadow 280ms ease;
  }
  .ft3-tile:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 32px rgba(0,0,0,0.2), 0 0 0 1px rgba(212,175,55,0.15);
  }
  .ft3-tile:active { transform: scale(0.98); }
  .ft3-tile .ft3-tile-icon-wrap {
    transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1), filter 250ms ease;
  }
  .ft3-tile:hover .ft3-tile-icon-wrap {
    transform: scale(1.12) rotate(-4deg);
  }
  .ft3-tile .ft3-tile-ring {
    transition: opacity 300ms ease;
    opacity: 0;
  }
  .ft3-tile:hover .ft3-tile-ring {
    opacity: 1;
  }
  .ft3-tile .ft3-tile-label {
    transition: color 200ms ease, text-shadow 200ms ease;
  }
  .ft3-tile .ft3-tile-value {
    transition: color 200ms ease, text-shadow 200ms ease, transform 200ms ease;
  }
  .ft3-tile:hover .ft3-tile-value {
    transform: translateX(2px);
  }

  /* ── Legal links ── */
  .ft3-legal {
    transition: color 200ms ease, text-shadow 200ms ease;
  }
  .ft3-legal:hover {
    color: #D4AF37 !important;
    text-shadow: 0 0 10px rgba(212,175,55,0.25);
  }

  /* ── Section heading gradient ── */
  .ft3-heading {
    background: linear-gradient(135deg, #D4AF37 0%, #E5C76B 60%, #EDD060 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 10px rgba(212,175,55,0.35));
  }
`;

/* ── Constellation star dots — positioned pseudo-randomly ── */
const STARS = [
  { top: "12%", left: "8%", size: 2, delay: 0 },
  { top: "25%", left: "22%", size: 1.5, delay: 1.8 },
  { top: "18%", left: "78%", size: 2, delay: 0.6 },
  { top: "65%", left: "92%", size: 1.5, delay: 2.4 },
  { top: "45%", left: "5%", size: 1, delay: 1.2 },
  { top: "80%", left: "35%", size: 2, delay: 3.1 },
  { top: "35%", left: "55%", size: 1, delay: 0.9 },
  { top: "72%", left: "68%", size: 1.5, delay: 2.0 },
  { top: "55%", left: "15%", size: 1, delay: 3.6 },
  { top: "15%", left: "45%", size: 1.5, delay: 1.5 },
  { top: "88%", left: "82%", size: 1, delay: 0.3 },
  { top: "40%", left: "88%", size: 2, delay: 2.7 },
];

const SOCIALS = [
  {
    href: CONTACT.instagramUrl,
    Icon: Instagram,
    label: "Instagram",
    gradient: "linear-gradient(135deg, #833AB4, #E1306C, #F77737)",
  },
  {
    href: `https://tiktok.com/@${CONTACT.tiktok}`,
    Icon: TikTokIcon,
    label: "TikTok",
    gradient: "linear-gradient(135deg, #00F2EA, #FF0050)",
  },
  {
    href: CONTACT.facebookUrl,
    Icon: Facebook,
    label: "Facebook",
    gradient: "linear-gradient(135deg, #1877F2, #42B0FF)",
  },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden" style={{ isolation: "isolate" }}>
      <style>{FOOTER_STYLES}</style>

      {/* ═══ LAYER 1 — Rich purple brand background ═══ */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(165deg, #1E0A3C 0%, #2E1065 18%, #4C1D95 38%, #3B0764 62%, #1E0A3C 82%, #0F0A1F 100%)",
        }}
      />

      {/* ═══ LAYER 2 — Dual gold nebula orbs ═══ */}
      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={{
          top: "-20%",
          left: "10%",
          width: "45%",
          height: "80%",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(212,175,55,0.09) 0%, rgba(212,175,55,0.03) 40%, transparent 70%)",
          animation: "ft3-nebula-drift 12s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={{
          bottom: "-15%",
          right: "5%",
          width: "40%",
          height: "70%",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(124,58,237,0.07) 0%, rgba(124,58,237,0.02) 45%, transparent 70%)",
          animation: "ft3-nebula-drift 15s ease-in-out infinite reverse",
          willChange: "transform",
        }}
      />

      {/* ═══ LAYER 3 — Constellation star-field ═══ */}
      {STARS.map((star, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute rounded-full pointer-events-none"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            background: "rgba(212,175,55,0.6)",
            boxShadow: `0 0 ${star.size * 3}px rgba(212,175,55,0.3)`,
            animation: `ft3-star-twinkle ${3.5 + star.delay}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* ═══ Top prismatic neon trim ═══ */}
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, transparent 1%, rgba(124,58,237,0.25) 12%, rgba(212,175,55,0.7) 30%, rgba(237,208,96,0.5) 50%, rgba(212,175,55,0.7) 70%, rgba(124,58,237,0.25) 88%, transparent 99%)",
        }}
      />

      {/* ═══ CONTENT ═══ */}
      <div className="relative container mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-14" style={{ zIndex: 2 }}>

        {/* ══════ MAIN GRID — 3 columns on desktop ══════ */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-6 lg:gap-10 items-start">

          {/* ── COL 1 — Contact (left on desktop, below brand on mobile) ── */}
          <div className="order-2 md:order-1 flex flex-col items-center gap-4">
            <span className="ft3-heading text-[11px] font-extrabold uppercase tracking-[0.25em]">
              Contact
            </span>

            {/* Contact tiles — each with unique themed identity */}
            <div className="flex flex-col gap-3 w-full max-w-[220px]">
              {/* ── Phone tile — gold theme ── */}
              <a
                href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                className="ft3-tile group/tile relative rounded-xl overflow-hidden"
                style={{
                  background: "rgba(212,175,55,0.04)",
                  border: "1px solid rgba(212,175,55,0.1)",
                  padding: "12px 14px",
                }}
              >
                {/* Hover rotating ring */}
                <span
                  className="ft3-tile-ring absolute overflow-hidden pointer-events-none"
                  aria-hidden="true"
                  style={{ inset: -1.5, borderRadius: 13 }}
                >
                  <span style={{
                    position: "absolute", inset: "-200%",
                    background: "conic-gradient(from 0deg, transparent 30%, #D4AF37 50%, transparent 70%)",
                    animation: "ft3-spin 2.5s linear infinite", willChange: "transform",
                  }} />
                </span>
                <div className="relative flex items-center gap-3">
                  <span
                    className="ft3-tile-icon-wrap flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.06))",
                      border: "1px solid rgba(212,175,55,0.2)",
                      boxShadow: "0 0 12px rgba(212,175,55,0.1)",
                    }}
                  >
                    <Phone className="h-4 w-4" style={{ color: "#D4AF37" }} />
                  </span>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="ft3-tile-label text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgba(212,175,55,0.6)" }}>
                      Appelez-nous
                    </span>
                    <span className="ft3-tile-value text-[13px] font-semibold tabular-nums" style={{ color: "rgba(255,255,255,0.92)" }}>
                      {CONTACT.phone}
                    </span>
                  </div>
                </div>
              </a>

              {/* ── WhatsApp tile — green theme ── */}
              <a
                href={`https://wa.me/${CONTACT.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ft3-tile group/tile relative rounded-xl overflow-hidden"
                style={{
                  background: "rgba(37,211,102,0.04)",
                  border: "1px solid rgba(37,211,102,0.1)",
                  padding: "12px 14px",
                }}
              >
                <span
                  className="ft3-tile-ring absolute overflow-hidden pointer-events-none"
                  aria-hidden="true"
                  style={{ inset: -1.5, borderRadius: 13 }}
                >
                  <span style={{
                    position: "absolute", inset: "-200%",
                    background: "conic-gradient(from 0deg, transparent 30%, #25D366 50%, transparent 70%)",
                    animation: "ft3-spin 2.5s linear infinite", willChange: "transform",
                  }} />
                </span>
                <div className="relative flex items-center gap-3">
                  <span
                    className="ft3-tile-icon-wrap flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, rgba(37,211,102,0.15), rgba(37,211,102,0.05))",
                      border: "1px solid rgba(37,211,102,0.2)",
                      boxShadow: "0 0 12px rgba(37,211,102,0.08)",
                    }}
                  >
                    <MessageCircle className="h-4 w-4" style={{ color: "#25D366" }} />
                  </span>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="ft3-tile-label text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgba(37,211,102,0.6)" }}>
                      WhatsApp
                    </span>
                    <span className="ft3-tile-value text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.92)" }}>
                      Écrivez-nous
                    </span>
                  </div>
                </div>
              </a>

              {/* ── Location tile — violet theme ── */}
              <div
                className="ft3-tile group/tile relative rounded-xl overflow-hidden"
                style={{
                  background: "rgba(124,58,237,0.04)",
                  border: "1px solid rgba(124,58,237,0.1)",
                  padding: "12px 14px",
                }}
              >
                <span
                  className="ft3-tile-ring absolute overflow-hidden pointer-events-none"
                  aria-hidden="true"
                  style={{ inset: -1.5, borderRadius: 13 }}
                >
                  <span style={{
                    position: "absolute", inset: "-200%",
                    background: "conic-gradient(from 0deg, transparent 30%, #7C3AED 50%, transparent 70%)",
                    animation: "ft3-spin 3s linear infinite", willChange: "transform",
                  }} />
                </span>
                <div className="relative flex items-center gap-3">
                  <span
                    className="ft3-tile-icon-wrap flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.05))",
                      border: "1px solid rgba(124,58,237,0.2)",
                      boxShadow: "0 0 12px rgba(124,58,237,0.08)",
                    }}
                  >
                    <MapPin className="h-4 w-4" style={{ color: "#7C3AED" }} />
                  </span>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="ft3-tile-label text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgba(124,58,237,0.6)" }}>
                      Adresse
                    </span>
                    <span className="ft3-tile-value text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.92)" }}>
                      {CONTACT.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── COL 2 — Brand Pillar (center) ── */}
          <div className="order-1 md:order-2 flex flex-col items-center gap-5">
            {/* Logo with rotating neon halo */}
            <div className="relative group/logo cursor-default">
              {/* Outer glow halo */}
              <div
                className="absolute rounded-2xl pointer-events-none"
                aria-hidden="true"
                style={{
                  inset: -8,
                  background:
                    "radial-gradient(ellipse at center, rgba(212,175,55,0.12) 0%, transparent 70%)",
                  animation: "ft3-orb-pulse 4s ease-in-out infinite",
                  willChange: "transform",
                }}
              />
              {/* Rotating conic-gradient border */}
              <div
                className="absolute overflow-hidden"
                aria-hidden="true"
                style={{ inset: -3.5, borderRadius: 18 }}
              >
                <span
                  style={{
                    position: "absolute",
                    inset: "-200%",
                    background:
                      "conic-gradient(from 0deg, #D4AF37, transparent 12%, #7C3AED 28%, transparent 48%, #EDD060 68%, transparent 85%, #D4AF37)",
                    animation: "ft3-spin 3.5s linear infinite",
                    willChange: "transform",
                  }}
                />
              </div>
              {/* Glass interior */}
              <div
                className="relative h-16 w-16 sm:h-[72px] sm:w-[72px] rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(30,10,60,0.95), rgba(15,10,31,0.98))",
                  boxShadow:
                    "inset 0 1px 2px rgba(212,175,55,0.15), 0 0 28px rgba(212,175,55,0.12), 0 0 60px rgba(124,58,237,0.06)",
                }}
              >
                <img
                  src={BRAND.logo}
                  alt={BRAND.name}
                  width={72}
                  height={72}
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.src = "/logo.png";
                    el.onerror = () => {
                      el.style.display = "none";
                      el.parentElement?.querySelector(".logo-fallback")?.classList.remove("hidden");
                    };
                  }}
                />
                <div className="logo-fallback hidden absolute inset-0 rounded-2xl bg-crepe-gold flex items-center justify-center text-crepe-purple font-bold text-base">
                  CT
                </div>
              </div>
            </div>

            {/* Brand text */}
            <div className="group flex flex-col items-center gap-2.5 cursor-default">
              {/* Name with shimmer sweep */}
              <div className="relative overflow-hidden leading-tight">
                <span
                  className="font-heading font-black block text-center"
                  style={{
                    fontSize: "clamp(1.6rem, 3vw, 2.3rem)",
                    letterSpacing: "-0.03em",
                    background:
                      "linear-gradient(135deg, #E5C76B 0%, #D4AF37 20%, #FFFFFF 48%, #E5C76B 76%, #C9A227 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 2px 20px rgba(212,175,55,0.5))",
                  }}
                >
                  {BRAND.name}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 pointer-events-none"
                  style={{
                    width: "50%",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    animation: "ft3-shimmer 4.5s ease-in-out infinite",
                  }}
                />
              </div>

              {/* Decorative gold hairline */}
              <span
                aria-hidden="true"
                className="block h-px scale-x-50 opacity-50 group-hover:scale-x-100 group-hover:opacity-90 transition-all duration-500"
                style={{
                  width: "120%",
                  background:
                    "linear-gradient(to right, transparent, rgba(212,175,55,0.8), transparent)",
                  transformOrigin: "center",
                }}
              />

              {/* Tagline */}
              <span className="flex items-center gap-2.5 opacity-75 group-hover:opacity-100 transition-opacity duration-300">
                <span
                  aria-hidden="true"
                  className="text-[9px] inline-block group-hover:rotate-[72deg] group-hover:scale-125 transition-transform duration-500"
                  style={{ color: "#D4AF37" }}
                >
                  ✦
                </span>
                <span
                  className="text-[10px] sm:text-[11px] font-bold tracking-[0.3em] uppercase"
                  style={{
                    color: "rgba(212,175,55,0.95)",
                    textShadow: "0 0 16px rgba(212,175,55,0.2)",
                  }}
                >
                  {BRAND.tagline}
                </span>
                <span
                  aria-hidden="true"
                  className="text-[9px] inline-block group-hover:-rotate-[72deg] group-hover:scale-125 transition-transform duration-500"
                  style={{ color: "#D4AF37" }}
                >
                  ✦
                </span>
              </span>
            </div>
          </div>

          {/* ── COL 3 — Social (right on desktop) ── */}
          <div className="order-3 flex flex-col items-center gap-4">
            <span className="ft3-heading text-[11px] font-extrabold uppercase tracking-[0.25em]">
              Suivez-nous
            </span>

            {/* Social orbs row */}
            <div className="flex items-center gap-3 sm:gap-4">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ft3-orb group/orb relative flex flex-col items-center gap-2"
                  title={social.label}
                >
                  {/* Orb container */}
                  <div
                    className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* Hover: rotating colored ring */}
                    <span
                      className="ft3-orb-ring absolute overflow-hidden pointer-events-none"
                      aria-hidden="true"
                      style={{ inset: -2, borderRadius: 14 }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          inset: "-200%",
                          background: `conic-gradient(from 0deg, transparent 30%, ${social.gradient.includes("#833AB4") ? "#E1306C" : social.gradient.includes("#00F2EA") ? "#00F2EA" : "#1877F2"} 50%, transparent 70%)`,
                          animation: "ft3-spin 2.5s linear infinite",
                          willChange: "transform",
                        }}
                      />
                    </span>
                    {/* Icon */}
                    <social.Icon
                      className="ft3-orb-icon h-5 w-5 sm:h-6 sm:w-6 relative z-10"
                      style={{ color: "rgba(255,255,255,0.75)" }}
                    />
                  </div>
                  {/* Label below orb */}
                  <span
                    className="ft3-orb-label text-[10px] sm:text-[11px] font-semibold tracking-wide"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ Circuit-trace separator with dual dots ═══ */}
        <div className="relative mt-8 sm:mt-10 mb-5 sm:mb-6" aria-hidden="true">
          {/* Gradient line */}
          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 1%, rgba(124,58,237,0.2) 15%, rgba(212,175,55,0.5) 35%, rgba(237,208,96,0.35) 50%, rgba(212,175,55,0.5) 65%, rgba(124,58,237,0.2) 85%, transparent 99%)",
            }}
          />
          {/* Center diamond node */}
          <span
            className="absolute top-[-3px] left-1/2 -translate-x-1/2 w-[7px] h-[7px] rotate-45"
            style={{
              background: "#D4AF37",
              boxShadow: "0 0 10px rgba(212,175,55,0.7), 0 0 20px rgba(212,175,55,0.2)",
            }}
          />
          {/* Flowing gold dot — left to right */}
          <span
            className="absolute top-[-2px] left-0 h-[5px] w-[5px] rounded-full"
            style={{
              background: "#D4AF37",
              boxShadow: "0 0 8px rgba(212,175,55,0.8)",
              animation: "ft3-dot-flow 7s ease-in-out infinite",
            }}
          />
          {/* Flowing violet dot — right to left */}
          <span
            className="absolute top-[-2px] right-0 h-[4px] w-[4px] rounded-full"
            style={{
              background: "#7C3AED",
              boxShadow: "0 0 6px rgba(124,58,237,0.6)",
              animation: "ft3-dot-flow-reverse 9s ease-in-out infinite",
              animationDelay: "2s",
            }}
          />
        </div>

        {/* ═══ Bottom bar — legal + credits ═══ */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          {/* Legal links */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
            <span className="ft3-legal cursor-pointer" style={{ color: "rgba(255,255,255,0.45)" }}>
              Politique de confidentialité
            </span>
            <span style={{ color: "rgba(212,175,55,0.2)" }} className="hidden sm:inline">◆</span>
            <span className="ft3-legal cursor-pointer" style={{ color: "rgba(255,255,255,0.45)" }}>
              Conditions d&apos;utilisation
            </span>
          </div>

          {/* Credits */}
          <div className="flex flex-col sm:items-end gap-1.5 text-xs">
            <span style={{ color: "rgba(255,255,255,0.6)" }}>
              © 2021{" "}
              <span
                className="font-bold"
                style={{
                  background: "linear-gradient(90deg, #D4AF37, #E5C76B, #D4AF37)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Crêpe Time
              </span>
              . Tous droits réservés.
            </span>
            <div
              className="flex flex-wrap items-center justify-center sm:justify-end gap-1.5"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              <a
                href="https://marwen-rabai.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold transition-all duration-200"
                title="Digital Architect & Event Designer"
                style={{
                  color: "#D4AF37",
                  animation: "ft3-glow-breathe 3s ease-in-out infinite",
                }}
              >
                <Heart className="h-3 w-3 fill-current" />
                Digital Team
              </a>
              <span style={{ color: "rgba(212,175,55,0.15)" }}>◆</span>
              <Code2 className="h-3.5 w-3.5" style={{ color: "rgba(212,175,55,0.5)" }} />
              <span>Built with passion & precision</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Bottom prismatic neon trim ═══ */}
      <div
        className="absolute inset-x-0 bottom-0 h-[1.5px]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, transparent 2%, rgba(212,175,55,0.15) 18%, rgba(124,58,237,0.35) 40%, rgba(212,175,55,0.45) 55%, rgba(124,58,237,0.25) 75%, transparent 98%)",
        }}
      />
    </footer>
  );
};

export default Footer;
