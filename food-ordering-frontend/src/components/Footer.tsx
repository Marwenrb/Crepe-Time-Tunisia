/**
 * Footer v4 — "La Maison" Edition
 *
 * Design philosophy: Luxury maison signature, not tech-startup glass.
 * Inspired by Laduree, Pierre Herme, Hermes — editorial, typographic, intentional.
 *
 * What makes it NOT generic:
 *  1. Typography IS the design — display wordmark flanked by extending gold rules
 *  2. Contact flows as one elegant horizontal strip with gold diamond separators
 *  3. Social icons are bare — no boxes, no tiles, just presence + sliding underline
 *  4. Deliberate negative space — elements breathe, nothing cramped
 *  5. Single warm gold radial glow — no star fields, no flying dots
 *  6. Everything centered, editorial, one-column — not a 3-col dashboard
 *  7. ALL animations GPU-composited (transform + opacity + filter)
 */

import { Phone, MessageCircle, Instagram, Facebook, MapPin, Heart, Code2, ExternalLink } from "lucide-react";
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
const STYLES = `
  @keyframes ft-shimmer {
    0%   { transform: translateX(-200%) skewX(-15deg); opacity: 0; }
    15%  { opacity: 0.6; }
    85%  { opacity: 0.08; }
    100% { transform: translateX(300%) skewX(-15deg); opacity: 0; }
  }
  @keyframes ft-glow-breathe {
    0%, 100% { filter: drop-shadow(0 0 6px rgba(212,175,55,0.2)); }
    50%      { filter: drop-shadow(0 0 16px rgba(212,175,55,0.5)); }
  }

  /* Social icon — sliding gold underline reveal */
  .ft-social {
    position: relative;
    transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .ft-social::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    right: 50%;
    height: 1.5px;
    background: #D4AF37;
    border-radius: 1px;
    transition: left 280ms cubic-bezier(0.22, 1, 0.36, 1),
                right 280ms cubic-bezier(0.22, 1, 0.36, 1),
                box-shadow 280ms ease;
    box-shadow: none;
  }
  .ft-social:hover::after {
    left: 10%;
    right: 10%;
    box-shadow: 0 0 8px rgba(212,175,55,0.4);
  }
  .ft-social:hover { transform: translateY(-2px); }
  .ft-social:active { transform: scale(0.92); }
  .ft-social .ft-social-ico {
    transition: color 220ms ease, filter 220ms ease;
  }
  .ft-social:hover .ft-social-ico {
    color: #D4AF37 !important;
    filter: drop-shadow(0 0 8px rgba(212,175,55,0.45));
  }
  .ft-social .ft-social-name {
    transition: color 220ms ease;
  }
  .ft-social:hover .ft-social-name {
    color: rgba(212,175,55,0.95) !important;
  }

  /* Contact strip links */
  .ft-contact {
    transition: color 200ms ease, transform 160ms ease;
  }
  .ft-contact:hover {
    color: #D4AF37 !important;
  }
  .ft-contact:hover .ft-contact-ico {
    filter: drop-shadow(0 0 6px rgba(212,175,55,0.5));
  }
  .ft-contact .ft-contact-ico {
    transition: filter 200ms ease;
  }

  /* Legal links */
  .ft-legal {
    transition: color 200ms ease;
  }
  .ft-legal:hover {
    color: #D4AF37 !important;
  }
`;

const Footer = () => {
  return (
    <footer className="relative overflow-hidden" style={{ isolation: "isolate" }}>
      <style>{STYLES}</style>

      {/* -- Background: deep purple gradient -- */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(175deg, #2E1065 0%, #3B0764 25%, #4C1D95 48%, #3B0764 72%, #1E0A3C 100%)",
        }}
      />

      {/* -- Single warm gold radial glow (not flying dots -- just warmth) -- */}
      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={{
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: "60%",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, rgba(212,175,55,0.02) 40%, transparent 65%)",
        }}
      />

      {/* -- Top prismatic trim -- */}
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, transparent 3%, rgba(124,58,237,0.2) 15%, rgba(212,175,55,0.65) 35%, rgba(237,208,96,0.5) 50%, rgba(212,175,55,0.65) 65%, rgba(124,58,237,0.2) 85%, transparent 97%)",
        }}
      />

      {/* ====== CONTENT ====== */}
      <div className="relative z-10 container mx-auto px-5 sm:px-8">

        {/* === ACT I -- Brand Signature === */}
        <div className="pt-12 sm:pt-16 pb-8 sm:pb-10 flex flex-col items-center">
          {/* Logo -- small, precious, centered */}
          <div className="relative mb-6">
            <div
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl overflow-hidden"
              style={{
                boxShadow:
                  "0 0 0 1.5px rgba(212,175,55,0.25), 0 0 30px rgba(212,175,55,0.1), 0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              <img
                src={BRAND.logo}
                alt={BRAND.name}
                width={64}
                height={64}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.src = "/logo.png";
                  el.onerror = () => {
                    el.style.display = "none";
                  };
                }}
              />
            </div>
          </div>

          {/* -- Brand Wordmark flanked by extending gold rules -- */}
          <div className="flex items-center gap-4 sm:gap-6 w-full max-w-lg">
            {/* Left rule */}
            <span
              aria-hidden="true"
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(to left, rgba(212,175,55,0.5), rgba(212,175,55,0.05))",
              }}
            />

            {/* Wordmark with shimmer */}
            <div className="relative overflow-hidden shrink-0">
              <h2
                className="font-heading font-black text-center"
                style={{
                  fontSize: "clamp(1.8rem, 5vw, 3rem)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  background:
                    "linear-gradient(135deg, #E5C76B 0%, #D4AF37 18%, #FFFFFF 46%, #E5C76B 74%, #C9A227 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 2px 24px rgba(212,175,55,0.4))",
                } as React.CSSProperties}
              >
                {BRAND.name}
              </h2>
              <span
                aria-hidden="true"
                className="absolute inset-y-0 pointer-events-none"
                style={{
                  width: "45%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                  animation: "ft-shimmer 5s ease-in-out infinite",
                }}
              />
            </div>

            {/* Right rule */}
            <span
              aria-hidden="true"
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(to right, rgba(212,175,55,0.5), rgba(212,175,55,0.05))",
              }}
            />
          </div>

          {/* Tagline */}
          <span
            className="mt-3 flex items-center gap-2 sm:gap-3"
            style={{ color: "rgba(212,175,55,0.7)" }}
          >
            <span className="text-[7px] sm:text-[8px]" aria-hidden="true">&#10022;</span>
            <span
              className="text-[10px] sm:text-[11px] font-bold tracking-[0.35em] uppercase"
              style={{ textShadow: "0 0 20px rgba(212,175,55,0.15)" }}
            >
              {BRAND.tagline}
            </span>
            <span className="text-[7px] sm:text-[8px]" aria-hidden="true">&#10022;</span>
          </span>
        </div>

        {/* === ACT II -- Contact Strip === */}
        {/* One flowing line with gold diamond separators -- like a luxury restaurant card */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-5 py-5 sm:py-6 border-t border-b"
          style={{ borderColor: "rgba(212,175,55,0.1)" }}
        >
          <a
            href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
            className="ft-contact flex items-center gap-2 text-[13px] sm:text-sm font-medium min-h-[44px]"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            <Phone className="ft-contact-ico h-3.5 w-3.5" style={{ color: "#D4AF37" }} />
            <span>{CONTACT.phone}</span>
          </a>

          <span aria-hidden="true" style={{ color: "rgba(212,175,55,0.25)" }} className="text-[8px] hidden sm:inline">&#9670;</span>

          <a
            href={`https://wa.me/${CONTACT.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ft-contact flex items-center gap-2 text-[13px] sm:text-sm font-medium min-h-[44px]"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            <MessageCircle className="ft-contact-ico h-3.5 w-3.5" style={{ color: "#25D366" }} />
            <span>WhatsApp</span>
            <ExternalLink className="h-2.5 w-2.5 opacity-40" />
          </a>

          <span aria-hidden="true" style={{ color: "rgba(212,175,55,0.25)" }} className="text-[8px] hidden sm:inline">&#9670;</span>

          <span
            className="flex items-center gap-2 text-[13px] sm:text-sm font-medium min-h-[44px]"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            <MapPin className="h-3.5 w-3.5" style={{ color: "rgba(124,58,237,0.6)" }} />
            <span>{CONTACT.address}</span>
          </span>
        </div>

        {/* === ACT III -- Social Presence === */}
        {/* Bare icons with sliding gold underline -- not in boxes */}
        <div className="py-6 sm:py-8 flex items-center justify-center gap-8 sm:gap-12">
          {[
            { href: CONTACT.instagramUrl, Icon: Instagram, label: "Instagram" },
            { href: `https://tiktok.com/@${CONTACT.tiktok}`, Icon: TikTokIcon, label: "TikTok" },
            { href: CONTACT.facebookUrl, Icon: Facebook, label: "Facebook" },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ft-social flex flex-col items-center gap-1.5 pb-1"
              title={social.label}
            >
              <social.Icon
                className="ft-social-ico h-5 w-5 sm:h-[22px] sm:w-[22px]"
                style={{ color: "rgba(255,255,255,0.6)" }}
              />
              <span
                className="ft-social-name text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] uppercase"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {social.label}
              </span>
            </a>
          ))}
        </div>

        {/* === ACT IV -- Legal & Credits === */}
        <div
          className="py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left border-t"
          style={{ borderColor: "rgba(212,175,55,0.07)" }}
        >
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px]">
            <span className="ft-legal cursor-pointer" style={{ color: "rgba(255,255,255,0.35)" }}>
              Politique de confidentialit&eacute;
            </span>
            <span style={{ color: "rgba(212,175,55,0.15)" }} className="hidden sm:inline text-[6px]" aria-hidden="true">&#9670;</span>
            <span className="ft-legal cursor-pointer" style={{ color: "rgba(255,255,255,0.35)" }}>
              Conditions d&apos;utilisation
            </span>
          </div>

          <div className="flex flex-col sm:items-end gap-1 text-[11px]">
            <span style={{ color: "rgba(255,255,255,0.45)" }}>
              &copy; 2021{" "}
              <span
                className="font-bold"
                style={{
                  background: "linear-gradient(90deg, #D4AF37, #E5C76B)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                } as React.CSSProperties}
              >
                Cr&ecirc;pe Time
              </span>
              . Tous droits r&eacute;serv&eacute;s.
            </span>
            <div
              className="flex flex-wrap items-center justify-center sm:justify-end gap-1.5"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              <a
                href="https://marwen-rabai.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold"
                title="Digital Architect & Event Designer"
                style={{
                  color: "#D4AF37",
                  animation: "ft-glow-breathe 3.5s ease-in-out infinite",
                }}
              >
                <Heart className="h-2.5 w-2.5 fill-current" />
                Digital Team
              </a>
              <span style={{ color: "rgba(212,175,55,0.1)" }} className="text-[6px]" aria-hidden="true">&#9670;</span>
              <Code2 className="h-3 w-3" style={{ color: "rgba(212,175,55,0.35)" }} />
              <span>Built with passion &amp; precision</span>
            </div>
          </div>
        </div>
      </div>

      {/* -- Bottom prismatic trim -- */}
      <div
        className="absolute inset-x-0 bottom-0 h-[1.5px]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, transparent 3%, rgba(212,175,55,0.15) 20%, rgba(124,58,237,0.3) 42%, rgba(212,175,55,0.4) 58%, rgba(124,58,237,0.2) 78%, transparent 97%)",
        }}
      />
    </footer>
  );
};

export default Footer;
