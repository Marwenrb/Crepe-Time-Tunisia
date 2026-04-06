import { memo, useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import heroVideo from "@/assets/hero/Golden_Crêpe_Video_Generation.mp4";

/* ── UIVerse-grade keyframes ─────────────────────────────────────────────── */
const KEYFRAMES = `
  @keyframes vhs-neon-breathe {
    0%, 100% { opacity: 0.85; transform: scale(1); }
    50%      { opacity: 1; transform: scale(1.02); }
  }
  @keyframes vhs-halo-breathe {
    0%, 100% { opacity: 0.35; transform: translate(-50%, -50%) scale(1); }
    50%      { opacity: 0.55; transform: translate(-50%, -50%) scale(1.08); }
  }
  @keyframes vhs-border-sweep {
    from { opacity: 0.7; transform: translateX(-10%); }
    to   { opacity: 1; transform: translateX(10%); }
  }
  @keyframes vhs-grain {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-2%, -2%); }
    20% { transform: translate(1%, 3%); }
    30% { transform: translate(-3%, 1%); }
    40% { transform: translate(3%, -1%); }
    50% { transform: translate(-1%, 2%); }
    60% { transform: translate(2%, -3%); }
    70% { transform: translate(-2%, 1%); }
    80% { transform: translate(1%, -2%); }
    90% { transform: translate(3%, 2%); }
  }
  @keyframes vhs-typewriter-cursor {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

/* ── Typewriter hook ──────────────────────────────────────────────────────── */
const TITLE_TEXT = "The Sweetest Escape";
const TYPE_SPEED = 70; // ms per character
const START_DELAY = 400; // ms after video loads

function useTypewriter(text: string, enabled: boolean) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, TYPE_SPEED);
      return () => clearInterval(interval);
    }, START_DELAY);
    return () => clearTimeout(timer);
  }, [text, enabled]);

  return { displayed, done };
}

/* ── Section ─────────────────────────────────────────────────────────────── */
const VideoHeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleLoaded = () => setIsLoaded(true);
    video.addEventListener("loadeddata", handleLoaded);
    if (video.readyState >= 2) setIsLoaded(true);
    return () => video.removeEventListener("loadeddata", handleLoaded);
  }, []);

  const { displayed, done } = useTypewriter(TITLE_TEXT, isLoaded);

  const show = (delay: number) => ({
    opacity: isLoaded ? 1 : 0,
    transform: isLoaded ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}s`,
  });

  return (
    <section className="relative min-h-[60vh] sm:min-h-[65vh] md:min-h-[75vh] w-full overflow-hidden">
      <style>{KEYFRAMES}</style>

      {/* ── Background video ── */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        poster="/hero-home.avif"
        className="absolute inset-0 h-full w-full object-cover"
        preload="none"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* ── Film-grain texture overlay ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          animation: "vhs-grain 0.5s steps(4) infinite",
          willChange: "transform",
        }}
      />

      {/* ── Premium overlay — deep gradient + soft glass ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,10,31,0.6) 0%, rgba(15,10,31,0.3) 35%, rgba(15,10,31,0.45) 65%, rgba(15,10,31,0.88) 100%)",
          backdropFilter: "blur(1px)",
          WebkitBackdropFilter: "blur(1px)",
        }}
      />

      {/* ── Ambient radial glow — centred warmth ── */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 w-[120%] aspect-square pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(76,29,149,0.06) 40%, transparent 70%)",
          animation: "vhs-halo-breathe 4s ease-in-out infinite",
          willChange: "opacity, transform",
        }}
      />

      {/* ── Content layer ── */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[60vh] sm:min-h-[65vh] md:min-h-[75vh] px-5 py-12 sm:py-16 text-center">

        {/* Brand chip — glassmorphic pill */}
        <span
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-[0.22em] uppercase mb-5 sm:mb-6"
          style={{
            background: "rgba(212,175,55,0.08)",
            border: "1px solid rgba(212,175,55,0.2)",
            color: "#E5C76B",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            ...show(0),
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: "#D4AF37",
              boxShadow: "0 0 6px rgba(212,175,55,0.6)",
            }}
          />
          Crêpe Time
        </span>

        {/* Title — typewriter gold gradient */}
        <h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight max-w-3xl"
          style={{
            background:
              "linear-gradient(135deg, #FFFFFF 0%, #FFF8E1 25%, #E5C76B 55%, #D4AF37 75%, #C9A227 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 2px 16px rgba(212,175,55,0.2))",
            minHeight: "1.15em",
            ...show(0),
          }}
        >
          {displayed}
          {!done && (
            <span
              aria-hidden="true"
              style={{
                display: "inline-block",
                width: "3px",
                height: "0.85em",
                marginLeft: "2px",
                verticalAlign: "text-bottom",
                background: "linear-gradient(180deg, #E5C76B, #D4AF37)",
                borderRadius: "2px",
                boxShadow: "0 0 8px rgba(212,175,55,0.5)",
                animation: "vhs-typewriter-cursor 0.6s steps(1) infinite",
              }}
            />
          )}
        </h2>

        {/* Subtitle */}
        <p
          className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-white/75 max-w-md leading-relaxed font-light"
          style={show(0.28)}
        >
          L&apos;art de la crêpe artisanale — saveurs dorées,
          livrées chez vous avec élégance.
        </p>

        {/* UIVerse neon-glow CTA */}
        <div className="relative mt-6 sm:mt-8" style={show(0.45)}>
          <Link
            to="/search/Nabeul"
            className="group relative inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-6 sm:py-2.5 rounded-full text-[0.7rem] sm:text-sm font-bold tracking-wide overflow-visible transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97]"
            style={{
              "--glow-color": "rgb(212, 175, 55)",
              "--glow-spread": "rgba(212, 175, 55, 0.4)",
              border: "0.1em solid var(--glow-color)",
              color: "var(--glow-color)",
              backgroundColor: "rgba(15, 10, 31, 0.7)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              textShadow: "0 0 0.5em var(--glow-color)",
              animation: "vhs-neon-breathe 3s ease-in-out infinite",
              boxShadow:
                "0 0 0.6em 0.15em var(--glow-color), 0 0 2.5em 0.6em var(--glow-spread), inset 0 0 0.5em 0.1em var(--glow-color)",
            } as React.CSSProperties}
          >
            Commander Maintenant
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>

            {/* UIVerse floor reflection */}
            <span
              aria-hidden="true"
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                top: "110%",
                width: "80%",
                height: "60%",
                background: "var(--glow-spread)",
                filter: "blur(1.2em)",
                opacity: 0.35,
                transform: "translateX(-50%) perspective(1em) rotateX(35deg) scale(1, 0.45)",
                borderRadius: "50%",
              }}
            />
          </Link>
        </div>

        {/* ── Animated border sweep at bottom ── */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-px"
          style={{
            backgroundImage:
              "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.1) 15%, rgba(212,175,55,0.5) 50%, rgba(212,175,55,0.1) 85%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "vhs-border-sweep 5s linear infinite",
          }}
        />

        {/* Scroll indicator — compact */}
        <div
          className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          style={{
            opacity: isLoaded ? 0.5 : 0,
            transition: "opacity 0.8s ease-out 0.8s",
          }}
        >
          <div className="h-6 w-[1px] bg-gradient-to-b from-crepe-gold/50 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default memo(VideoHeroSection);
