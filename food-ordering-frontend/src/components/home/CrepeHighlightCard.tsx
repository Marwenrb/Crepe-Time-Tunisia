import { memo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface CrepeHighlight {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  avifUrl?: string;
}

interface CrepeHighlightCardProps {
  item: CrepeHighlight;
  index: number;
}

const CrepeHighlightCard = ({ item, index }: CrepeHighlightCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [8, -8]));
  const rotateY = useSpring(useTransform(x, [-100, 100], [-8, 8]));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = rectRef.current ?? cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    rectRef.current = rect;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);
    x.set(percentX * 100);
    y.set(percentY * 100);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    rectRef.current = e.currentTarget.getBoundingClientRect();
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    rectRef.current = null;
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="relative w-full max-w-sm mx-auto group"
    >
      <Link
        to="/menu"
        className="block relative overflow-hidden rounded-xl border border-crepe-gold/25 bg-crepe-purple-dark/95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-crepe-gold focus:ring-offset-2 focus:ring-offset-crepe-purple"
        style={{
          boxShadow: "0 8px 24px -8px rgba(0,0,0,0.3)",
        }}
        title={`Voir ${item.name} au menu — Cliquez pour découvrir`}
        aria-label={`${item.name} — Cliquez pour voir le menu complet`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <picture>
            {item.avifUrl && <source srcSet={`${item.avifUrl} 800w`} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 92vw" type="image/avif" />}
            <img
              src={item.imageUrl}
              alt={item.name}
              width={602}
              height={452}
              loading="lazy"
              decoding="async"
              sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 92vw"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </picture>
          <div
            className="absolute inset-0 bg-gradient-to-t from-crepe-purple-dark via-transparent to-transparent opacity-85"
            style={{ background: "linear-gradient(to top, #3B0764 0%, transparent 50%, transparent 100%)" }}
          />
          <div className="absolute bottom-2 left-2 right-2">
            <h3 className="font-heading text-base sm:text-lg font-semibold text-crepe-gold">
              {item.name}
            </h3>
          </div>
        </div>
        <div className="p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
            {item.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default memo(CrepeHighlightCard);
