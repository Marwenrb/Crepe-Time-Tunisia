import { Phone, MessageCircle, Instagram, Facebook, MapPin, Heart, Code2 } from "lucide-react";
import { motion } from "framer-motion";
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
          {/* Brand — official logo */}
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-xl overflow-hidden ring-2 ring-crepe-gold/50 shadow-lg bg-white/10">
              <img
                src={BRAND.logo}
                alt={BRAND.name}
                className="h-full w-full object-cover object-center"
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
            {/*
             * Premium brand signature
             * — Motion variant system drives coordinated hover choreography:
             *   1. Shine sweep scrolls left→right across the brand name
             *   2. Hairline expands from origin-left to full width
             *   3. Tagline lifts 2px + opacity boost
             * — cursor-default prevents text-cursor on the lockup
             */}
            <motion.div
              className="flex flex-col gap-0.5 cursor-default"
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              {/* ── Brand name with shine sweep ── */}
              <div className="relative overflow-hidden inline-block leading-none">
                <span
                  className="font-heading font-black block"
                  style={{
                    fontSize: "clamp(1.35rem, 2.4vw, 1.85rem)",
                    letterSpacing: "-0.03em",
                    background:
                      "linear-gradient(135deg, #E5C76B 0%, #D4AF37 22%, #FFFFFF 50%, #E5C76B 78%, #C9A227 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 1px 12px rgba(212,175,55,0.5))",
                  }}
                >
                  {BRAND.name}
                </span>

                {/*
                 * Shine overlay — starts 110% left of its own width (off-screen left),
                 * slides to 210% on hover (off-screen right).
                 * Parent overflow-hidden clips it cleanly.
                 */}
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-y-0 pointer-events-none"
                  style={{
                    width: "55%",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.38), transparent)",
                    skewX: -18,
                  }}
                  variants={{
                    rest: { x: "-120%" },
                    hover: { x: "260%" },
                  }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              {/* ── Expanding hairline ── */}
              <motion.span
                aria-hidden="true"
                className="block h-px"
                style={{
                  background:
                    "linear-gradient(to right, rgba(212,175,55,0.65), transparent)",
                  transformOrigin: "left",
                }}
                variants={{
                  rest: { scaleX: 0.55, opacity: 0.45 },
                  hover: { scaleX: 1, opacity: 0.85 },
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* ── Tagline — lifts on hover ── */}
              <motion.span
                className="flex items-center gap-1.5 mt-0.5"
                variants={{
                  rest: { y: 0, opacity: 0.65 },
                  hover: { y: -2, opacity: 1 },
                }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.span
                  aria-hidden="true"
                  className="text-[8px]"
                  style={{ color: "rgba(212,175,55,0.7)" }}
                  variants={{
                    rest: { rotate: 0 },
                    hover: { rotate: 72 },
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  ✦
                </motion.span>
                <span
                  className="text-[10px] sm:text-[11px] font-bold tracking-[0.26em] uppercase"
                  style={{ color: "rgba(212,175,55,0.85)" }}
                >
                  {BRAND.tagline}
                </span>
                <motion.span
                  aria-hidden="true"
                  className="text-[8px]"
                  style={{ color: "rgba(212,175,55,0.7)" }}
                  variants={{
                    rest: { rotate: 0 },
                    hover: { rotate: -72 },
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  ✦
                </motion.span>
              </motion.span>
            </motion.div>
          </div>

          {/* Contact + Social inline */}
          <div className="flex flex-wrap gap-6 sm:gap-8">
            <div className="flex flex-col gap-1.5">
              <span className="text-crepe-gold/90 text-xs font-semibold uppercase tracking-wider">Contact</span>
              <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-white/90 hover:text-crepe-gold text-sm transition-colors">
                <Phone className="h-3.5 w-3.5" />
                {CONTACT.phone}
              </a>
              <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/90 hover:text-crepe-gold text-sm transition-colors">
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
              <span className="flex items-center gap-2 text-white/80 text-sm">
                <MapPin className="h-3.5 w-3.5" />
                {CONTACT.address}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-crepe-gold/90 text-xs font-semibold uppercase tracking-wider">Suivez-nous</span>
              <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/90 hover:text-crepe-gold text-sm transition-colors">
                <Instagram className="h-3.5 w-3.5" />
                @{CONTACT.instagram}
              </a>
              <a href={`https://tiktok.com/@${CONTACT.tiktok}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/90 hover:text-crepe-gold text-sm transition-colors">
                <TikTokIcon className="h-3.5 w-3.5" />
                @{CONTACT.tiktok}
              </a>
              <a href={CONTACT.facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/90 hover:text-crepe-gold text-sm transition-colors">
                <Facebook className="h-3.5 w-3.5" />
                Facebook
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
            <span className="text-white/80">© {new Date().getFullYear()} <span className="text-crepe-gold font-semibold">Crêpe Time Tunisia</span>. Tous droits réservés.</span>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-1.5 text-white/70">
              <Code2 className="h-3.5 w-3.5 text-crepe-gold/80" />
              <span>Built with passion & precision</span>
              <span className="text-white/40">•</span>
              <a href="https://marwen-rabai.netlify.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-crepe-gold hover:text-crepe-gold-light font-medium transition-colors" title="Digital Architect & Event Designer">
                <Heart className="h-3 w-3 fill-current" />
                Marwen Rabai
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
