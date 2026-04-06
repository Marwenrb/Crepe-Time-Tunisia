import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useState } from "react";
import * as authApi from "@/api/authApi";
import { useAppContext } from "@/contexts/AppContext";

/** Returns initials (max 2 chars) from a display name or email */
function getInitials(name?: string | null, email?: string | null): string {
  const src = name || email || "?";
  const words = src.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

/** Deterministic pastel-ish hue from a string */
function hashHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

const AvatarInitials = ({ name, email }: { name?: string | null; email?: string | null }) => {
  const initials = getInitials(name, email);
  const hue = hashHue(name || email || "ct");
  return (
    <span
      className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white select-none"
      style={{ background: `hsl(${hue},55%,38%)` }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
};

const UsernameMenu = () => {
  const { isAdmin } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const email = localStorage.getItem("user_email");
  const name = localStorage.getItem("user_name");
  const storedImage = localStorage.getItem("user_image");

  // Use a real photo if stored and not broken; otherwise show initials avatar
  const usePhoto = !!storedImage && !imgError;

  const handleMenuClick = () => setIsOpen(false);

  const handleLogout = async () => {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("cartItems-")) sessionStorage.removeItem(key);
    });
    await authApi.signOut();
    setIsOpen(false);
    window.location.href = "/";
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-full border-2 border-crepe-gold/80 p-0.5 focus:outline-none focus:ring-2 focus:ring-crepe-purple hover:border-crepe-gold hover:shadow-[0_0_16px_rgba(212,175,55,0.25)] transition-all duration-300"
          aria-label="Menu utilisateur"
        >
          {usePhoto ? (
            <img
              src={storedImage!}
              alt={name || email || "User"}
              className="h-9 w-9 rounded-full object-cover"
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
            />
          ) : (
            <AvatarInitials name={name} email={email} />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2">
        <div className="px-2 py-1 flex items-center gap-3">
          <div className="shrink-0">
            {usePhoto ? (
              <img
                src={storedImage!}
                alt={name || email || "User"}
                className="h-8 w-8 rounded-full object-cover"
                onError={() => setImgError(true)}
                referrerPolicy="no-referrer"
              />
            ) : (
              <AvatarInitials name={name} email={email} />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </div>
        <Separator className="my-2" />
        {isAdmin && (
          <>
            <DropdownMenuItem
              onClick={handleMenuClick}
              className="py-1.5 rounded-md cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
            >
              <Link
                to="/manage-restaurant"
                className="font-bold hover:text-crepe-gold"
              >
                Gérer le restaurant
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleMenuClick}
              className="py-1.5 rounded-md cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
            >
              <Link to="/business-insights" className="font-bold hover:text-crepe-gold">
                Tableau de bord
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem
          onClick={handleMenuClick}
          className="py-1.5 rounded-md cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
        >
          <Link to="/user-profile" className="font-bold hover:text-crepe-gold">
            Mon profil
          </Link>
        </DropdownMenuItem>
        <Separator className="my-2" />
        <DropdownMenuItem className="py-1.5 rounded-md cursor-pointer">
          <Button
            onClick={handleLogout}
            className="w-full font-bold bg-crepe-purple hover:bg-crepe-purple-light"
          >
            Déconnexion
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UsernameMenu;
