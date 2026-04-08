import { Clock, UtensilsCrossed, MessageCircle } from "lucide-react";
import AuthLogo from "./AuthLogo";

type Variant = "signin" | "register";

interface LeftPanelProps {
  variant: Variant;
}

const FEATURES = [
  {
    icon:  <Clock size={18} />,
    title: "Livraison 30 min à Nabeul",
    desc:  "Du port jusqu'à votre porte — encore fumante sortie de la plancha.",
  },
  {
    icon:  <UtensilsCrossed size={18} />,
    title: "Garnie à la commande",
    desc:  "Chaque crêpe pliée à l'instant. Jamais réchauffée, jamais en avance.",
  },
  {
    icon:  <MessageCircle size={18} />,
    title: "Suivi WhatsApp en direct",
    desc:  "Confirmez votre adresse, suivez la livraison. Tout dans une conversation.",
  },
] as const;

const AVATARS = [
  { bg: "#7C3AED", initials: "A" },
  { bg: "#5B21B6", initials: "M" },
  { bg: "#D97706", initials: "S" },
  { bg: "#10B981", initials: "R" },
] as const;

const HEADLINE: Record<Variant, string> = {
  signin:   "La douceur\ncommence ici.",
  register: "Ta première\ncrêpe t'attend.",
};

const SUBLINE: Record<Variant, string> = {
  signin:   "Quelques secondes pour commander, quelques minutes pour déguster.",
  register: "Crée ton compte en un instant. Commande des crêpes pour toujours.",
};

/**
 * LeftPanel — desktop-only branding column (hidden below the md breakpoint).
 *
 * Content: animated logo · headline + subtitle · 3 feature bullets · avatar stack.
 * All copy is specific to Crêpe Time Nabeul — not generic template text.
 */
const LeftPanel = ({ variant }: LeftPanelProps) => (
  <aside
    className="hidden md:flex flex-col justify-center items-center md:w-1/2 min-h-[100dvh] px-12 py-16"
    aria-hidden="true"
  >
    <div className="max-w-[340px] w-full flex flex-col gap-10">

      {/* Logo */}
      <AuthLogo />

      {/* Headline + subtitle */}
      <div>
        <h2
          style={{
            fontFamily:    "var(--font-display, 'Syne', sans-serif)",
            fontSize:      36,
            fontWeight:    800,
            lineHeight:    1.12,
            letterSpacing: "-0.035em",
            color:         "#FAFAFA",
            whiteSpace:    "pre-line",
          }}
        >
          {HEADLINE[variant]}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
            fontSize:   15,
            color:      "#6B6B8A",
            marginTop:  10,
            lineHeight: 1.65,
          }}
        >
          {SUBLINE[variant]}
        </p>
      </div>

      {/* Feature bullets */}
      <div className="flex flex-col gap-5">
        {FEATURES.map((f, i) => (
          <div key={i} className="flex items-start gap-4">
            <div
              style={{
                width:          38,
                height:         38,
                borderRadius:   11,
                flexShrink:     0,
                background:     "rgba(124,58,237,0.12)",
                border:         "1px solid rgba(139,92,246,0.22)",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                color:          "#8B5CF6",
              }}
            >
              {f.icon}
            </div>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                  fontSize:   14,
                  fontWeight: 600,
                  color:      "#C4C4D4",
                  lineHeight: 1.3,
                }}
              >
                {f.title}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                  fontSize:   12,
                  color:      "#6B6B8A",
                  marginTop:  3,
                  lineHeight: 1.55,
                }}
              >
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Avatar stack + social proof */}
      <div className="flex items-center gap-3">
        <div className="flex" style={{ isolation: "isolate" }}>
          {AVATARS.map((av, i) => (
            <div
              key={i}
              style={{
                width:          32,
                height:         32,
                borderRadius:   "50%",
                background:     av.bg,
                border:         "2px solid var(--depth-1, #0C0C1E)",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                marginLeft:     i > 0 ? -10 : 0,
                zIndex:         i,
                fontFamily:     "var(--font-display, 'Syne', sans-serif)",
                fontSize:       11,
                fontWeight:     700,
                color:          "#FAFAFA",
              }}
            >
              {av.initials}
            </div>
          ))}
        </div>

        <p
          style={{
            fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
            fontSize:   12,
            color:      "#6B6B8A",
            lineHeight: 1.45,
          }}
        >
          <span style={{ color: "#FCD34D", fontWeight: 600 }}>
            +240 crêpes livrées
          </span>{" "}
          cette semaine · Nabeul
        </p>
      </div>

    </div>
  </aside>
);

export default LeftPanel;
