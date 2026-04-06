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

const SOCIAL_LINKS = [
  { href: CONTACT.instagramUrl, icon: Instagram, label: "Instagram" },
  { href: `https://tiktok.com/@${CONTACT.tiktok}`, icon: TikTokIcon, label: "TikTok" },
  { href: CONTACT.facebookUrl, icon: Facebook, label: "Facebook" },
] as const;

const FOOTER_KEYFRAMES = `
  @keyframes ft-rotate-border {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes ft-glow-breathe {
    0%, 100% { filter: drop-shadow(0 0 8px rgba(212,175,55,0.25)) drop-shadow(0 0 20px rgba(212,175,55,0.08)); }
    50%      { filter: drop-shadow(0 0 14px rgba(212,175,55,0.4)) drop-shadow(0 0 28px rgba(212,175,55,0.12)); }
  }
  .ft-logo-ring { animation: ft-glow-breathe 3.5s ease-in-out infinite; }
  @keyframes ft-line-pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  @keyframes ft-line-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
`;

const Footer = () => {
  return (
    <footer
      className="relative"
      style={{
        background: "linear-gradient(180deg, #3B0764 0%, #2D064E 50%, #1A0A2E 100%)",
      }}
    >
      <style>{FOOTER_KEYFRAMES}</style>

      {/* Top gold accent line */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.5) 30%, rgba(212,175,55,0.8) 50%, rgba(212,175,55,0.5) 70%, transparent 95%)",
        }}
      />

      <div className="container mx-auto px-5 sm:px-6 pt-8 sm:pt-10 pb-6">
        {/* ═══ Top: Brand + Contact + Social grid ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 text-center">

          {/* ── Brand column — matching Header logo ring ── */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              {/* Rotating conic-gradient ring — same as Header */}
              <div className="relative flex-shrink-0">
                <div
                  className="ft-logo-ring relative rounded-2xl overflow-hidden"
                  style={{ padding: 2 }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: "-120%",
                      background:
                        "conic-gradient(from 0deg, #D4AF37, transparent 18%, #7C3AED 38%, transparent 58%, #EDD060 78%, #D4AF37)",
                      animation: "ft-rotate-border 4s linear infinite",
                      willChange: "transform",
                    }}
                  />
                  <div className="relative h-11 w-11 rounded-xl overflow-hidden bg-white">
                    <img
                      src={BRAND.logo}
                      alt={BRAND.name}
                      width={44}
                      height={44}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const el = e.target as HTMLImageElement;
                        el.src = "/logo.png";
                        el.onerror = () => {
                          el.style.display = "none";
                          el.parentElement?.querySelector(".ft-logo-fb")?.classList.remove("hidden");
                        };
                      }}
                    />
                    <div className="ft-logo-fb hidden absolute inset-0 bg-crepe-gold flex items-center justify-center text-crepe-purple font-bold text-xs">
                      CT
                    </div>
                  </div>
                </div>
              </div>
              {/* Brand text — matching Header style */}
              <div className="flex flex-col min-w-0">
                <span
                  className="text-base sm:text-lg md:text-xl font-bold tracking-tight leading-tight"
                  style={{
                    background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8E1 60%, #E5C76B 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
                  }}
                >
                  {BRAND.name}
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.25em] text-crepe-gold uppercase leading-tight opacity-90">
                  {BRAND.tagline}
                </span>
              </div>
            </div>

            <p className="text-white/50 text-xs leading-relaxed max-w-[220px] text-center mt-1">
              L&apos;art de la crêpe à Nabeul — saveurs authentiques, ingrédients frais, livré chez vous.
            </p>
          </div>

          {/* ── Contact column — inline neon-accent row ── */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-crepe-gold/80">
              Contact
            </span>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {/* Phone pill */}
              <a
                href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                className="group/c inline-flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 hover:scale-[1.03]"
                style={{
                  background: "rgba(212,175,55,0.06)",
                  border: "1px solid rgba(212,175,55,0.18)",
                  boxShadow: "0 0 12px rgba(212,175,55,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <Phone className="h-3.5 w-3.5 text-crepe-gold shrink-0" />
                <span className="text-xs font-semibold text-white/80 group-hover/c:text-crepe-gold transition-colors whitespace-nowrap">{CONTACT.phone}</span>
              </a>
              {/* WhatsApp pill */}
              <a
                href={`https://wa.me/${CONTACT.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group/c inline-flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 hover:scale-[1.03]"
                style={{
                  background: "rgba(37,211,102,0.06)",
                  border: "1px solid rgba(37,211,102,0.2)",
                  boxShadow: "0 0 12px rgba(37,211,102,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <MessageCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-white/80 group-hover/c:text-emerald-400 transition-colors">WhatsApp</span>
              </a>
              {/* Address pill */}
              <span
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  background: "rgba(139,92,246,0.05)",
                  border: "1px solid rgba(139,92,246,0.15)",
                  boxShadow: "0 0 12px rgba(139,92,246,0.04), inset 0 1px 0 rgba(255,255,255,0.03)",
                }}
              >
                <MapPin className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                <span className="text-xs font-medium text-white/55">{CONTACT.address}</span>
              </span>
            </div>
          </div>

          {/* ── Social column ── */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-crepe-gold/80 mb-1">
              Suivez-nous
            </span>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} — Crêpe Time`}
                  className="group/s flex items-center justify-center h-10 w-10 rounded-full border border-white/15 hover:border-crepe-gold/60 bg-white/[0.04] hover:bg-crepe-gold/10 transition-all duration-200"
                >
                  <Icon className="h-[18px] w-[18px] text-white/70 group-hover/s:text-crepe-gold transition-colors duration-200" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ Divider — premium animated double shimmer with glow ═══ */}
        <div aria-hidden="true" className="my-6 relative flex flex-col items-center gap-[3px]">
          {/* Soft glow layer */}
          <div
            className="absolute inset-x-[10%] top-1/2 -translate-y-1/2"
            style={{
              height: "6px",
              borderRadius: "3px",
              background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.15) 25%, rgba(212,175,55,0.45) 50%, rgba(212,175,55,0.15) 75%, transparent 100%)",
              filter: "blur(4px)",
              animation: "ft-line-pulse 3s ease-in-out infinite",
            }}
          />
          {/* Primary shimmer line */}
          <div
            style={{
              width: "100%",
              height: "1.5px",
              borderRadius: "1px",
              backgroundImage: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.15) 10%, rgba(212,175,55,0.55) 35%, rgba(255,255,255,0.95) 50%, rgba(212,175,55,0.55) 65%, rgba(212,175,55,0.15) 90%, transparent 100%)",
              backgroundSize: "200% 100%",
              animation: "ft-line-shimmer 4s ease-in-out infinite",
              boxShadow: "0 0 8px rgba(212,175,55,0.35), 0 0 20px rgba(212,175,55,0.12)",
            }}
          />
          {/* Secondary accent line */}
          <div
            style={{
              width: "50%",
              height: "1px",
              borderRadius: "1px",
              backgroundImage: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.08) 15%, rgba(212,175,55,0.35) 40%, rgba(255,248,225,0.55) 50%, rgba(212,175,55,0.35) 60%, rgba(212,175,55,0.08) 85%, transparent 100%)",
              backgroundSize: "200% 100%",
              animation: "ft-line-shimmer 4s ease-in-out infinite 0.4s",
            }}
          />
        </div>

        {/* ═══ Bottom bar ═══ */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-white/45">
            <span className="hover:text-crepe-gold/80 cursor-pointer transition-colors">Confidentialité</span>
            <span aria-hidden="true" className="text-white/20">·</span>
            <span className="hover:text-crepe-gold/80 cursor-pointer transition-colors">Conditions</span>
          </div>

          <span className="text-white/50">
            © 2021 <span className="text-crepe-gold/80 font-medium">{BRAND.name}</span>
          </span>

          <div className="flex items-center gap-1.5 text-white/45">
            <a
              href="https://marwen-rabai.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-crepe-gold/70 hover:text-crepe-gold transition-colors"
              title="Digital Architect & Event Designer"
            >
              <Heart className="h-3 w-3 fill-current" />
              <span className="font-medium">Digital Team</span>
            </a>
            <span aria-hidden="true" className="text-white/20">·</span>
            <Code2 className="h-3 w-3 text-white/30" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
