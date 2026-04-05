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

const Footer = () => {
  return (
    <footer className="bg-crepe-purple">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Main row - compact */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
          {/* Brand — centered signature stamp */}
          <div className="flex flex-col items-center gap-3">
            {/* Logo — centered above the text mark */}
            <div className="relative shrink-0 transition-transform duration-300 hover:scale-105">
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-xl overflow-hidden ring-2 ring-crepe-gold/50 shadow-lg bg-white/10">
                <img
                  src={BRAND.logo}
                  alt={BRAND.name}
                  width={56}
                  height={56}
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

            {/*
             * Centered brand text mark
             * — All children are items-center so name / hairline / tagline
             *   share the same optical axis as the logo above.
             * — Hairline expands from center outward (transformOrigin: center,
             *   symmetric gradient) to match the centered composition.
             */}
            <div className="group flex flex-col items-center gap-1.5 cursor-default">
              {/* ── Brand name with shine sweep ── */}
              <div className="relative overflow-hidden leading-tight">
                <span
                  className="font-heading font-black block"
                  style={{
                    fontSize: "clamp(1.4rem, 2.6vw, 1.95rem)",
                    letterSpacing: "-0.035em",
                    background:
                      "linear-gradient(135deg, #E5C76B 0%, #D4AF37 22%, #FFFFFF 50%, #E5C76B 78%, #C9A227 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 1px 14px rgba(212,175,55,0.55))",
                  }}
                >
                  {BRAND.name}
                </span>

                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 pointer-events-none -translate-x-[120%] group-hover:translate-x-[260%] transition-transform duration-700 ease-out"
                  style={{
                    width: "55%",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    transform: "skewX(-18deg)",
                  }}
                />
              </div>

              {/* ── Hairline — expands symmetrically from center ── */}
              <span
                aria-hidden="true"
                className="block h-px w-full scale-x-50 opacity-50 group-hover:scale-x-100 group-hover:opacity-90 transition-all duration-500"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(212,175,55,0.7), transparent)",
                  transformOrigin: "center",
                }}
              />

              {/* ── Tagline ── */}
              <span className="flex items-center gap-2 opacity-70 translate-y-0 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-all duration-300">
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

          {/* Contact + Social inline */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            <div className="flex flex-col gap-1.5">
              <span className="text-crepe-gold/90 text-xs font-semibold uppercase tracking-wider">Contact</span>
              <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-white/90 hover:text-crepe-gold text-sm transition-colors min-h-[44px] py-1">
                <Phone className="h-3.5 w-3.5" />
                {CONTACT.phone}
              </a>
              <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/90 hover:text-crepe-gold text-sm transition-colors min-h-[44px] py-1">
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
              <span className="flex items-center gap-2 text-white/80 text-sm min-h-[44px] py-1">
                <MapPin className="h-3.5 w-3.5" />
                {CONTACT.address}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-crepe-gold/90 text-xs font-semibold uppercase tracking-wider">Suivez-nous</span>
              <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/90 hover:text-crepe-gold text-sm transition-colors min-h-[44px] py-1">
                <Instagram className="h-3.5 w-3.5" />
                Crêpe Time
              </a>
              <a href={`https://tiktok.com/@${CONTACT.tiktok}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/90 hover:text-crepe-gold text-sm transition-colors min-h-[44px] py-1">
                <TikTokIcon className="h-3.5 w-3.5" />
                Crêpe Time
              </a>
              <a href={CONTACT.facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/90 hover:text-crepe-gold text-sm transition-colors min-h-[44px] py-1">
                <Facebook className="h-3.5 w-3.5" />
                Crêpe Time
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar - compact */}
        <div className="mt-5 pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs">
            <span className="text-white/60 hover:text-crepe-gold cursor-pointer transition-colors">Politique de confidentialité</span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span className="text-white/60 hover:text-crepe-gold cursor-pointer transition-colors">Conditions d&apos;utilisation</span>
          </div>
          <div className="flex flex-col sm:items-end gap-1 text-xs">
            <span className="text-white/80">© 2021 <span className="text-crepe-gold font-semibold">Crêpe Time</span>. Tous droits réservés.</span>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-1.5 text-white/70">
              <a href="https://marwen-rabai.netlify.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-crepe-gold hover:text-crepe-gold-light font-medium transition-colors" title="Digital Architect & Event Designer">
                <Heart className="h-3 w-3 fill-current" />
                Digital Team
              </a>
              <span className="text-white/40">•</span>
              <Code2 className="h-3.5 w-3.5 text-crepe-gold/80" />
              <span>Built with passion & precision</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
