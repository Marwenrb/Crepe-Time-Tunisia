import { Link } from "react-router-dom";
import { useState, type CSSProperties, type ReactNode } from "react";
import { BRAND } from "@/config/brand";
import { cn } from "@/lib/utils";
import styles from "./BrandSignature.module.css";

type BrandSignatureSize = "sm" | "md" | "lg";
type BrandSignatureAlign = "left" | "center";
type BrandSignatureSurface = "none" | "glass" | "spotlight";

interface BrandSignatureProps {
  size?: BrandSignatureSize;
  align?: BrandSignatureAlign;
  surface?: BrandSignatureSurface;
  description?: string;
  className?: string;
  loading?: "eager" | "lazy";
  interactive?: boolean;
}

const FALLBACK_LOGO = "/logo.png";

const OFFICIAL_BRAND_KEYFRAMES = `
  @keyframes hdr-rotate-border {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes hdr-glow-breathe {
    0%, 100% { opacity: 0.7; }
    50%      { opacity: 1; }
  }
  .hdr-logo-ring {
    animation: hdr-glow-breathe 3.5s ease-in-out infinite;
    box-shadow: 0 0 10px rgba(212,175,55,0.3), 0 0 22px rgba(212,175,55,0.1);
    will-change: opacity;
  }
`;

const SCALE_STYLES: Record<BrandSignatureSize, CSSProperties> = {
  sm: { transform: "scale(0.94)" },
  md: { transform: "scale(1)" },
  lg: { transform: "scale(1.16)" },
};

const surfaceClassMap: Record<BrandSignatureSurface, string> = {
  none: styles.surfaceNone,
  glass: styles.surfaceGlass,
  spotlight: styles.surfaceSpotlight,
};

const alignClassMap: Record<BrandSignatureAlign, string> = {
  left: styles.left,
  center: styles.center,
};

const InteractiveWrapper = ({
  interactive,
  className,
  children,
}: {
  interactive: boolean;
  className: string;
  children: ReactNode;
}) => {
  if (interactive) {
    return (
      <Link to="/" className={className}>
        {children}
      </Link>
    );
  }

  return <div className={className}>{children}</div>;
};

const BrandSignature = ({
  size = "md",
  align = "center",
  surface = "none",
  description,
  className,
  loading = "lazy",
  interactive = true,
}: BrandSignatureProps) => {
  const [src, setSrc] = useState<string>(BRAND.logo);
  const [showFallback, setShowFallback] = useState(false);

  return (
    <div
      className={cn(
        styles.root,
        alignClassMap[align],
        surfaceClassMap[surface],
        className,
      )}
    >
      <style>{OFFICIAL_BRAND_KEYFRAMES}</style>

      <div className={styles.lockupFrame}>
        <div className={styles.scaleShell} style={SCALE_STYLES[size]}>
          <InteractiveWrapper
            interactive={interactive}
            className={cn(
              "group flex items-center gap-3 sm:gap-4 shrink-0 min-w-0",
              interactive && "transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99]",
            )}
          >
            <div className="relative flex-shrink-0">
              <div
                className="hdr-logo-ring relative rounded-2xl overflow-hidden"
                style={{ padding: 2 }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: "-120%",
                    background:
                      "conic-gradient(from 0deg, #D4AF37, transparent 18%, #7C3AED 38%, transparent 58%, #EDD060 78%, #D4AF37)",
                    animation: "hdr-rotate-border 4s linear infinite",
                    willChange: "transform",
                  }}
                />
                <div className="relative h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-xl overflow-hidden bg-white">
                  {!showFallback && (
                    <img
                      src={src}
                      alt={BRAND.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover object-center"
                      loading={loading}
                      decoding="async"
                      onError={() => {
                        if (src !== FALLBACK_LOGO) {
                          setSrc(FALLBACK_LOGO);
                          return;
                        }

                        setShowFallback(true);
                      }}
                    />
                  )}

                  {showFallback && (
                    <div className={styles.logoFallback}>CT</div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-crepe-purple leading-tight truncate transition-colors duration-200 group-hover:text-crepe-purple-light">
                {BRAND.name}
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.25em] text-crepe-gold uppercase leading-tight hidden xs:block opacity-90">
                {BRAND.tagline}
              </span>
            </div>
          </InteractiveWrapper>
        </div>
      </div>

      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
};

export default BrandSignature;
