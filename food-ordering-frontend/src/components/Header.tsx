import { Link } from "react-router-dom";
import MobileNav from "./MobileNav";
import MainNav from "./MainNav";

const Header = () => {
  return (
    <div className="border-b-2 border-b-crepe-gold h-[72px] flex items-center shrink-0">
      <div className="container mx-auto flex justify-between items-center w-full">
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
        >
          <img
            src="/logo.png"
            alt="Crêpe Time"
            className="h-12 w-12 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-crepe-purple leading-tight">
              Crêpe Time
            </span>
            <span className="text-[10px] font-medium tracking-widest text-crepe-gold uppercase leading-tight hidden sm:block">
              The Sweetest Escape
            </span>
          </div>
        </Link>
        <div className="md:hidden">
          <MobileNav />
        </div>
        <div className="hidden md:block">
          <MainNav />
        </div>
      </div>
    </div>
  );
};

export default Header;
