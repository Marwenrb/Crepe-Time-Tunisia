import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import MobileNavLinks from "./MobileNavLinks";
import Logo from "./Logo";

const MobileNav = () => {
  return (
    <Sheet>
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
      <SheetContent
        className="flex flex-col w-[min(320px,85vw)] border-l border-crepe-gold/20 bg-white/98 backdrop-blur-xl"
        side="right"
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div className="flex items-center gap-3 pb-3">
          <Logo size="sm" showTagline={false} asLink={true} />
        </div>
        <Separator className="bg-crepe-gold/30" />
        <SheetDescription asChild>
          <div className="flex-1 pt-4 flex flex-col text-sm text-muted-foreground">
            <MobileNavLinks />
          </div>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
