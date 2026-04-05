import { memo, lazy, Suspense, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar, { SearchForm } from "@/components/SearchBar";
const BrandMarquee = lazy(() => import("@/components/home/BrandMarquee"));

// ── Below-the-fold sections: lazy-loaded to cut initial JS ──────────────────
const CrepeHighlightsSection = lazy(() => import("@/components/home/CrepeHighlightsSection"));
const AppExperienceSection = lazy(() => import("@/components/home/AppExperienceSection"));
const WowExperienceSection = lazy(() => import("@/components/home/WowExperienceSection"));
const TestimonialCarousel = lazy(() => import("@/components/home/TestimonialCarousel"));
const AppDownloadSection = lazy(() => import("@/components/home/AppDownloadSection"));
const CallToActionSection = lazy(() => import("@/components/home/CallToActionSection"));

const SectionLoader = () => (
  <div className="flex items-center justify-center py-16">
    <div className="w-8 h-8 rounded-full border-2 border-crepe-gold/30 border-t-crepe-gold animate-spin" />
  </div>
);

const LazySection = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<SectionLoader />}>{children}</Suspense>
);

const DeferredSection = ({
  children,
  minHeight = "min-h-[160px]",
}: {
  children: React.ReactNode;
  minHeight?: string;
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = mountRef.current;
    if (!target || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { rootMargin: "40px 0px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <div ref={mountRef}>
      {isVisible ? <LazySection>{children}</LazySection> : <div className={minHeight} aria-hidden="true" />}
    </div>
  );
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
      <div className="relative z-10 mx-auto w-full max-w-4xl bg-white rounded-xl sm:rounded-2xl shadow-xl py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 flex flex-col gap-4 sm:gap-5 text-center -mt-8 sm:-mt-12 lg:-mt-16"
        style={{ animation: "hero-fade-in-up 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        <h1 className="flex flex-col items-center gap-1 sm:gap-1.5">
          <span className="flex items-center gap-2 sm:gap-3">
            <span className="h-px w-6 sm:w-8" style={{ background: "linear-gradient(to right, transparent, #D4AF37)" }} />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.22em] uppercase" style={{ color: "#C9A227" }}>
              Artisan · Nabeul · Est. 2021
            </span>
            <span className="h-px w-6 sm:w-8" style={{ background: "linear-gradient(to left, transparent, #D4AF37)" }} />
          </span>

          <span
            className="font-heading font-bold leading-none"
            style={{
              fontSize: "clamp(1.3rem, 3.2vw, 2.4rem)",
              letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #2E1065 0%, #4C1D95 35%, #7C3AED 70%, #A78BFA 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 1px 10px rgba(76,29,149,0.25))",
            }}
          >
            La Signature
          </span>

          <span
            className="font-heading font-black leading-none"
            style={{
              fontSize: "clamp(2.6rem, 8vw, 5.5rem)",
              letterSpacing: "-0.04em",
              background: "linear-gradient(135deg, #B8901F 0%, #D4AF37 28%, #E5C76B 52%, #D4AF37 72%, #C9A227 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 2px 14px rgba(212,175,55,0.28))",
            }}
          >
            Crêpe Time
          </span>

          <span className="flex items-center gap-2 sm:gap-3 mt-0.5">
            <span className="h-px w-5 sm:w-8" style={{ background: "rgba(76,29,149,0.3)" }} />
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: "rgba(76,29,149,0.55)" }}>
              Luxe Artisan — Nabeul
            </span>
            <span className="h-px w-5 sm:w-8" style={{ background: "rgba(76,29,149,0.3)" }} />
          </span>
        </h1>
        <span className="text-base sm:text-lg md:text-xl text-muted-foreground">
          Recettes artisanales d excellence, commande digitale ultra fluide et livraison premium rapide.
        </span>
        <div className="w-full max-w-2xl mx-auto">
          <SearchBar placeHolder="Rechercher une crepe..." onSubmit={handleSearchSubmit} city="Nabeul" />
        </div>
      </div>

      {/* Premium brand marquee */}
      <div className="mt-8 sm:mt-10">
        <DeferredSection minHeight="min-h-[56px]">
          <BrandMarquee />
        </DeferredSection>
      </div>

      <DeferredSection><AppExperienceSection /></DeferredSection>

      <div className="mt-6 sm:mt-10">
        <DeferredSection><CrepeHighlightsSection /></DeferredSection>
      </div>

      <DeferredSection><WowExperienceSection /></DeferredSection>
      <DeferredSection><TestimonialCarousel /></DeferredSection>
      <DeferredSection><AppDownloadSection /></DeferredSection>
      <DeferredSection><CallToActionSection /></DeferredSection>
    </div>
  );
};

export default memo(HomePage);
