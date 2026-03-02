import { Link } from "react-router-dom";
import { BRAND } from "@/config/brand";

type LogoProps = {
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show tagline below name */
  showTagline?: boolean;
  /** Use as link to home */
  asLink?: boolean;
  /** Additional class names */
  className?: string;
};

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10 sm:h-11 sm:w-11",
  lg: "h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16",
};

const Logo = ({
  size = "md",
  showTagline = true,
  asLink = true,
  className = "",
}: LogoProps) => {
  const content = (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} flex-shrink-0 rounded-xl overflow-hidden ring-2 ring-crepe-gold/50 shadow-lg bg-white`}
      >
        <img
          src={BRAND.logo}
          alt={BRAND.name}
          className="h-full w-full object-cover object-center"
          onError={(e) => {
            const el = e.target as HTMLImageElement;
            el.src = "/logo.png";
            el.onerror = () => { el.style.display = "none"; };
          }}
        />
      </div>
      <div className="flex flex-col min-w-0">
        <span
          className={`font-bold text-crepe-purple leading-tight ${
            size === "sm" ? "text-sm" : size === "md" ? "text-base sm:text-lg" : "text-xl sm:text-2xl"
          }`}
        >
          {BRAND.name}
        </span>
        {showTagline && (
          <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] text-crepe-gold uppercase leading-tight opacity-90">
            {BRAND.tagline}
          </span>
        )}
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" className="group block transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99]">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
