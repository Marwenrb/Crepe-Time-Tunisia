import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { UtensilsCrossed, Package, LogIn } from "lucide-react";
import UsernameMenu from "./UsernameMenu";
import { useAppContext } from "@/contexts/AppContext";

const linkClass =
  "flex items-center gap-3 w-full py-3 px-3 rounded-lg font-semibold text-crepe-purple hover:text-crepe-gold hover:bg-crepe-gold/10 transition-all duration-200";

const MobileNavLinks = () => {
  const { isLoggedIn } = useAppContext();

  return (
    <div className="flex flex-col gap-1">
      <Link to="/menu" className={linkClass}>
        <UtensilsCrossed className="h-4 w-4" />
        Menu
      </Link>
      <Link to="/order-status" className={linkClass}>
        <Package className="h-4 w-4" />
        Suivi de commande
      </Link>

      <div className="h-px bg-border my-4" />

      <div className="min-h-[52px] flex items-center justify-center">
        {isLoggedIn ? (
          <UsernameMenu />
        ) : (
          <Link to="/sign-in" className="w-full">
            <Button className="w-full font-bold bg-crepe-purple hover:bg-crepe-purple-light">
              <LogIn className="h-4 w-4 mr-2" />
              Connexion
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileNavLinks;
