import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { UtensilsCrossed, Package, LogIn, ChevronRight } from "lucide-react";
import UsernameMenu from "./UsernameMenu";
import { useAppContext } from "@/contexts/AppContext";

type Props = { onClose: () => void };

type NavItemDef = {
  to: string;
  label: string;
  sublabel: string;
  Icon: React.ElementType;
  iconBg: string;
  iconBgActive: string;
  iconColor: string;
  iconColorActive: string;
};

const NAV_ITEMS: NavItemDef[] = [
  {
    to: "/menu",
    label: "Menu",
    sublabel: "Nos crêpes artisanales",
    Icon: UtensilsCrossed,
    iconBg: "rgba(255,255,255,0.1)",
    iconBgActive: "rgba(212,175,55,0.22)",
    iconColor: "rgba(255,255,255,0.65)",
    iconColorActive: "#D4AF37",
  },
  {
    to: "/order-status",
    label: "Suivi de commande",
    sublabel: "Votre commande en direct",
    Icon: Package,
    iconBg: "rgba(255,255,255,0.08)",
    iconBgActive: "rgba(167,139,250,0.25)",
    iconColor: "rgba(200,185,255,0.7)",
    iconColorActive: "#C4B5FD",
  },
];

// ── Single nav item ───────────────────────────────────────
const NavItem = ({
  item,
  active,
  onClose,
}: {
  item: NavItemDef;
  active: boolean;
  onClose: () => void;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative transition-transform duration-200 hover:translate-x-[3px] active:scale-[0.97]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Animated gold left bar */}
      <span
        className="absolute left-0 inset-y-0 my-auto w-[3px] rounded-r-full pointer-events-none"
        style={{
          height: "52%",
          opacity: active ? 1 : 0,
          transform: active ? "scaleY(1)" : "scaleY(0)",
          transition: "transform 220ms ease, opacity 220ms ease",
          transformOrigin: "center",
          background: "linear-gradient(180deg, #E5C76B 0%, #D4AF37 100%)",
          boxShadow: "0 0 8px rgba(212,175,55,0.55)",
        }}
      />

      <Link
        to={item.to}
        onClick={onClose}
        className="flex items-center gap-3.5 w-full py-3.5 px-4 rounded-xl transition-colors duration-150"
        style={{
          background: active
            ? "rgba(212,175,55,0.1)"
            : hovered
            ? "rgba(255,255,255,0.08)"
            : "transparent",
        }}
      >
        {/* Icon pill */}
        <span
          className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-all duration-200"
          style={{
            background: active
              ? item.iconBgActive
              : hovered
              ? "rgba(255,255,255,0.12)"
              : item.iconBg,
          }}
        >
          <item.Icon
            className="h-[17px] w-[17px] transition-colors duration-200"
            style={{
              color: active ? item.iconColorActive : item.iconColor,
            }}
          />
        </span>

        {/* Text stack */}
        <div className="flex flex-col flex-1 min-w-0">
          <span
            className="text-[13px] font-semibold leading-tight"
            style={{
              color: active ? "#D4AF37" : "rgba(255,255,255,0.9)",
            }}
          >
            {item.label}
          </span>
          <span
            className="text-[10px] mt-0.5 leading-tight"
            style={{
              color: active
                ? "rgba(212,175,55,0.55)"
                : "rgba(255,255,255,0.4)",
            }}
          >
            {item.sublabel}
          </span>
        </div>

        {/* Right indicator */}
        {active ? (
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{
              background: "#D4AF37",
              boxShadow: "0 0 8px rgba(212,175,55,0.8)",
            }}
          />
        ) : (
          <ChevronRight
            className="w-3.5 h-3.5 shrink-0 transition-all duration-200"
            style={{
              color: "rgba(255,255,255,0.3)",
              opacity: hovered ? 0.7 : 0.3,
              transform: hovered ? "translateX(2px)" : "translateX(0)",
            }}
          />
        )}
      </Link>
    </div>
  );
};

// ── Nav links root ────────────────────────────────────────
const MobileNavLinks = ({ onClose }: Props) => {
  const { isLoggedIn } = useAppContext();
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <NavItem
          key={item.to}
          item={item}
          active={pathname === item.to}
          onClose={onClose}
        />
      ))}

      {/* Divider */}
      <div
        className="my-2.5 h-px mx-1"
        style={{ background: "rgba(255,255,255,0.1)" }}
      />

      {/* Auth */}
      <div className="flex items-center">
        {isLoggedIn ? (
          <div onClick={onClose} className="w-full">
            <UsernameMenu />
          </div>
        ) : (
          <Link to="/sign-in" className="w-full" onClick={onClose}>
            <div className="transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]">
              <Button
                className="w-full font-semibold gap-2 rounded-xl text-white text-sm h-11"
                style={{
                  background:
                    "linear-gradient(135deg, #2D0853 0%, #4C1D95 100%)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 4px 18px rgba(0,0,0,0.3)",
                }}
              >
                <LogIn className="h-4 w-4" />
                Connexion
              </Button>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileNavLinks;
