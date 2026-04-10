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
  @keyframes ft-logo-float {
    0%, 100% { transform: translateY(0px);  box-shadow: 0 0 0 1px rgba(212,175,55,0.18), 0 0 24px rgba(212,175,55,0.22), 0 8px 28px rgba(0,0,0,0.55); }
    50%       { transform: translateY(-5px); box-shadow: 0 0 0 1px rgba(212,175,55,0.38), 0 0 40px rgba(212,175,55,0.42), 0 16px 40px rgba(0,0,0,0.55); }
  }
  @keyframes ft-ring-spin {
    from { transform: rotate(0deg);   }
    to   { transform: rotate(360deg); }
  }
  @keyframes ft-line-pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  @keyframes ft-line-shimmer {
    0%   { opacity: 0.5; transform: translateX(-30%); }
    100% { opacity: 1;   transform: translateX(30%); }
  }
`;

const Footer = () => {
  return (
    <footer
      className="relative"
      style={{ background: "linear-gradient(180deg, #3B0764 0%, #2D064E 50%, #1A0A2E 100%)" }}
    >
      <style>{FOOTER_KEYFRAMES}</style>

      {/* Top gold accent line */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.5) 30%, rgba(212,175,55,0.8) 50%, rgba(212,175,55,0.5) 70%, transparent 95%)",
        }}
      />

      <div className="container mx-auto px-5 sm:px-6 pt-8 sm:pt-10 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 text-center">

          {/* ── Brand column — frameless gold identity ── */}
          <div className="flex flex-col items-center gap-3">
            {/* Logo: circle with dark bg + gold ring, logo fills circle (no empty space) */}
            <div
              style={{
                width: 72, height: 72,
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0,
                background: "radial-gradient(circle at 40% 35%, #1E0D38 0%, #06040C 100%)",
                animation: "ft-logo-float 4.5s ease-in-out infinite",
                willChange: "transform, box-shadow",
              }}
            >
              <img
                src={BRAND.logo}
                alt={BRAND.name}
                width={72}
                height={72}
                loading="lazy"
                decoding="async"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>

            {/* Brand name — luxury editorial style */}
            <div className="flex flex-col items-center gap-1.5">
              <span
                style={{
                  fontFamily:    "var(--font-luxury, 'Cormorant Garamond', Georgia, serif)",
                  fontSize:      "clamp(24px, 5.5vw, 30px)",
                  fontWeight:    300,
                  letterSpacing: "0.08em",
                  lineHeight:    1,
                  background:    "linear-gradient(135deg, #FFFFFF 0%, #FFF8E1 45%, #E5C76B 80%, #D4AF37 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor:  "transparent",
                  backgroundClip: "text",
                }}
              >
                {BRAND.name}
              </span>

              {/* Thin gold separator under name */}
              <div
                aria-hidden="true"
                style={{
                  width: 40, height: 1,
                  background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)",
                  borderRadius: 1,
                }}
              />

              <span
                style={{
                  fontFamily:    "var(--font-ui, 'Jost', 'DM Sans', sans-serif)",
                  fontSize:      9,
                  fontWeight:    400,
                  fontStyle:     "italic",
                  letterSpacing: "0.30em",
                  textTransform: "uppercase" as const,
                  color:         "rgba(212,175,55,0.60)",
                  lineHeight:    1,
                }}
              >
                {BRAND.tagline}
              </span>
            </div>

            <p
              style={{
                fontFamily:  "var(--font-ui, 'Jost', 'DM Sans', sans-serif)",
                fontSize:    12,
                color:       "rgba(255,255,255,0.40)",
                lineHeight:  1.65,
                maxWidth:    200,
                textAlign:   "center",
              }}
            >
              L&apos;art de la crêpe à Nabeul —{" "}
              <span style={{ color: "rgba(212,175,55,0.50)" }}>
                saveurs authentiques
              </span>
              , ingrédients frais, livré chez vous.
            </p>
          </div>

          {/* ── Contact column ── */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-crepe-gold/80 mb-0.5">
              Contact
            </span>
            <div className="flex flex-col gap-2.5">
              <a
                href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                className="group/c flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <span className="flex items-center justify-center h-8 w-8 rounded-full border border-white/15 group-hover/c:border-crepe-gold/50 bg-white/[0.04] group-hover/c:bg-crepe-gold/10 transition-all duration-200 shrink-0">
                  <Phone className="h-3.5 w-3.5 text-white/60 group-hover/c:text-crepe-gold transition-colors duration-200" />
                </span>
                <span className="text-[13px] text-white/70 group-hover/c:text-crepe-gold transition-colors duration-200 font-medium">
                  {CONTACT.phone}
                </span>
              </a>

              <a
                href={`https://wa.me/${CONTACT.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group/c flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <span className="flex items-center justify-center h-8 w-8 rounded-full border border-white/15 group-hover/c:border-crepe-gold/50 bg-white/[0.04] group-hover/c:bg-crepe-gold/10 transition-all duration-200 shrink-0">
                  <MessageCircle className="h-3.5 w-3.5 text-white/60 group-hover/c:text-crepe-gold transition-colors duration-200" />
                </span>
                <span className="text-[13px] text-white/70 group-hover/c:text-crepe-gold transition-colors duration-200 font-medium">
                  WhatsApp
                </span>
              </a>

              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center h-8 w-8 rounded-full border border-white/15 bg-white/[0.04] shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-white/60" />
                </span>
                <span className="text-[13px] text-white/50 font-medium">{CONTACT.address}</span>
              </div>
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
                  aria-label={`${label} — ${BRAND.name}`}
                  className="group/s flex items-center justify-center h-10 w-10 rounded-full border border-white/15 hover:border-crepe-gold/60 bg-white/[0.04] hover:bg-crepe-gold/10 transition-all duration-200 cursor-pointer"
                >
                  <Icon className="h-[18px] w-[18px] text-white/70 group-hover/s:text-crepe-gold transition-colors duration-200" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ Divider — double shimmer ═══ */}
        <div aria-hidden="true" className="my-6 relative flex flex-col items-center gap-[3px]">
          <div
            className="absolute inset-x-[10%] top-1/2 -translate-y-1/2"
            style={{
              height: "6px", borderRadius: "3px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.15) 25%, rgba(212,175,55,0.45) 50%, rgba(212,175,55,0.15) 75%, transparent 100%)",
              animation: "ft-line-pulse 3s ease-in-out infinite",
            }}
          />
          <div
            style={{
              width: "100%", height: "1.5px", borderRadius: "1px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.15) 10%, rgba(212,175,55,0.55) 35%, rgba(255,255,255,0.95) 50%, rgba(212,175,55,0.55) 65%, rgba(212,175,55,0.15) 90%, transparent 100%)",
              animation: "ft-line-shimmer 4s ease-in-out infinite",
              willChange: "transform, opacity",
            }}
          />
          <div
            style={{
              width: "50%", height: "1px", borderRadius: "1px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.08) 15%, rgba(212,175,55,0.35) 40%, rgba(255,248,225,0.55) 50%, rgba(212,175,55,0.35) 60%, rgba(212,175,55,0.08) 85%, transparent 100%)",
              animation: "ft-line-shimmer 4s ease-in-out infinite 0.4s",
              willChange: "transform, opacity",
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
            © 2021{" "}
            <span
              style={{
                fontFamily: "var(--font-luxury, 'Cormorant Garamond', Georgia, serif)",
                fontSize: 13,
                fontWeight: 400,
                background: "linear-gradient(90deg, #E5C76B, #D4AF37)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {BRAND.name}
            </span>
          </span>

          <div className="flex items-center gap-1.5 text-white/45">
            <a
              href="https://marwen-rabai.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-crepe-gold/70 hover:text-crepe-gold transition-colors cursor-pointer"
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
