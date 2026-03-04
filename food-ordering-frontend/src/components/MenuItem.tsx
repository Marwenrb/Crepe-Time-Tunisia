import type { MenuItem } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { getMenuItemImage } from "@/config/menu-images";

type Props = {
  menuItem: MenuItem;
  addToCart: () => void;
};

const MenuItem = ({ menuItem, addToCart }: Props) => {
  const imageUrl = getMenuItemImage(menuItem.name, menuItem.imageUrl);
  return (
    <Card className="overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 animate-fade-in">
      <AspectRatio ratio={16 / 9}>
        <img
          src={imageUrl}
          alt={menuItem.name}
          className="object-cover w-full h-full"
        />
      </AspectRatio>
      <CardHeader>
        <CardTitle className="font-bold text-gray-800">
          {menuItem.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="font-bold text-gray-800">
          {(menuItem.price / 100).toFixed(2)} TND
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            addToCart();
          }}
          className="w-full bg-crepe-purple hover:bg-crepe-purple/90"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Ajouter au panier
        </Button>
      </CardContent>
    </Card>
  );
};

export default MenuItem;
