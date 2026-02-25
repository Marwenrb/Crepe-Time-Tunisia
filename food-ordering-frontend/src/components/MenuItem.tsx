import type { MenuItem } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
  menuItem: MenuItem;
  addToCart: () => void;
};

const MenuItem = ({ menuItem, addToCart }: Props) => {
  return (
    <Card className="cursor-pointer hover:bg-crepe-purple/10" onClick={addToCart}>
      <CardHeader>
        <CardTitle className="font-bold text-gray-800">
          {menuItem.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="font-bold text-gray-800">
        {(menuItem.price / 100).toFixed(2)} TND
      </CardContent>
    </Card>
  );
};

export default MenuItem;
