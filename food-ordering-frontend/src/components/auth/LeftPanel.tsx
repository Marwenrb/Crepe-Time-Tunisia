import { Clock, UtensilsCrossed, MessageCircle } from "lucide-react";
import AuthLogo from "./AuthLogo";

type Variant = "signin" | "register";

interface LeftPanelProps {
  variant: Variant;
}

const FEATURES = [
  {
    icon: <Clock size={18} />,
    eyebrow: "Express cadence",
    title: "Livraison 30 min a Nabeul",
    desc: "Du port jusqu'a votre porte - encore fumante sortie de la plancha.",
    accent: "#D4AF37",
    glow: "rgba(212,175,55,0.18)",
  },
  {
    icon: <UtensilsCrossed size={18} />,
    eyebrow: "Made to order",
    title: "Garnie a la commande",
    desc: "Chaque crepe pliee a l'instant. Jamais rechauffee, jamais en avance.",
    accent: "#A78BFA",
    glow: "rgba(124,58,237,0.18)",
  },
  {
    icon: <MessageCircle size={18} />,
    eyebrow: "Live reassurance",
    title: "Suivi WhatsApp en direct",
    desc: "Confirmez votre adresse, suivez la livraison. Tout dans une conversation.",
    accent: "#34D399",
    glow: "rgba(16,185,129,0.16)",
  },
] as const;

const AVATARS = [
  { bg: "#7C3AED", initials: "A" },
  { bg: "#5B21B6", initials: "M" },
  { bg: "#D97706", initials: "S" },
  { bg: "#10B981", initials: "R" },
] as const;

const HEADLINE: Record<Variant, string> = {
  signin: "La douceur\ncommence ici.",
  register: "Ta premiere\ncrepe t'attend.",
};

const SUBLINE: Record<Variant, string> = {
  signin: "Quelques secondes pour commander, quelques minutes pour deguster.",
  register: "Cree ton compte en un instant. Commande des crepes pour toujours.",
};

const LeftPanel = ({ variant }: LeftPanelProps) => {
  const headlineLines = HEADLINE[variant].split("\n");

  return (
    <aside
      className="hidden md:flex flex-col justify-center items-center md:w-1/2 min-h-[100dvh] px-12 py-16"
      aria-hidden="true"
    >
      <div className="max-w-[430px] w-full flex flex-col gap-8">
        <AuthLogo />

        <section
          className="relative overflow-hidden rounded-[34px] px-6 py-6"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 60px rgba(4,2,10,0.26), inset 0 1px 0 rgba(255,255,255,0.08)",
            backdropFilter: "blur(18px)",
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.55) 45%, transparent 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute -right-10 top-6 h-28 w-28 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(212,175,55,0.24) 0%, transparent 70%)",
              filter: "blur(8px)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute -left-14 bottom-0 h-32 w-32 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 72%)",
              filter: "blur(10px)",
            }}
          />

          <div className="relative flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.24em]"
                style={{
                  borderColor: "rgba(212,175,55,0.28)",
                  color: "#FCD34D",
                  background: "rgba(255,255,255,0.04)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                }}
              >
                Signature delivery ritual
              </span>
              <span
                className="text-[11px] uppercase tracking-[0.26em]"
                style={{ color: "rgba(255,255,255,0.42)" }}
              >
                Nabeul after-dark collection
              </span>
            </div>

            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display, 'Syne', sans-serif)",
                  fontSize: 42,
                  fontWeight: 800,
                  lineHeight: 1.03,
                  letterSpacing: "-0.04em",
                  color: "#FAFAFA",
                }}
              >
                {headlineLines.map((line, index) => (
                  <span
                    key={line}
                    style={{
                      display: "block",
                      ...(index === 1
                        ? {
                            background: "linear-gradient(135deg, #FAFAFA 0%, #FCD34D 68%, #F59E0B 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }
                        : {}),
                    }}
                  >
                    {line}
                  </span>
                ))}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                  fontSize: 15,
                  color: "rgba(255,255,255,0.68)",
                  marginTop: 14,
                  lineHeight: 1.7,
                  maxWidth: "33ch",
                }}
              >
                {SUBLINE[variant]}
              </p>
            </div>

            <div className="grid gap-3">
              {FEATURES.map((feature, index) => (
                <article
                  key={feature.title}
                  className="relative overflow-hidden rounded-[24px] px-4 py-4"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.025) 100%)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 18px 40px rgba(5,2,14,0.16)",
                    backdropFilter: "blur(14px)",
                  }}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent 0%, ${feature.accent} 45%, transparent 100%)`,
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute -right-8 -top-8 h-24 w-24 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${feature.glow} 0%, transparent 72%)`,
                    }}
                  />

                  <div className="relative flex items-start gap-4">
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 14,
                        flexShrink: 0,
                        background: `linear-gradient(180deg, ${feature.glow} 0%, rgba(255,255,255,0.04) 100%)`,
                        border: `1px solid ${feature.accent}33`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: feature.accent,
                        boxShadow: `0 14px 28px ${feature.glow}`,
                      }}
                    >
                      {feature.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span
                          className="text-[10px] uppercase tracking-[0.26em]"
                          style={{ color: feature.accent }}
                        >
                          {feature.eyebrow}
                        </span>
                        <span
                          className="h-px flex-1"
                          style={{ background: "rgba(255,255,255,0.08)" }}
                        />
                        <span
                          className="text-[10px] font-medium"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <p
                        style={{
                          fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#F4F0FF",
                          lineHeight: 1.35,
                        }}
                      >
                        {feature.title}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                          fontSize: 12.5,
                          color: "rgba(255,255,255,0.58)",
                          marginTop: 6,
                          lineHeight: 1.6,
                        }}
                      >
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div
              className="grid grid-cols-[auto_1fr] gap-4 rounded-[26px] px-4 py-4"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex flex-col justify-center">
                <div className="flex" style={{ isolation: "isolate" }}>
                  {AVATARS.map((avatar, index) => (
                    <div
                      key={index}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: avatar.bg,
                        border: "2px solid rgba(12,12,30,0.95)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: index > 0 ? -10 : 0,
                        zIndex: AVATARS.length - index,
                        fontFamily: "var(--font-display, 'Syne', sans-serif)",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#FAFAFA",
                        boxShadow: "0 10px 24px rgba(0,0,0,0.24)",
                      }}
                    >
                      {avatar.initials}
                    </div>
                  ))}
                </div>
              </div>

              <div className="min-w-0">
                <p
                  className="text-[10px] uppercase tracking-[0.26em]"
                  style={{ color: "rgba(255,255,255,0.42)" }}
                >
                  Cette semaine
                </p>
                <div className="flex items-end gap-2 mt-1">
                  <span
                    style={{
                      fontFamily: "var(--font-display, 'Syne', sans-serif)",
                      fontSize: 30,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      color: "#FCD34D",
                    }}
                  >
                    +240
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#F4F0FF",
                    }}
                  >
                    crepes livrees
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.56)",
                    marginTop: 5,
                    lineHeight: 1.55,
                  }}
                >
                  Nabeul suit le rythme. Toujours minute, jamais standard.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
};

export default LeftPanel;
