import { memo, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote: "Les meilleures crêpes de Nabeul ! La Crêpe Nutella Banane est tout simplement divine.",
    author: "Sarra M.",
    role: "Cliente fidèle",
  },
  {
    id: "2",
    quote: "Livraison rapide et crêpes toujours fraîches. Je recommande à 100%.",
    author: "Karim B.",
    role: "Habitant de Nabeul",
  },
  {
    id: "3",
    quote: "Une expérience premium à chaque commande. Crêpe Time, c'est devenu notre rituel du dimanche.",
    author: "Leila & Mohamed",
    role: "Famille",
  },
];

const TestimonialCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [isPaused, goToNext]);

  const current = TESTIMONIALS[activeIndex];

  return (
    <section
      className="relative py-16 sm:py-20"
      aria-labelledby="testimonials-heading"
      aria-roledescription="carousel"
      aria-label="Témoignages clients"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          id="testimonials-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-crepe-purple text-center mb-10 sm:mb-12"
        >
          Ce Que Disent Nos Clients
        </motion.h2>

        <div
          className="relative max-w-3xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <div
            className="relative rounded-2xl p-8 sm:p-10 border border-crepe-gold/30 bg-white/95 backdrop-blur-sm shadow-xl"
            style={{
              boxShadow: "0 25px 50px -12px rgba(76, 29, 149, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.1)",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <blockquote className="text-lg sm:text-xl text-crepe-dark leading-relaxed mb-6">
                  &ldquo;{current.quote}&rdquo;
                </blockquote>
                <footer>
                  <cite className="not-italic font-heading font-semibold text-crepe-purple text-base sm:text-lg">
                    {current.author}
                  </cite>
                  {current.role && (
                    <span className="block text-sm text-muted-foreground mt-1">
                      {current.role}
                    </span>
                  )}
                </footer>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={goToPrev}
              aria-label="Témoignage précédent"
              className="w-10 h-10 rounded-full bg-crepe-purple text-white flex items-center justify-center hover:bg-crepe-purple-dark transition-colors focus:outline-none focus:ring-2 focus:ring-crepe-gold focus:ring-offset-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex gap-2" role="tablist" aria-label="Sélection du témoignage">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-label={`Témoignage ${i + 1}`}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-crepe-gold focus:ring-offset-2 ${
                    i === activeIndex
                      ? "bg-crepe-gold w-8"
                      : "bg-crepe-purple/40 hover:bg-crepe-purple/60"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Témoignage suivant"
              className="w-10 h-10 rounded-full bg-crepe-purple text-white flex items-center justify-center hover:bg-crepe-purple-dark transition-colors focus:outline-none focus:ring-2 focus:ring-crepe-gold focus:ring-offset-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(TestimonialCarousel);
