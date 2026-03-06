/**
 * DetailPage — Premium Menu Page for Crêpe Time.
 *
 * Architecture overview:
 *  ┌──────────────────────────────────────────────┐
 *  │  MenuHero (cinematic full-bleed)              │
 *  ├──────────────────────────────────────────────┤
 *  │  CategoryNav (sticky glassmorphism bar)       │
 *  ├────────────────────────┬─────────────────────┤
 *  │  Menu grid             │  Cart sidebar        │
 *  │  PremiumMenuCard ×N    │  OrderSummary        │
 *  │                        │  CheckoutButton      │
 *  └────────────────────────┴─────────────────────┘
 *
 *  When a card is clicked → ProductModal opens with larger image + details.
 *
 * Design decisions:
 *  - Full page background is crepe-dark (#0F0A1F) — the new premium design
 *    owns the entire viewport, not just a content column.
 *  - Decorative glow orbs are absolutely positioned to add depth without
 *    affecting layout flow.
 *  - Load skeleton mirrors the final layout with correct dark colours,
 *    so the transition from loading → loaded feels seamless.
 *  - Category filter is purely a client-side derived view — it imposes
 *    no API changes since the data model has no category field.
 */

import { useGetRestaurant } from "@/api/RestaurantApi";
import { useState, useEffect, useMemo, CSSProperties } from "react";
import { useParams } from "react-router-dom";
import { MenuItem as MenuItemType } from "../types";
import CheckoutButton from "@/components/CheckoutButton";
import { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { GuestFormData } from "@/forms/guest-checkout-form/GuestCheckoutForm";
import { useCreateOrder, useCreateGuestOrder } from "@/api/OrderApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// New premium components
import { MenuHero } from "@/components/menu/MenuHero";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { PremiumMenuCard } from "@/components/menu/PremiumMenuCard";
import { ProductModal } from "@/components/menu/ProductModal";
import OrderSummary from "@/components/OrderSummary";

// Category config
import { MENU_CATEGORIES, getCategoryId } from "@/config/menu-categories";

// ── CartItem type (also used by OrderSummary + CheckoutButton) ──────────────
export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

// ── Grid entrance animation ──────────────────────────────────────────────────
const gridVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

// ── Loading skeleton (dark theme) ────────────────────────────────────────────
const DarkSkeleton = ({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) => (
  <div
    className={`rounded-lg animate-pulse ${className}`}
    style={{ background: "rgba(76,29,149,0.15)", ...style }}
  />
);

const LoadingState = () => (
  <div className="min-h-screen" style={{ background: "#0F0A1F" }}>
    {/* Hero skeleton */}
    <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: "16/7" }}>
      <DarkSkeleton className="w-full h-full rounded-none" />
    </div>

    {/* Category nav skeleton */}
    <div className="container mt-0 py-3 flex gap-2">
      {[80, 90, 75, 85, 70].map((w, i) => (
        <DarkSkeleton key={i} style={{ width: w, height: 36, borderRadius: 999 }} className="" />
      ))}
    </div>

    {/* Grid skeleton */}
    <div className="container pb-16 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 pt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden" style={{ background: "rgba(26,18,51,0.7)" }}>
            <DarkSkeleton style={{ aspectRatio: "4/3" }} className="w-full" />
            <div className="p-4 space-y-3">
              <DarkSkeleton style={{ height: 20, width: "75%" }} />
              <DarkSkeleton style={{ height: 16, width: "40%" }} />
              <DarkSkeleton style={{ height: 36 }} className="w-full" />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-5 space-y-4" style={{ background: "rgba(19,13,40,0.85)" }}>
        <DarkSkeleton style={{ height: 24, width: "60%" }} />
        {[1, 2, 3].map((i) => (
          <DarkSkeleton key={i} style={{ height: 44 }} className="w-full" />
        ))}
        <DarkSkeleton style={{ height: 48 }} className="w-full" />
      </div>
    </div>
  </div>
);

// ── Main page component ──────────────────────────────────────────────────────
const DetailPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const { restaurant, isLoading } = useGetRestaurant(restaurantId);
  const { createOrder, isLoading: isOrderLoading } = useCreateOrder();
  const { createGuestOrder, isLoading: isGuestOrderLoading } = useCreateGuestOrder();

  // Cart state — persisted to sessionStorage per restaurant ──────────────────
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = sessionStorage.getItem(`cartItems-${restaurantId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Clear cart on unmount
  useEffect(() => {
    return () => {
      if (restaurantId) sessionStorage.removeItem(`cartItems-${restaurantId}`);
    };
  }, [restaurantId]);

  // Category filter state ────────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState("all");

  // Product modal state ──────────────────────────────────────────────────────
  const [modalItem, setModalItem] = useState<MenuItemType | null>(null);

  // Derived list of filtered menu items ─────────────────────────────────────
  const filteredItems = useMemo(() => {
    if (!restaurant) return [];
    if (activeCategory === "all") return restaurant.menuItems;
    return restaurant.menuItems.filter(
      (item) => getCategoryId(item.name) === activeCategory
    );
  }, [restaurant, activeCategory]);

  // Cart helpers ─────────────────────────────────────────────────────────────
  const persistCart = (items: CartItem[]) => {
    sessionStorage.setItem(`cartItems-${restaurantId}`, JSON.stringify(items));
  };

  const addToCart = (menuItem: MenuItemType, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((c) => c._id === menuItem._id);
      const updated = existing
        ? prev.map((c) =>
            c._id === menuItem._id ? { ...c, quantity: c.quantity + qty } : c
          )
        : [
            ...prev,
            { _id: menuItem._id, name: menuItem.name, price: menuItem.price, quantity: qty },
          ];
      persistCart(updated);
      return updated;
    });
  };

  const removeFromCart = (cartItem: CartItem) => {
    setCartItems((prev) => {
      const updated = prev.filter((c) => c._id !== cartItem._id);
      persistCart(updated);
      return updated;
    });
  };

  const updateCartItemQuantity = (cartItem: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((prev) => {
      const updated = prev.map((c) =>
        c._id === cartItem._id ? { ...c, quantity: newQuantity } : c
      );
      persistCart(updated);
      return updated;
    });
  };

  const getCartQty = (itemId: string) =>
    cartItems.find((c) => c._id === itemId)?.quantity ?? 0;

  // Checkout handlers ────────────────────────────────────────────────────────
  const onCheckout = async (userFormData: UserFormData) => {
    if (!restaurant) return;
    const orderData = {
      cartItems: cartItems.map((c) => ({
        menuItemId: c._id,
        name: c.name,
        quantity: c.quantity.toString(),
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
      cartItems: cartItems.map((c) => ({
        menuItemId: c._id,
        name: c.name,
        quantity: c.quantity.toString(),
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

  // ── Loading & error states ─────────────────────────────────────────────────
  if (isLoading || !restaurant) return <LoadingState />;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen relative"
      style={{ background: "#0F0A1F" }}
    >
      {/* ── Decorative background orbs (non-interactive depth layer) ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #4C1D95 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #4C1D95 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
      </div>

      {/* ── Page content ── */}
      <div className="relative z-10">

        {/* 1. Hero */}
        <div className="container pt-4 pb-0">
          <MenuHero restaurant={restaurant} />
        </div>

        {/* 2. Category navigation */}
        <div className="container">
          <CategoryNav
            categories={MENU_CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            menuItems={restaurant.menuItems}
          />
        </div>

        {/* 3. Main content grid: menu left | cart right */}
        <div className="container py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] gap-8">

            {/* ── Menu Grid ── */}
            <div className="order-2 lg:order-1">
              {/* Section header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(212,175,55,0.3), transparent)" }} />
                <h2
                  className="text-white/60 text-xs font-semibold uppercase tracking-[0.2em] whitespace-nowrap"
                >
                  {activeCategory === "all"
                    ? `${restaurant.menuItems.length} créations`
                    : `${filteredItems.length} créations · ${MENU_CATEGORIES.find(c => c.id === activeCategory)?.label}`}
                </h2>
                <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3))" }} />
              </div>

              {/* Animated grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  variants={gridVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  {filteredItems.length > 0 ? (
                    filteredItems.map((menuItem, i) => (
                      <PremiumMenuCard
                        key={menuItem._id}
                        menuItem={menuItem}
                        index={i}
                        cartQuantity={getCartQty(menuItem._id)}
                        addToCart={() => addToCart(menuItem)}
                        onCardClick={() => setModalItem(menuItem)}
                      />
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-full flex flex-col items-center justify-center py-20 text-center"
                    >
                      <div
                        className="text-4xl mb-3 opacity-30"
                        style={{ filter: "grayscale(1)" }}
                      >
                        🥞
                      </div>
                      <p style={{ color: "rgba(255,255,255,0.3)" }} className="text-sm">
                        Aucune crêpe dans cette catégorie
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Cart sidebar ── */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
              <OrderSummary
                restaurant={restaurant}
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                updateCartItemQuantity={updateCartItemQuantity}
              />

              {/* Checkout button */}
              <div className="mt-3">
                <CheckoutButton
                  disabled={cartItems.length === 0}
                  onCheckout={onCheckout}
                  onGuestCheckout={onGuestCheckout}
                  isLoading={isOrderLoading}
                  isGuestLoading={isGuestOrderLoading}
                />
              </div>

              {/* Security note */}
              <p
                className="text-center text-xs mt-3"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                Paiement en espèces à la livraison · Sécurisé
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Product detail modal */}
      <ProductModal
        item={modalItem}
        isOpen={!!modalItem}
        onClose={() => setModalItem(null)}
        onAddToCart={(item, qty) => addToCart(item, qty)}
        initialCartQty={modalItem ? getCartQty(modalItem._id) : 0}
      />
    </div>
  );
};

export default DetailPage;
