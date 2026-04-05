import { lazy, Suspense, useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

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
      {showHero && <Hero />}
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
