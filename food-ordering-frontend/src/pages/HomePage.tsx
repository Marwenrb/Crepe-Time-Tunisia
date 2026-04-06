import { memo, lazy, Suspense, useEffect, useRef, useState } from "react";
const VideoHeroSection = lazy(() => import("@/components/home/CinematicVideoSection"));
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
  return (
    <div className="flex flex-col">
      {/* Video hero */}
      <DeferredSection minHeight="min-h-[60vh]">
        <VideoHeroSection />
      </DeferredSection>

      {/* Premium brand marquee */}
      <div className="mt-2 sm:mt-10">
        <DeferredSection minHeight="min-h-[56px]">
          <BrandMarquee />
        </DeferredSection>
      </div>

      <DeferredSection><AppExperienceSection /></DeferredSection>

      <div className="mt-3 sm:mt-10">
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
