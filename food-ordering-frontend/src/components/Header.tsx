import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import MobileNav from "./MobileNav";
import MainNav from "./MainNav";
import { BRAND } from "@/config/brand";

const HEADER_KEYFRAMES = `
  @keyframes hdr-rotate-border {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes hdr-glow-breathe {
    0%, 100% { box-shadow: 0 0 8px rgba(212,175,55,0.25), 0 0 20px rgba(212,175,55,0.08); }
    50%      { box-shadow: 0 0 14px rgba(212,175,55,0.4), 0 0 28px rgba(212,175,55,0.12); }
  }
  .hdr-logo-ring { animation: hdr-glow-breathe 3.5s ease-in-out infinite; }
`;

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 12);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`
        relative sticky top-0 z-50 h-14 sm:h-16 md:h-[72px] flex items-center shrink-0
        transition-[background-color,border-color] duration-300 ease-out
        bg-white/90 sm:bg-white/95 backdrop-blur-xl
        border-b border-crepe-gold/20
        ${scrolled ? "shadow-header-scrolled border-crepe-purple/5" : "shadow-header"}
      `}
    >
      <style>{HEADER_KEYFRAMES}</style>

      {/* Premium gradient accent */}
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-crepe-gold to-transparent opacity-60" />

      <div className="container relative mx-auto flex justify-between items-center w-full px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex items-center gap-3 sm:gap-4 shrink-0 min-w-0 transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99]"
        >
          {/* Logo — Uiverse rotating conic-gradient border ring */}
          <div className="relative flex-shrink-0">
            {/* Rotating conic border container */}
            <div
              className="hdr-logo-ring relative rounded-2xl overflow-hidden"
              style={{ padding: 2 }}
            >
              {/* Spinning conic gradient layer */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: "-120%",
                  background:
                    "conic-gradient(from 0deg, #D4AF37, transparent 18%, #7C3AED 38%, transparent 58%, #EDD060 78%, #D4AF37)",
                  animation: "hdr-rotate-border 4s linear infinite",
                  willChange: "transform",
                }}
              />
              {/* Inner logo container */}
              <div className="relative h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-xl overflow-hidden bg-white">
                <img
                  src={BRAND.logo}
                  alt={BRAND.name}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover object-center"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.src = "/logo.png";
                    el.onerror = () => { el.style.display = "none"; };
                  }}
                />
              </div>
            </div>
          </div>
          {/* Brand text */}
          <div className="flex flex-col min-w-0">
            <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-crepe-purple leading-tight truncate transition-colors duration-200 group-hover:text-crepe-purple-light">
              {BRAND.name}
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.25em] text-crepe-gold uppercase leading-tight hidden xs:block opacity-90">
              {BRAND.tagline}
            </span>
          </div>
        </Link>

        <div className="md:hidden shrink-0">
          <MobileNav />
        </div>
        <div className="hidden md:block">
          <MainNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
