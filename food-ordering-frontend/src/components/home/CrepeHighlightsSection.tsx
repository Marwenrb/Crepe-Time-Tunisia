import { memo, useRef } from "react";
import { motion } from "framer-motion";
import CrepeHighlightCard, { type CrepeHighlight } from "./CrepeHighlightCard";
import nutellaBananeFeature from "@/assets/hero/Crêpe Nutella Banane feature.jpg";

const HIGHLIGHTS: CrepeHighlight[] = [
  {
    id: "1",
    name: "Crêpe Nutella Banane",
    description: "Une combinaison irrésistible de Nutella généreux et de bananes fraîches.",
    imageUrl: nutellaBananeFeature,
  },
  {
    id: "2",
    name: "Crêpe Lotus Biscoff",
    description: "Le spéculoos caramélisé sur une crêpe dorée, un classique réinventé.",
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=85",
  },
  {
    id: "3",
    name: "Crêpe Time Signature",
    description: "Notre recette exclusive : un mélange secret de saveurs premium.",
    imageUrl: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600&q=85",
  },
];

const CrepeHighlightsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative py-10 sm:py-12 lg:py-14 overflow-hidden bg-crepe-purple"
      aria-labelledby="crepe-highlights-heading"
    >
      {/* Subtle gold overlay */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-10 opacity-60"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent)",
        }}
      />
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl rounded-2xl border border-crepe-gold/15 overflow-hidden">
        <div className="relative py-2 sm:py-4">
          {/* Header card - compact, footer theme */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            className="mb-6 sm:mb-8"
          >
            <div className="relative overflow-hidden rounded-lg bg-crepe-purple px-5 py-4 sm:px-6 sm:py-5 max-w-2xl mx-auto text-center border border-crepe-gold/20">
              {/* Gold top highlight */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: "linear-gradient(90deg, transparent 15%, rgba(212, 175, 55, 0.5) 50%, transparent 85%)",
                }}
              />
              <span className="inline-block text-crepe-gold/90 text-[10px] sm:text-xs font-semibold tracking-[0.15em] uppercase mb-1.5">
                L&apos;excellence artisanale
              </span>
              <h2
                id="crepe-highlights-heading"
                className="font-heading text-xl sm:text-2xl md:text-3xl font-bold mb-1.5"
                style={{
                  background: "linear-gradient(135deg, #FFFFFF 0%, #E5E5E5 45%, #D4AF37 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.02em",
                }}
              >
                Nos Crêpes Signature
              </h2>
              <p className="text-xs sm:text-sm max-w-lg mx-auto leading-snug text-white/85">
                Créations sublimées par des ingrédients d&apos;exception. Chaque bouchée, une promesse de douceur.
              </p>
            </div>
          </motion.div>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
            style={{ perspective: "1200px" }}
          >
            {HIGHLIGHTS.map((item, index) => (
              <CrepeHighlightCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(CrepeHighlightsSection);
