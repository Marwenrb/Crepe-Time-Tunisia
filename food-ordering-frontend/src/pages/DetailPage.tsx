import { useGetRestaurant } from "@/api/RestaurantApi";
import MenuItem from "@/components/MenuItem";
import OrderSummary from "@/components/OrderSummary";
import RestaurantInfo from "@/components/RestaurantInfo";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { MenuItem as MenuItemType } from "../types";
import CheckoutButton from "@/components/CheckoutButton";
import { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { GuestFormData } from "@/forms/guest-checkout-form/GuestCheckoutForm";
import { useCreateOrder, useCreateGuestOrder } from "@/api/OrderApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

const DetailPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { restaurant, isLoading } = useGetRestaurant(restaurantId);
  const { createOrder, isLoading: isOrderLoading } = useCreateOrder();
  const { createGuestOrder, isLoading: isGuestOrderLoading } = useCreateGuestOrder();

  // Helper to clear cart for this restaurant
  function clearCart(restaurantId: string | undefined) {
    if (!restaurantId) return;
    sessionStorage.removeItem(`cartItems-${restaurantId}`);
  }
  // Clear cart when leaving DetailPage (unmount)
  useEffect(() => {
    return () => clearCart(restaurantId);
  }, [restaurantId]);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCartItems = sessionStorage.getItem(`cartItems-${restaurantId}`);
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  const addToCart = (menuItem: MenuItemType) => {
    setCartItems((prevCartItems) => {
      const existingCartItem = prevCartItems.find(
        (cartItem) => cartItem._id === menuItem._id
      );

      let updatedCartItems;

      if (existingCartItem) {
        updatedCartItems = prevCartItems.map((cartItem) =>
          cartItem._id === menuItem._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        updatedCartItems = [
          ...prevCartItems,
          {
            _id: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
          },
        ];
      }

      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCartItems)
      );

      return updatedCartItems;
    });
  };

  const removeFromCart = (cartItem: CartItem) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems.filter(
        (item) => cartItem._id !== item._id
      );

      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCartItems)
      );

      return updatedCartItems;
    });
  };

  const updateCartItemQuantity = (cartItem: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems.map((item) =>
        item._id === cartItem._id ? { ...item, quantity: newQuantity } : item
      );
      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCartItems)
      );
      return updatedCartItems;
    });
  };

  const onCheckout = async (userFormData: UserFormData) => {
    if (!restaurant) return;

    const orderData = {
      cartItems: cartItems.map((cartItem) => ({
        menuItemId: cartItem._id,
        name: cartItem.name,
        quantity: cartItem.quantity.toString(),
      })),
      restaurantId: restaurant._id,
      deliveryDetails: {
        name: userFormData.name,
        addressLine1: userFormData.addressLine1,
        city: userFormData.city,
        country: userFormData.country,
        email: userFormData.email as string,
        phone: userFormData.phone ?? "",
      },
      paymentMethod: "cash" as const,
    };

    const data = await createOrder(orderData);
    if (data?.whatsappUrl) window.open(data.whatsappUrl, "_blank");
    toast.success("Commande confirmée ! Paiement à la livraison.");
    const orderId = data?.order?._id ?? data?.order?.id ?? data?.id;
    navigate(`/order-status?success=true${orderId ? `&orderId=${orderId}` : ""}`);
  };

  const onGuestCheckout = async (guestFormData: GuestFormData) => {
    if (!restaurant) return;

    const orderData = {
      cartItems: cartItems.map((cartItem) => ({
        menuItemId: cartItem._id,
        name: cartItem.name,
        quantity: cartItem.quantity.toString(),
      })),
      restaurantId: restaurant._id,
      deliveryDetails: {
        name: guestFormData.name,
        addressLine1: guestFormData.addressLine1,
        city: guestFormData.city,
        country: guestFormData.country,
        email: guestFormData.email,
        phone: guestFormData.phone,
      },
      paymentMethod: "cash" as const,
    };

    const data = await createGuestOrder(orderData);
    if (data?.whatsappUrl) window.open(data.whatsappUrl, "_blank");
    toast.success("Commande confirmée ! Paiement à la livraison.");
    const orderId = data?.order?._id ?? data?.order?.id ?? data?.id;
    navigate(`/order-status?success=true${orderId ? `&orderId=${orderId}` : ""}`);
  };

  if (isLoading || !restaurant) {
    return (
      <div className="flex flex-col gap-10">
        <AspectRatio ratio={8 / 2}>
          <Skeleton className="h-full w-full rounded-md" />
        </AspectRatio>
        <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-0">
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
            <Skeleton className="h-7 w-24" />
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex gap-4 p-4 border rounded-lg">
                <Skeleton className="h-24 w-24 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </div>
            ))}
          </div>

          <div>
            <Card>
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full" />
              </div>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
      <div className="rounded-lg sm:rounded-xl overflow-hidden -mx-4 sm:mx-0">
        <AspectRatio ratio={8 / 2}>
          <img
            src={restaurant.imageUrl}
            alt={restaurant.restaurantName}
            className="object-cover h-full w-full"
          />
        </AspectRatio>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[4fr_2fr] gap-6 lg:gap-8">
        <div className="flex flex-col gap-4 order-2 lg:order-1">
          <RestaurantInfo restaurant={restaurant} />
          <span className="text-xl sm:text-2xl font-bold tracking-tight">Notre Menu</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {restaurant.menuItems.map((menuItem) => (
              <MenuItem
                key={menuItem._id}
                menuItem={menuItem}
                addToCart={() => addToCart(menuItem)}
              />
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <OrderSummary
              restaurant={restaurant}
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              updateCartItemQuantity={updateCartItemQuantity}
            />
            <CardFooter>
              <CheckoutButton
                disabled={cartItems.length === 0}
                onCheckout={onCheckout}
                onGuestCheckout={onGuestCheckout}
                isLoading={isOrderLoading}
                isGuestLoading={isGuestOrderLoading}
              />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
