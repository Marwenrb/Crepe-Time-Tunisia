import { useState, useRef, useEffect } from "react";

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
        src="https://images.unsplash.com/photo-1635350736475-c8cef4b21906?w=1200&q=90"
        alt="Crêpe Time — The Sweetest Escape"
        className={`w-full h-40 sm:h-56 md:h-72 lg:max-h-[500px] xl:max-h-[600px] object-cover object-center transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        loading="eager"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default Hero;
