import { memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SearchBar, { SearchForm } from "@/components/SearchBar";
import BrandMarquee from "@/components/home/BrandMarquee";
import CrepeHighlightsSection from "@/components/home/CrepeHighlightsSection";
import TestimonialCarousel from "@/components/home/TestimonialCarousel";
import CallToActionSection from "@/components/home/CallToActionSection";
import appOrderImage from "@/assets/hero/photo-1734056650036-7002ede7b8f8.avif";

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
        className="relative z-[9999] mx-auto w-full max-w-4xl bg-white rounded-xl sm:rounded-2xl shadow-xl py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 flex flex-col gap-4 sm:gap-5 text-center -mt-8 sm:-mt-12 lg:-mt-16"
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={fadeInUp.transition}
      >
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight bg-gradient-to-r from-crepe-purple via-rose-500 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
          La Signature Crepe Time, Luxe Artisan a Nabeul
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

      {/* Menu teaser: image + CTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center mt-8 sm:mt-10 lg:mt-12">
        <motion.div
          className="order-2 md:order-1 rounded-xl overflow-hidden shadow-lg"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={appOrderImage}
            alt="Commande sur l app - Crepe Time"
            className="w-full h-48 sm:h-64 md:h-80 object-cover"
            loading="lazy"
          />
        </motion.div>
        <motion.div
          className="order-1 md:order-2 flex flex-col gap-3 sm:gap-4 text-center md:text-left"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="font-heading font-bold text-2xl sm:text-3xl tracking-tighter text-crepe-purple">
            Commandez sur l App, Finalisez en Un Instant
          </span>
          <span className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Creez votre commande directement dans notre app, personnalisez chaque crepe et confirmez en un clic.
            WhatsApp reste disponible pour un accompagnement VIP. Livraison premium ou retrait express, selon votre rythme.
          </span>
        </motion.div>
      </div>

      {/* Crepe highlights section with 3D tilt cards */}
      <div className="mt-6 sm:mt-10">
        <CrepeHighlightsSection />
      </div>

      {/* Testimonial carousel */}
      <TestimonialCarousel />

      {/* Call to action just before footer */}
      <CallToActionSection />
    </div>
  );
};

export default memo(HomePage);
