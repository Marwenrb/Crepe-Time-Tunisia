import { memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SearchBar, { SearchForm } from "@/components/SearchBar";
import BrandMarquee from "@/components/home/BrandMarquee";
import CrepeHighlightsSection from "@/components/home/CrepeHighlightsSection";
import TestimonialCarousel from "@/components/home/TestimonialCarousel";
import CallToActionSection from "@/components/home/CallToActionSection";

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
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-crepe-purple leading-tight">
          Découvrez Nos Crêpes Artisanales
        </h1>
        <span className="text-base sm:text-lg md:text-xl text-muted-foreground">
          Crêperie premium — Livraison à domicile à Nabeul
        </span>
        <div className="w-full max-w-2xl mx-auto">
          <SearchBar
            placeHolder="Rechercher une crêpe..."
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
            src="https://images.unsplash.com/photo-1635350736475-c8cef4b21906?w=800&q=90"
            alt="Crêpe Time — Crêpes artisanales"
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
            Commandez en Toute Simplicité
          </span>
          <span className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Contactez-nous sur WhatsApp pour une commande rapide et personnalisée.
            Livraison à domicile ou retrait en boutique — c&apos;est vous qui choisissez !
          </span>
        </motion.div>
      </div>

      {/* Crepe highlights section with 3D tilt cards */}
      <div className="mt-6 sm:mt-10">
        <CrepeHighlightsSection />
      </div>

      {/* Testimonial carousel */}
      <TestimonialCarousel />

      {/* Call to action — just before footer */}
      <CallToActionSection />
    </div>
  );
};

export default memo(HomePage);
