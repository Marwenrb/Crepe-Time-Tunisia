import { CartItem } from "@/pages/DetailPage";
import { Restaurant } from "@/types";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Trash } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  restaurant: Restaurant;
  cartItems: CartItem[];
  removeFromCart: (cartItem: CartItem) => void;
  updateCartItemQuantity?: (cartItem: CartItem, newQuantity: number) => void;
};

const OrderSummary = ({
  restaurant,
  cartItems,
  removeFromCart,
  updateCartItemQuantity,
}: Props) => {
  const subtotal = cartItems.reduce(
    (total, cartItem) => total + cartItem.price * cartItem.quantity,
    0
  );
  const total =
    cartItems.length > 0 ? subtotal + restaurant.deliveryPrice : 0;

  const formatCurrency = (amount: number) =>
    `${(amount / 100).toFixed(2)} TND`;

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight flex justify-between">
          <span>Votre Commande</span>
          <span>{formatCurrency(total)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {cartItems.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Votre panier est vide. Ajoutez des crêpes depuis le menu.
          </p>
        ) : (
          cartItems.map((item) => (
          <div className="flex justify-between items-center" key={item._id}>
            <span className="flex items-center gap-2">
              {/* Quantity Counter */}
              <div className="flex items-center px-1 py-0.5 bg-gray-50 rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-lg bg-gray-100"
                  disabled={item.quantity <= 1}
                  onClick={() =>
                    updateCartItemQuantity &&
                    updateCartItemQuantity(item, item.quantity - 1)
                  }
                  aria-label="Decrease quantity"
                >
                  -
                </Button>
                <span className="mx-2 w-4 text-center select-none font-medium">
                  {item.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-lg bg-gray-100"
                  onClick={() =>
                    updateCartItemQuantity &&
                    updateCartItemQuantity(item, item.quantity + 1)
                  }
                  aria-label="Increase quantity"
                >
                  +
                </Button>
              </div>
              <span className="ml-2">{item.name}</span>
            </span>
            <span className="flex items-center gap-1">
              <Trash
                className="cursor-pointer"
                color="red"
                size={20}
                onClick={() => removeFromCart(item)}
              />
              {((item.price * item.quantity) / 100).toFixed(2)} TND
            </span>
          </div>
          ))
        )}
        <Separator />
        <div className="flex justify-between text-sm">
          <span>Sous-total</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Livraison</span>
          <span>{formatCurrency(restaurant.deliveryPrice)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </CardContent>
    </>
  );
};

export default OrderSummary;
