import React, { memo, useRef } from "react";
import { motion } from "framer-motion";
import CrepeHighlightCard, { type CrepeHighlight } from "./CrepeHighlightCard";
import nutellaBananeFeature from "@/assets/hero/Crêpe Nutella Banane feature.jpg";
import lotusBiscoffImage from "@/assets/menu-items/lotus-biscoff.jpg";
import signatureImage from "@/assets/menu-items/crepe-time-signature.jpg";

const HIGHLIGHTS: CrepeHighlight[] = [
  {
    id: "1",
    name: "Crêpe Nutella Banane",
    description: "Une combinaison irrésistible de Nutella généreux et de bananes fraîches.",
    imageUrl: nutellaBananeFeature,
    avifUrl: "/nutella-bg.avif",
  },
  {
    id: "2",
    name: "Crêpe Lotus Biscoff",
    description: "Le spéculoos caramélisé sur une crêpe dorée, un classique réinventé.",
    imageUrl: lotusBiscoffImage,
    avifUrl: "/lotus-bg.avif",
  },
  {
    id: "3",
    name: "Crêpe Time Signature",
    description: "Notre recette exclusive : un mélange secret de saveurs premium.",
    imageUrl: signatureImage,
    avifUrl: "/signature-bg.avif",
  },
];

const CrepeHighlightsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative py-10 sm:py-12 lg:py-14 overflow-hidden bg-crepe-purple"
      aria-labelledby="crepe-highlights-heading"
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 600px" } as React.CSSProperties}
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
            <div className="relative overflow-hidden rounded-lg bg-crepe-purple px-5 py-5 sm:px-6 sm:py-6 max-w-2xl mx-auto text-center border border-crepe-gold/20">
              {/* Gold top highlight */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 15%, rgba(212, 175, 55, 0.55) 50%, transparent 85%)",
                }}
              />

              {/* Eyebrow row — badge framed by decorative lines */}
              <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
                <span
                  className="flex-1 max-w-[56px] h-px"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, rgba(212,175,55,0.5))",
                  }}
                />
                <span
                  className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-[0.18em] uppercase whitespace-nowrap"
                  style={{
                    background: "rgba(212, 175, 55, 0.08)",
                    border: "1px solid rgba(212, 175, 55, 0.32)",
                    color: "#D4AF37",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  ✦ L&apos;excellence artisanale
                </span>
                <span
                  className="flex-1 max-w-[56px] h-px"
                  style={{
                    background:
                      "linear-gradient(to left, transparent, rgba(212,175,55,0.5))",
                  }}
                />
              </div>

              {/* h2 — split editorial two-line display */}
              <h2
                id="crepe-highlights-heading"
                className="leading-none"
              >
                <span
                  className="block font-heading font-light tracking-wide text-white/65"
                  style={{ fontSize: "clamp(1rem, 2.5vw, 1.45rem)", letterSpacing: "0.06em" }}
                >
                  Nos Crêpes
                </span>
                <span
                  className="block font-heading font-black"
                  style={{
                    fontSize: "clamp(2rem, 5.5vw, 3.75rem)",
                    letterSpacing: "-0.035em",
                    lineHeight: 1,
                    background:
                      "linear-gradient(135deg, #FFFFFF 0%, #F0E0B0 25%, #E5C76B 50%, #D4AF37 70%, #C9A227 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 2px 16px rgba(212,175,55,0.22))",
                  }}
                >
                  Signature
                </span>
              </h2>

              {/* Ornamental separator */}
              <div className="flex items-center justify-center gap-2 my-3 sm:my-4">
                <span
                  className="h-px w-10 sm:w-14"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, rgba(212,175,55,0.45))",
                  }}
                />
                <span
                  className="text-[10px]"
                  style={{ color: "rgba(212,175,55,0.65)" }}
                >
                  ✦
                </span>
                <span
                  className="h-px w-10 sm:w-14"
                  style={{
                    background:
                      "linear-gradient(to left, transparent, rgba(212,175,55,0.45))",
                  }}
                />
              </div>

              <p className="text-xs sm:text-sm max-w-lg mx-auto leading-snug text-white/70">
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
