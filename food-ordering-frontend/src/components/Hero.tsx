import { useState, useRef, useEffect } from "react";
import heroBanner from "@/assets/hero/premium_photo-1707757442396-8784df68d028.avif";

const Hero = () => {
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="relative w-full">
      {isLoading && (
        <div
          className="absolute inset-0 w-full h-40 sm:h-56 md:h-72 lg:max-h-[500px] xl:max-h-[600px] bg-muted animate-pulse rounded-none"
          aria-hidden="true"
        />
      )}
      <img
        ref={imgRef}
        src={heroBanner}
        alt="Crepe Time - Hero Banner"
        width={1200}
        height={400}
        className={`w-full h-40 sm:h-56 md:h-72 lg:max-h-[500px] xl:max-h-[600px] object-cover object-center transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default Hero;
