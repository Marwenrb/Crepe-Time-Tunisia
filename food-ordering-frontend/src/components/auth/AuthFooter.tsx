import { useState } from "react";
import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { BRAND } from "@/config/brand";

/* ── Social links ─────────────────────────────────────────────── */
const SOCIAL = [
  {
    label:  "Instagram",
    icon:   Instagram,
    href:   "https://www.instagram.com/crepe.time_nabeul?igsh=M3R2MXU4bzgwODZt",
  },
  {
    label:  "Facebook",
    icon:   Facebook,
    href:   "https://www.facebook.com/share/1CZt76ZdtW/?mibextid=wwXIfr",
  },
  {
    label:  "WhatsApp",
    icon:   MessageCircle,
    href:   "https://wa.me/21625799066",
  },
] as const;

/* ── AuthFooter — brand signature style (no card/border) ─────── */
const AuthFooter = () => {
  const [imgSrc, setImgSrc] = useState<string>(BRAND.logo);

  return (
    <footer
      className="relative z-10 pb-8 pt-4"
      aria-label={`${BRAND.name} — pied de page`}
    >
      {/* Thin gold separator line */}
      <div
        aria-hidden="true"
        className="mb-6 mx-auto"
        style={{
          width:      "60%",
          height:     1,
          background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.25) 30%, rgba(212,175,55,0.45) 50%, rgba(212,175,55,0.25) 70%, transparent 100%)",
        }}
      />

      <div className="flex flex-col items-center gap-3">

        {/* Logo + brand name — inline, no box */}
        <div className="flex items-center gap-2.5">
          <img
            src={imgSrc}
            alt={BRAND.name}
            width={24}
            height={24}
            loading="lazy"
            decoding="async"
            onError={() => setImgSrc("/logo.png")}
            style={{
              width:        24,
              height:       24,
              borderRadius: 6,
              objectFit:    "cover",
              filter:       "drop-shadow(0 2px 8px rgba(212,175,55,0.35))",
              flexShrink:   0,
            }}
          />
          <span
            style={{
              fontFamily:    "var(--font-luxury, 'Cormorant Garamond', Georgia, serif)",
              fontSize:      18,
              fontWeight:    400,
              letterSpacing: "0.06em",
              color:         "#E5C76B",
              lineHeight:    1,
            }}
          >
            {BRAND.name}
          </span>
        </div>

        {/* Tagline — italic gold, small caps feel */}
        <p
          style={{
            fontFamily:    "var(--font-ui, 'Jost', sans-serif)",
            fontSize:      11,
            fontStyle:     "italic",
            letterSpacing: "0.16em",
            color:         "rgba(212,175,55,0.60)",
            lineHeight:    1,
          }}
        >
          {BRAND.tagline}
        </p>

        {/* Social icons — gold opacity 0.5 */}
        <div className="flex items-center gap-4 mt-1">
          {SOCIAL.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label} — ${BRAND.name}`}
              className="flex items-center justify-center transition-all duration-200"
              style={{
                color:   "rgba(212,175,55,0.50)",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "rgba(212,175,55,0.90)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "rgba(212,175,55,0.50)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "rgba(212,175,55,0.90)";
                (e.currentTarget as HTMLAnchorElement).style.outline = "2px solid rgba(212,175,55,0.4)";
                (e.currentTarget as HTMLAnchorElement).style.outlineOffset = "3px";
                (e.currentTarget as HTMLAnchorElement).style.borderRadius = "4px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "rgba(212,175,55,0.50)";
                (e.currentTarget as HTMLAnchorElement).style.outline = "none";
              }}
            >
              <Icon size={15} />
            </a>
          ))}
        </div>

        {/* Copyright line */}
        <p
          style={{
            fontFamily:    "var(--font-ui, 'Jost', sans-serif)",
            fontSize:      10,
            letterSpacing: "0.06em",
            color:         "rgba(255,255,255,0.22)",
            marginTop:     2,
            textAlign:     "center",
          }}
        >
          © 2026 Crêpe Time Tunisia · Tous droits réservés
        </p>

      </div>
    </footer>
  );
};

export default AuthFooter;
