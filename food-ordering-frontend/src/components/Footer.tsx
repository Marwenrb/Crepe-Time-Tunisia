/**
 * Footer v2 — Uiverse Prism Glass Edition
 *
 * Premium footer matching the Crêpe Time Uiverse design language:
 *  - Frosted glass background (backdrop-blur + dark translucent bg)
 *  - Top prismatic neon trim (gold → violet gradient)
 *  - Rotating conic-gradient neon ring around logo
 *  - Glass card panels for Contact & Social sections
 *  - Circuit-trace separator with flowing gold dot
 *  - Gold neon text glow + shimmer sweep on brand name
 *  - Social links with glass hover states + edge-light reveal
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

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

/* ── GPU-composited keyframes ── */
const FOOTER_STYLES = `
  @keyframes ft-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes ft-shimmer {
    0%   { transform: translateX(-180%); opacity: 0; }
    15%  { opacity: 0.5; }
    85%  { opacity: 0.15; }
    100% { transform: translateX(280%); opacity: 0; }
  }
  @keyframes ft-trace-dot {
    0%   { transform: translateX(-100%); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.6; }
    100% { transform: translateX(3000%); opacity: 0; }
  }
  @keyframes ft-glow-breathe {
    0%, 100% { filter: drop-shadow(0 0 6px rgba(212,175,55,0.3)); }
    50%      { filter: drop-shadow(0 0 14px rgba(212,175,55,0.6)); }
  }
  @keyframes ft-scan {
    0%   { transform: translateX(-120%); opacity: 0; }
    8%   { opacity: 0.25; }
    92%  { opacity: 0.08; }
    100% { transform: translateX(600%); opacity: 0; }
  }

  /* Social link hover — glass edge-light */
  .ft-social-link {
    transition: background 220ms ease, border-color 220ms ease, transform 150ms ease;
  }
  .ft-social-link:hover {
    background: rgba(212,175,55,0.08);
    border-color: rgba(212,175,55,0.3);
    transform: translateY(-1px);
  }
  .ft-social-link:active {
    transform: scale(0.97);
  }
  .ft-social-link .ft-social-icon {
    transition: filter 220ms ease, color 220ms ease;
  }
  .ft-social-link:hover .ft-social-icon {
    color: #D4AF37 !important;
    filter: drop-shadow(0 0 8px rgba(212,175,55,0.6));
  }
  .ft-social-link .ft-social-label {
    transition: color 220ms ease, text-shadow 220ms ease;
  }
  .ft-social-link:hover .ft-social-label {
    color: #E5C76B !important;
    text-shadow: 0 0 10px rgba(212,175,55,0.3);
  }

  /* Contact link hover */
  .ft-contact-link {
    transition: color 220ms ease, transform 150ms ease;
  }
  .ft-contact-link:hover {
    color: #D4AF37 !important;
    transform: translateX(2px);
  }
  .ft-contact-link .ft-contact-icon {
    transition: filter 220ms ease;
  }
  .ft-contact-link:hover .ft-contact-icon {
    filter: drop-shadow(0 0 6px rgba(212,175,55,0.5));
  }

  /* Glass section heading */
  .ft-section-heading {
    background: linear-gradient(90deg, #D4AF37, #E5C76B);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 8px rgba(212,175,55,0.3));
  }
`;

const Footer = () => {
  return (
    <footer className="relative" style={{ isolation: "isolate" }}>
      <style>{FOOTER_STYLES}</style>

      {/* ── Frosted glass background ── */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,4,26,0.96) 0%, rgba(15,6,36,0.94) 35%, rgba(12,5,30,0.97) 100%)",
          backdropFilter: "blur(24px) saturate(1.3)",
          WebkitBackdropFilter: "blur(24px) saturate(1.3)",
        }}
      />

      {/* ── Top prismatic neon trim ── */}
      <div
        className="absolute inset-x-0 top-0 h-[1.5px]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, transparent 2%, rgba(124,58,237,0.2) 15%, rgba(212,175,55,0.55) 35%, rgba(237,208,96,0.4) 50%, rgba(212,175,55,0.55) 65%, rgba(124,58,237,0.2) 85%, transparent 98%)",
        }}
      />

      {/* ── Ambient scan beam (GPU: translateX) ── */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 pointer-events-none"
        style={{
          width: "12%",
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.03), rgba(124,58,237,0.015), transparent)",
          animation: "ft-scan 11s ease-in-out infinite",
          zIndex: 1,
        }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 py-8 sm:py-10" style={{ zIndex: 2 }}>
        {/* ═══ Main row ═══ */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12">

          {/* ── Brand Column — Logo + Name + Tagline ── */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            {/* Logo with rotating neon ring */}
            <div className="relative shrink-0 group/logo cursor-default">
              {/* Rotating conic-gradient border */}
              <div
                className="absolute overflow-hidden"
                style={{ inset: -3, borderRadius: 16 }}
                aria-hidden="true"
              >
                <span
                  style={{
                    position: "absolute",
                    inset: "-200%",
                    background:
                      "conic-gradient(from 0deg, #D4AF37, transparent 14%, #7C3AED 32%, transparent 52%, #EDD060 72%, #D4AF37)",
                    animation: "ft-spin 4s linear infinite",
                    willChange: "transform",
                    opacity: 0.7,
                  }}
                />
              </div>
              {/* Glass interior */}
              <div
                className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden"
                style={{
                  background: "rgba(15,10,31,0.9)",
                  boxShadow:
                    "inset 0 1px 1px rgba(212,175,55,0.1), 0 0 20px rgba(212,175,55,0.15)",
                }}
              >
                <img
                  src={BRAND.logo}
                  alt={BRAND.name}
                  width={64}
                  height={64}
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
                <div className="logo-fallback hidden absolute inset-0 rounded-xl bg-crepe-gold flex items-center justify-center text-crepe-purple font-bold text-sm">
                  CT
                </div>
              </div>
            </div>

            {/* Brand text mark */}
            <div className="group flex flex-col items-center lg:items-start gap-2 cursor-default">
              {/* Brand name with gold gradient + shimmer sweep */}
              <div className="relative overflow-hidden leading-tight">
                <span
                  className="font-heading font-black block"
                  style={{
                    fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)",
                    letterSpacing: "-0.035em",
                    background:
                      "linear-gradient(135deg, #E5C76B 0%, #D4AF37 22%, #FFFFFF 50%, #E5C76B 78%, #C9A227 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 1px 16px rgba(212,175,55,0.55))",
                  }}
                >
                  {BRAND.name}
                </span>

                {/* Shimmer sweep (GPU: translateX) */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 pointer-events-none"
                  style={{
                    width: "55%",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                    transform: "skewX(-18deg)",
                    animation: "ft-shimmer 4s ease-in-out infinite",
                  }}
                />
              </div>

              {/* Hairline — gold gradient expand */}
              <span
                aria-hidden="true"
                className="block h-px w-full scale-x-50 opacity-50 group-hover:scale-x-100 group-hover:opacity-90 transition-all duration-500"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(212,175,55,0.7), transparent)",
                  transformOrigin: "center",
                }}
              />

              {/* Tagline */}
              <span className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                <span
                  aria-hidden="true"
                  className="text-[8px] inline-block group-hover:rotate-[72deg] group-hover:scale-110 transition-transform duration-500"
                  style={{ color: "rgba(212,175,55,0.8)" }}
                >
                  ✦
                </span>
                <span
                  className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] uppercase"
                  style={{ color: "rgba(212,175,55,0.9)" }}
                >
                  {BRAND.tagline}
                </span>
                <span
                  aria-hidden="true"
                  className="text-[8px] inline-block group-hover:-rotate-[72deg] group-hover:scale-110 transition-transform duration-500"
                  style={{ color: "rgba(212,175,55,0.8)" }}
                >
                  ✦
                </span>
              </span>
            </div>
          </div>

          {/* ── Info Columns — Contact & Social in glass cards ── */}
          <div className="flex flex-wrap justify-center lg:justify-end gap-5 sm:gap-6">
            {/* Contact glass card */}
            <div
              className="flex flex-col gap-2.5 rounded-xl p-4 sm:p-5"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                minWidth: 170,
              }}
            >
              <span className="ft-section-heading text-[11px] font-bold uppercase tracking-[0.2em] pb-1">
                Contact
              </span>
              <a
                href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                className="ft-contact-link flex items-center gap-2.5 text-white/85 text-sm min-h-[40px]"
              >
                <Phone className="ft-contact-icon h-3.5 w-3.5 flex-shrink-0" style={{ color: "rgba(212,175,55,0.7)" }} />
                <span>{CONTACT.phone}</span>
              </a>
              <a
                href={`https://wa.me/${CONTACT.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ft-contact-link flex items-center gap-2.5 text-white/85 text-sm min-h-[40px]"
              >
                <MessageCircle className="ft-contact-icon h-3.5 w-3.5 flex-shrink-0" style={{ color: "rgba(212,175,55,0.7)" }} />
                <span>WhatsApp</span>
              </a>
              <span className="flex items-center gap-2.5 text-white/65 text-sm min-h-[40px]">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "rgba(212,175,55,0.5)" }} />
                <span>{CONTACT.address}</span>
              </span>
            </div>

            {/* Social glass card */}
            <div
              className="flex flex-col gap-2.5 rounded-xl p-4 sm:p-5"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                minWidth: 170,
              }}
            >
              <span className="ft-section-heading text-[11px] font-bold uppercase tracking-[0.2em] pb-1">
                Suivez-nous
              </span>
              {[
                { href: CONTACT.instagramUrl, icon: <Instagram className="ft-social-icon h-4 w-4" style={{ color: "rgba(255,255,255,0.7)" }} />, label: "Instagram" },
                { href: `https://tiktok.com/@${CONTACT.tiktok}`, icon: <TikTokIcon className="ft-social-icon h-4 w-4" style={{ color: "rgba(255,255,255,0.7)" } as React.CSSProperties} />, label: "TikTok" },
                { href: CONTACT.facebookUrl, icon: <Facebook className="ft-social-icon h-4 w-4" style={{ color: "rgba(255,255,255,0.7)" }} />, label: "Facebook" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ft-social-link flex items-center gap-2.5 rounded-lg px-3 py-2 min-h-[40px]"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {social.icon}
                  <span className="ft-social-label text-sm font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ Circuit-trace separator ═══ */}
        <div className="relative mt-7 mb-5" aria-hidden="true">
          {/* Gradient line */}
          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 2%, rgba(124,58,237,0.15) 18%, rgba(212,175,55,0.4) 42%, rgba(237,208,96,0.3) 58%, rgba(124,58,237,0.12) 82%, transparent 98%)",
            }}
          />
          {/* Flowing gold dot */}
          <span
            className="absolute top-[-2px] h-[5px] w-[5px] rounded-full"
            style={{
              background: "#D4AF37",
              boxShadow: "0 0 8px rgba(212,175,55,0.8), 0 0 16px rgba(212,175,55,0.3)",
              animation: "ft-trace-dot 6s ease-in-out infinite",
            }}
          />
        </div>

        {/* ═══ Bottom bar — legal + credits ═══ */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs">
            <span
              className="cursor-pointer transition-all duration-200"
              style={{ color: "rgba(255,255,255,0.5)" }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "#D4AF37";
                (e.target as HTMLElement).style.textShadow = "0 0 8px rgba(212,175,55,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "rgba(255,255,255,0.5)";
                (e.target as HTMLElement).style.textShadow = "none";
              }}
            >
              Politique de confidentialité
            </span>
            <span style={{ color: "rgba(255,255,255,0.2)" }} className="hidden sm:inline">•</span>
            <span
              className="cursor-pointer transition-all duration-200"
              style={{ color: "rgba(255,255,255,0.5)" }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "#D4AF37";
                (e.target as HTMLElement).style.textShadow = "0 0 8px rgba(212,175,55,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "rgba(255,255,255,0.5)";
                (e.target as HTMLElement).style.textShadow = "none";
              }}
            >
              Conditions d&apos;utilisation
            </span>
          </div>
          <div className="flex flex-col sm:items-end gap-1.5 text-xs">
            <span style={{ color: "rgba(255,255,255,0.7)" }}>
              © 2021{" "}
              <span
                className="font-semibold"
                style={{
                  background: "linear-gradient(90deg, #D4AF37, #E5C76B)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Crêpe Time
              </span>
              . Tous droits réservés.
            </span>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
              <a
                href="https://marwen-rabai.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium transition-all duration-200"
                title="Digital Architect & Event Designer"
                style={{ color: "#D4AF37", animation: "ft-glow-breathe 3s ease-in-out infinite" }}
              >
                <Heart className="h-3 w-3 fill-current" />
                Digital Team
              </a>
              <span style={{ color: "rgba(255,255,255,0.25)" }}>•</span>
              <Code2 className="h-3.5 w-3.5" style={{ color: "rgba(212,175,55,0.6)" }} />
              <span>Built with passion & precision</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
