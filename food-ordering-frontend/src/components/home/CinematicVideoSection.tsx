import { memo, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroVideo from "@/assets/hero/Golden_Crêpe_Video_Generation.mp4";

const KEYFRAMES = `
  @keyframes cvs-fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes cvs-glow-pulse {
    0%, 100% { box-shadow: 0 0 20px rgba(212,175,55,0.3), 0 0 60px rgba(212,175,55,0.1); }
    50%      { box-shadow: 0 0 30px rgba(212,175,55,0.5), 0 0 80px rgba(212,175,55,0.15); }
  }
`;

const CinematicVideoSection = () => {
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

  return (
    <section className="relative min-h-[80vh] md:h-screen w-full overflow-hidden">
      <style>{KEYFRAMES}</style>

      {/* ── Background video ── */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        preload="metadata"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* ── Cinematic overlay — dark gradient + glassmorphism ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,10,31,0.55) 0%, rgba(15,10,31,0.35) 30%, rgba(15,10,31,0.5) 60%, rgba(15,10,31,0.85) 100%)",
          backdropFilter: "blur(1.5px)",
          WebkitBackdropFilter: "blur(1.5px)",
        }}
      />

      {/* ── Content layer ── */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[80vh] md:min-h-screen px-5 text-center">
        {/* Tagline chip */}
        <span
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase mb-6"
          style={{
            background: "rgba(212,175,55,0.12)",
            border: "1px solid rgba(212,175,55,0.25)",
            color: "#E5C76B",
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-crepe-gold animate-pulse" />
          Crêpe Time Cinema
        </span>

        {/* Title */}
        <h2
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight max-w-4xl"
          style={{
            background:
              "linear-gradient(135deg, #FFFFFF 0%, #FFF8E1 35%, #E5C76B 65%, #D4AF37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 2px 12px rgba(212,175,55,0.25))",
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s ease-out 0.15s, transform 0.8s ease-out 0.15s",
          }}
        >
          The Sweetest Escape
        </h2>

        {/* Subtitle */}
        <p
          className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/80 max-w-lg leading-relaxed font-light"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease-out 0.35s, transform 0.8s ease-out 0.35s",
          }}
        >
          Savourez l&apos;art de la crêpe artisanale — des saveurs dorées,
          livrées à votre porte avec élégance.
        </p>

        {/* CTA Button */}
        <div
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease-out 0.55s, transform 0.8s ease-out 0.55s",
          }}
        >
          <Link
            to="/search/Nabeul"
            className="group mt-8 sm:mt-10 inline-flex items-center gap-2 px-7 py-3 sm:px-9 sm:py-3.5 rounded-full text-sm sm:text-base font-bold tracking-wide text-crepe-dark transition-all duration-300 hover:scale-[1.04] active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg, #D4AF37 0%, #E5C76B 50%, #D4AF37 100%)",
              boxShadow:
                "0 0 20px rgba(212,175,55,0.3), 0 0 60px rgba(212,175,55,0.1), 0 4px 16px rgba(0,0,0,0.3)",
              animation: "cvs-glow-pulse 3s ease-in-out infinite",
            }}
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
          </Link>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{
            opacity: isLoaded ? 0.6 : 0,
            transition: "opacity 1s ease-out 1s",
          }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-medium">
            Scroll
          </span>
          <div className="h-8 w-[1.5px] bg-gradient-to-b from-crepe-gold/60 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default memo(CinematicVideoSection);
