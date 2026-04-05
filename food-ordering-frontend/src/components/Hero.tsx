const Hero = () => {
  return (
    <div className="relative w-full">
      <img
        src="/hero-home.avif"
        alt="Crepe Time - Hero Banner"
        width={1200}
        height={600}
        sizes="100vw"
        className="w-full h-40 sm:h-56 md:h-72 lg:max-h-[500px] xl:max-h-[600px] object-cover object-center"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
    </div>
  );
};

export default Hero;
