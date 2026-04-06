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

const Footer = () => {
  return (
    <footer
      className="relative"
      style={{
        background: "linear-gradient(180deg, #3B0764 0%, #2D064E 50%, #1A0A2E 100%)",
      }}
    >
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">

          {/* ── Brand column — UIVerse neon glow ── */}
          <div className="flex flex-col items-center sm:items-start gap-3">
            <div className="flex items-center gap-3">
              <div
                className="relative h-12 w-12 rounded-xl overflow-hidden bg-white/5"
                style={{
                  boxShadow: "0 0 12px rgba(212,175,55,0.5), 0 0 28px rgba(212,175,55,0.18), inset 0 0 6px rgba(212,175,55,0.12)",
                  border: "1.5px solid rgba(212,175,55,0.55)",
                }}
              >
                <img
                  src={BRAND.logo}
                  alt={BRAND.name}
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
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
              <div>
                <span
                  className="font-heading font-black block text-xl leading-tight"
                  style={{
                    background: "linear-gradient(135deg, #E5C76B 0%, #D4AF37 22%, #FFFFFF 50%, #E5C76B 78%, #C9A227 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 10px rgba(212,175,55,0.6))",
                  }}
                >
                  {BRAND.name}
                </span>
                <span
                  className="text-[10px] font-bold tracking-[0.25em] uppercase block mt-0.5"
                  style={{
                    color: "rgba(212,175,55,0.85)",
                    textShadow: "0 0 14px rgba(212,175,55,0.4)",
                  }}
                >
                  ✦ {BRAND.tagline} ✦
                </span>
              </div>
            </div>

            <p className="text-white/50 text-xs leading-relaxed max-w-[220px] text-center sm:text-left mt-1">
              L&apos;art de la crêpe à Nabeul — saveurs authentiques, ingrédients frais, livré chez vous.
            </p>
          </div>

          {/* ── Contact column ── */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-crepe-gold/80 mb-1">
              Contact
            </span>
            <a
              href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2.5 text-white/80 hover:text-crepe-gold text-sm transition-colors duration-200 min-h-[40px]"
            >
              <Phone className="h-4 w-4 shrink-0 opacity-60" />
              <span>{CONTACT.phone}</span>
            </a>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-white/80 hover:text-crepe-gold text-sm transition-colors duration-200 min-h-[40px]"
            >
              <MessageCircle className="h-4 w-4 shrink-0 opacity-60" />
              <span>WhatsApp</span>
            </a>
            <div className="flex items-center gap-2.5 text-white/60 text-sm min-h-[40px]">
              <MapPin className="h-4 w-4 shrink-0 opacity-60" />
              <span>{CONTACT.address}</span>
            </div>
          </div>

          {/* ── Social column ── */}
          <div className="flex flex-col items-center sm:items-start gap-2">
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
                  aria-label={`${label} — @${CONTACT.instagram}`}
                  className="group/s flex items-center justify-center h-10 w-10 rounded-full border border-white/15 hover:border-crepe-gold/60 bg-white/[0.04] hover:bg-crepe-gold/10 transition-all duration-250"
                >
                  <Icon className="h-4.5 w-4.5 text-white/70 group-hover/s:text-crepe-gold transition-colors duration-200" />
                </a>
              ))}
            </div>
            <p className="text-white/40 text-xs mt-1">
              @{CONTACT.instagram}
            </p>
          </div>
        </div>

        {/* ═══ Divider — gold neon glow ═══ */}
        <div
          aria-hidden="true"
          className="my-6 h-px"
          style={{
            background: "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.35) 20%, rgba(212,175,55,0.7) 50%, rgba(212,175,55,0.35) 80%, transparent 95%)",
            boxShadow: "0 0 8px rgba(212,175,55,0.3), 0 0 24px rgba(212,175,55,0.1)",
          }}
        />

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
