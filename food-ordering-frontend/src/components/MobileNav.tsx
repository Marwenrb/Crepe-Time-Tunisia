import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import MobileNavLinks from "./MobileNavLinks";
import { BRAND } from "@/config/brand";

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* ── Trigger ── */}
      <SheetTrigger
        aria-label="Open menu"
        className="
          p-2 -m-2 rounded-lg
          text-crepe-purple hover:text-crepe-gold
          hover:bg-crepe-gold/10
          transition-all duration-300 ease-out
          active:scale-95
        "
      >
        <Menu className="h-6 w-6" />
      </SheetTrigger>

      {/* ── Panel ── */}
      <SheetContent
        side="right"
        className="flex flex-col w-[min(300px,88vw)] border-l-0 p-0 overflow-hidden"
        style={{
          /* Match footer's exact crepe-purple with depth gradient */
          background:
            "linear-gradient(160deg, #3B0764 0%, #4C1D95 55%, #3B0764 100%)",
          borderLeft: "1px solid rgba(212,175,55,0.18)",
          boxShadow: "-12px 0 60px rgba(0,0,0,0.55)",
        }}
      >
        <SheetTitle className="sr-only">Menu de navigation</SheetTitle>

        {/* ── Decorative layer: top-right highlight ── */}
        <div
          className="absolute top-0 right-0 w-44 h-44 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 100% 0%, rgba(255,255,255,0.06) 0%, transparent 60%)",
          }}
        />
        {/* Bottom soft gold whisper */}
        <div
          className="absolute bottom-0 left-0 w-full h-32 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 25% 100%, rgba(212,175,55,0.08) 0%, transparent 100%)",
          }}
        />
        {/* Inner left-edge gold line */}
        <div
          className="absolute top-0 left-0 bottom-0 w-px pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 5%, rgba(212,175,55,0.3) 30%, rgba(212,175,55,0.15) 70%, transparent 95%)",
          }}
        />

        {/* ── Brand Header ── */}
        <div
          className="relative z-10 flex items-center justify-between px-5 pt-5 pb-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}
        >
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 group"
            aria-label="Retour à l'accueil"
          >
            {/* Logo */}
            <div
              className="relative h-11 w-11 shrink-0 rounded-xl overflow-hidden"
              style={{
                boxShadow:
                  "0 0 0 2px rgba(212,175,55,0.5), 0 4px 16px rgba(0,0,0,0.35)",
              }}
            >
              <img
                src={BRAND.logo}
                alt={BRAND.name}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/logo.png";
                }}
              />
            </div>

            {/* Brand name + tagline */}
            <div className="flex flex-col gap-[3px]">
              {/* Shine-sweep wrapper */}
              <div className="relative overflow-hidden inline-block leading-none">
                <span
                  className="font-heading font-black text-[1.35rem] leading-none block"
                  style={{
                    letterSpacing: "-0.03em",
                    background:
                      "linear-gradient(135deg, #E5C76B 0%, #D4AF37 22%, #FFFFFF 50%, #E5C76B 78%, #C9A227 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 1px 12px rgba(212,175,55,0.5))",
                  }}
                >
                  {BRAND.name}
                </span>
              </div>
              <span
                className="text-[9px] font-bold tracking-[0.26em] uppercase"
                style={{ color: "rgba(212,175,55,0.65)" }}
              >
                {BRAND.tagline}
              </span>
            </div>
          </Link>

          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 shrink-0"
            style={{
              color: "rgba(255,255,255,0.55)",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = "rgba(212,175,55,0.18)";
              el.style.color = "#D4AF37";
              el.style.borderColor = "rgba(212,175,55,0.35)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = "rgba(255,255,255,0.08)";
              el.style.color = "rgba(255,255,255,0.55)";
              el.style.borderColor = "rgba(255,255,255,0.12)";
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Navigation links ── */}
        <SheetDescription asChild>
          <div className="relative z-10 flex-1 flex flex-col overflow-y-auto px-3 py-3">
            <MobileNavLinks onClose={() => setOpen(false)} />
          </div>
        </SheetDescription>

        {/* ── Footer ── */}
        <div
          className="relative z-10 py-3 text-center"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <p
            className="text-[9px] font-bold tracking-[0.24em] uppercase"
            style={{ color: "rgba(212,175,55,0.4)" }}
          >
            Crêpe Time · Nabeul
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
