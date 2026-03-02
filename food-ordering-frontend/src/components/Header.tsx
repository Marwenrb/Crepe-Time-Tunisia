import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import MobileNav from "./MobileNav";
import MainNav from "./MainNav";
import { BRAND } from "@/config/brand";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`
        relative sticky top-0 z-50 h-14 sm:h-16 md:h-[72px] flex items-center shrink-0
        transition-all duration-300 ease-out
        bg-white/90 sm:bg-white/95 backdrop-blur-xl
        border-b border-crepe-gold/20
        ${scrolled ? "shadow-header-scrolled border-crepe-purple/5" : "shadow-header"}
      `}
    >
      {/* Premium gradient accent */}
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-crepe-gold to-transparent opacity-60" />

      <div className="container relative mx-auto flex justify-between items-center w-full px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex items-center gap-3 sm:gap-4 shrink-0 min-w-0 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
        >
          {/* Logo — premium container with subtle glow */}
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-crepe-gold/30 to-crepe-purple/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-xl overflow-hidden ring-2 ring-crepe-gold/50 ring-offset-2 ring-offset-white shadow-lg shadow-crepe-purple/5 transition-all duration-300 group-hover:ring-crepe-gold group-hover:shadow-crepe-gold/20">
              <img
                src={BRAND.logo}
                alt={BRAND.name}
                className="h-full w-full object-cover object-center"
                loading="eager"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.src = "/logo.png";
                  el.onerror = () => { el.style.display = "none"; };
                }}
              />
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
