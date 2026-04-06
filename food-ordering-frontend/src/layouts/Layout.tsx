import { lazy, Suspense, useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroContent from "@/components/home/HeroContent";

const BackToTop = lazy(() => import("@/components/BackToTop"));

type Props = {
  children: React.ReactNode;
  showHero?: boolean;
};

const Layout = ({ children, showHero = false }: Props) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const idleWindow = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (idleWindow.requestIdleCallback) {
      const id = idleWindow.requestIdleCallback(() => setShowBackToTop(true), { timeout: 1500 });
      return () => {
        if (idleWindow.cancelIdleCallback) idleWindow.cancelIdleCallback(id);
      };
    }

    const timer = window.setTimeout(() => setShowBackToTop(true), 1000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <Header />
      {showHero && (
        /* hero-critical class defined in inline <style> in index.html for CLS-free rendering */
        <div className="hero-critical">
          <img
            src="/hero-home.avif"
            alt="Crepe Time - Hero Banner"
            width={1200}
            height={600}
            sizes="100vw"
            className="w-full h-[480px] sm:h-[520px] md:h-[560px] lg:h-[620px] xl:h-[700px] object-cover object-center"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
          />
          {/* Dark scrim so heading text is legible over any image */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(15,10,31,0.45) 0%, rgba(15,10,31,0.65) 100%)" }}
          />
          <HeroContent />
        </div>
      )}
      <main className="container mx-auto flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {children}
      </main>
      <Footer />
      {showBackToTop ? (
        <Suspense fallback={null}>
          <BackToTop />
        </Suspense>
      ) : null}
    </div>
  );
};

export default Layout;
