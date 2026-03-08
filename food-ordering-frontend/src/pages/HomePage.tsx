import { memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SearchBar, { SearchForm } from "@/components/SearchBar";
import BrandMarquee from "@/components/home/BrandMarquee";
import CrepeHighlightsSection from "@/components/home/CrepeHighlightsSection";
import TestimonialCarousel from "@/components/home/TestimonialCarousel";
import CallToActionSection from "@/components/home/CallToActionSection";
import WowExperienceSection from "@/components/home/WowExperienceSection";
import AppExperienceSection from "@/components/home/AppExperienceSection";
import AppDownloadSection from "@/components/home/AppDownloadSection";
import { LuxurySignatureTitle } from "@/components/home/LuxurySignatureTitle";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearchSubmit = (formValues: SearchForm) => {
    const cityParam =
      formValues.city && formValues.city.trim() !== ""
        ? formValues.city
        : "Nabeul";
    navigate({
      pathname: `/search/${cityParam}`,
      search: formValues.searchQuery
        ? `?searchQuery=${encodeURIComponent(formValues.searchQuery)}`
        : undefined,
    });
  };

  return (
    <div className="flex flex-col">
      {/* Hero content: search card */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-4xl bg-white rounded-xl sm:rounded-2xl shadow-xl py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 flex flex-col gap-4 sm:gap-5 text-center -mt-8 sm:-mt-12 lg:-mt-16"
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={fadeInUp.transition}
      >
        <h1 className="flex flex-col items-center gap-1 sm:gap-1.5">
          {/* Eyebrow — fine ornamental line */}
          <span className="flex items-center gap-2 sm:gap-3">
            <span
              className="h-px w-6 sm:w-8"
              style={{
                background: "linear-gradient(to right, transparent, #D4AF37)",
              }}
            />
            <span
              className="text-[10px] sm:text-xs font-bold tracking-[0.22em] uppercase"
              style={{ color: "#C9A227" }}
            >
              Artisan · Nabeul · Est. 2021
            </span>
            <span
              className="h-px w-6 sm:w-8"
              style={{
                background: "linear-gradient(to left, transparent, #D4AF37)",
              }}
            />
          </span>

          {/* "La Signature" — cinematic animated hero title */}
          <LuxurySignatureTitle />

          {/* "Crêpe Time" — hero word, dominant */}
          <span
            className="font-heading font-black leading-none"
            style={{
              fontSize: "clamp(2.6rem, 8vw, 5.5rem)",
              letterSpacing: "-0.04em",
              background:
                "linear-gradient(135deg, #B8901F 0%, #D4AF37 28%, #E5C76B 52%, #D4AF37 72%, #C9A227 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 2px 14px rgba(212,175,55,0.28))",
            }}
          >
            Crêpe Time
          </span>

          {/* "Luxe Artisan" — closing ornament */}
          <span className="flex items-center gap-2 sm:gap-3 mt-0.5">
            <span
              className="h-px w-5 sm:w-8"
              style={{ background: "rgba(76,29,149,0.3)" }}
            />
            <span
              className="text-[10px] sm:text-xs font-semibold tracking-[0.18em] uppercase"
              style={{ color: "rgba(76,29,149,0.55)" }}
            >
              Luxe Artisan — Nabeul
            </span>
            <span
              className="h-px w-5 sm:w-8"
              style={{ background: "rgba(76,29,149,0.3)" }}
            />
          </span>
        </h1>
        <span className="text-base sm:text-lg md:text-xl text-muted-foreground">
          Recettes artisanales d excellence, commande digitale ultra fluide et livraison premium rapide.
        </span>
        <div className="w-full max-w-2xl mx-auto">
          <SearchBar
            placeHolder="Rechercher une crepe..."
            onSubmit={handleSearchSubmit}
            city="Nabeul"
          />
        </div>
      </motion.div>

      {/* Premium brand marquee */}
      <div className="mt-8 sm:mt-10">
        <BrandMarquee />
      </div>

      {/* ── Product showcase: App ordering experience ── */}
      <AppExperienceSection />

      {/* Crepe highlights section with 3D tilt cards */}
      <div className="mt-6 sm:mt-10">
        <CrepeHighlightsSection />
      </div>

      {/* WOW section — scroll story, floating images, flavor explorer */}
      <WowExperienceSection />

      {/* Testimonial carousel */}
      <TestimonialCarousel />

      {/* App download — ultra-premium section */}
      <AppDownloadSection />

      {/* Call to action just before footer */}
      <CallToActionSection />
    </div>
  );
};

export default memo(HomePage);
