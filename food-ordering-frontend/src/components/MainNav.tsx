import { Button } from "./ui/button";
import UsernameMenu from "./UsernameMenu";
import { Link } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";

const NAV_AUTH_WIDTH = "min-w-[120px]";

const NavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <Link
    to={to}
    className="
      relative font-semibold text-crepe-purple/90
      transition-colors duration-200 hover:text-crepe-gold
      after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0
      after:content-[''] after:bg-crepe-gold
      after:transition-all after:duration-300 after:ease-out
      hover:after:w-full
    "
  >
    {children}
  </Link>
);

const MainNav = () => {
  const { isLoggedIn } = useAppContext();

  return (
    <nav className="flex items-center gap-6 lg:gap-8">
      <NavLink to="/menu">Menu</NavLink>
      <NavLink to="/order-status">Suivi de commande</NavLink>

      <div className={`flex items-center justify-end ${NAV_AUTH_WIDTH}`}>
        {isLoggedIn ? (
          <UsernameMenu />
        ) : (
          <Link to="/sign-in">
            <Button
              variant="ghost"
              className="
                font-bold text-crepe-purple
                border-2 border-crepe-purple/80
                hover:border-crepe-gold hover:text-crepe-gold
                hover:bg-crepe-gold/5
                transition-all duration-300 ease-out
                hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]
              "
            >
              Connexion
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default MainNav;
