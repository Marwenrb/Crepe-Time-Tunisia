import { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { transformRestaurant, transformOrder } from "../lib/transform";
import { sendWhatsAppNotification } from "../services/whatsapp";

const FRONTEND_URL = process.env.FRONTEND_URL as string;

type CreateOrderRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
    phone?: string;
  };
  restaurantId: string;
  paymentMethod: "cash" | "pickup";
};

const getMyOrders = async (req: Request, res: Response) => {
  try {
    const activeStatuses = ["placed", "confirmed", "inProgress", "outForDelivery", "delivered"];
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*, restaurant:restaurants(*)")
      .eq("user_id", req.userId)
      .in("status", activeStatuses)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const transformed = (orders || []).map((o: Record<string, unknown>) => {
      const rest = o.restaurant as Record<string, unknown>;
      return transformOrder(o, rest, null);
    });

    res.json(transformed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

/** Public: get order by ID for guest tracking (no auth required) */
const getOrderById = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!orderId || !uuidRegex.test(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const { data: order, error } = await supabase
      .from("orders")
      .select("*, restaurant:restaurants(*)")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const rest = order as Record<string, unknown>;
    const restaurant = rest.restaurant as Record<string, unknown>;
    const transformed = transformOrder(rest, restaurant, null);
    res.json(transformed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const createOrder = async (req: Request, res: Response) => {
  try {
    const orderRequest: CreateOrderRequest = req.body;

    const { data: restaurant, error: restErr } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", orderRequest.restaurantId)
      .single();

    if (restErr || !restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menuItems = (restaurant.menu_items as Array<{ id?: string; _id?: string; name: string; price: number }>) || [];
    let subtotal = 0;
    const validatedCartItems = orderRequest.cartItems.map((cartItem) => {
      const menuItem = menuItems.find((m) => String(m.id || m._id) === String(cartItem.menuItemId));
      if (!menuItem) {
        throw new Error(`Menu item not found: ${cartItem.menuItemId}`);
      }
      const quantity = parseInt(String(cartItem.quantity), 10);
      subtotal += menuItem.price * quantity;
      return {
        menuItemId: cartItem.menuItemId,
        name: menuItem.name,
        quantity,
        price: menuItem.price,
      };
    });

    const totalAmount = subtotal + Number(restaurant.delivery_price);

    const { data: newOrder, error: orderErr } = await supabase
      .from("orders")
      .insert({
        restaurant_id: orderRequest.restaurantId,
        user_id: req.userId,
        status: "placed",
        delivery_details: {
          ...orderRequest.deliveryDetails,
          phone: orderRequest.deliveryDetails.phone || "",
        },
        cart_items: validatedCartItems.map((c) => ({ menuItemId: c.menuItemId, name: c.name, quantity: c.quantity })),
        total_amount: totalAmount,
        payment_method: orderRequest.paymentMethod || "cash",
      })
      .select()
      .single();

    if (orderErr || !newOrder) {
      throw orderErr || new Error("Failed to create order");
    }

    const { data: userRow } = await supabase.from("profiles").select("*").eq("id", req.userId).single();

    try {
      const whatsappResult = await sendWhatsAppNotification({
        orderId: newOrder.id,
        customerName: orderRequest.deliveryDetails.name,
        customerPhone: orderRequest.deliveryDetails.phone,
        deliveryAddress: `${orderRequest.deliveryDetails.addressLine1}, ${orderRequest.deliveryDetails.city}`,
        cartItems: validatedCartItems,
        subtotal,
        deliveryFee: restaurant.delivery_price,
        total: totalAmount,
        paymentMethod: orderRequest.paymentMethod || "cash",
      });

      const transformed = transformOrder(
        newOrder as Record<string, unknown>,
        restaurant as Record<string, unknown>,
        userRow as Record<string, unknown> | null
      );
      res.status(201).json({
        order: transformed,
        whatsappUrl: whatsappResult.whatsappUrl,
        whatsappSent: whatsappResult.sent,
        redirectUrl: `${FRONTEND_URL}/order-status?success=true`,
      });
    } catch (whatsappError) {
      console.error("WhatsApp notification failed:", whatsappError);
      const transformed = transformOrder(
        newOrder as Record<string, unknown>,
        restaurant as Record<string, unknown>,
        userRow as Record<string, unknown> | null
      );
      res.status(201).json({
        order: transformed,
        whatsappUrl: null,
        whatsappSent: false,
        redirectUrl: `${FRONTEND_URL}/order-status?success=true`,
      });
    }
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: (error as Error).message || "Something went wrong" });
  }
};

const createGuestOrder = async (req: Request, res: Response) => {
  try {
    const orderRequest: CreateOrderRequest = req.body;

    const { data: restaurant, error: restErr } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", orderRequest.restaurantId)
      .single();

    if (restErr || !restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menuItems = (restaurant.menu_items as Array<{ id?: string; _id?: string; name: string; price: number }>) || [];
    let subtotal = 0;
    const validatedCartItems = orderRequest.cartItems.map((cartItem) => {
      const menuItem = menuItems.find((m) => String(m.id || m._id) === String(cartItem.menuItemId));
      if (!menuItem) {
        throw new Error(`Menu item not found: ${cartItem.menuItemId}`);
      }
      const quantity = parseInt(String(cartItem.quantity), 10);
      subtotal += menuItem.price * quantity;
      return {
        menuItemId: cartItem.menuItemId,
        name: menuItem.name,
        quantity,
        price: menuItem.price,
      };
    });

    const totalAmount = subtotal + Number(restaurant.delivery_price);

    const guestEmail =
      orderRequest.deliveryDetails.email?.trim() ||
      `guest-${Date.now()}@crepetime.tn`;

    const { data: newOrder, error: orderErr } = await supabase
      .from("orders")
      .insert({
        restaurant_id: orderRequest.restaurantId,
        user_id: null,
        status: "placed",
        delivery_details: {
          ...orderRequest.deliveryDetails,
          email: guestEmail,
          phone: orderRequest.deliveryDetails.phone || "",
        },
        cart_items: validatedCartItems.map((c) => ({ menuItemId: c.menuItemId, name: c.name, quantity: c.quantity })),
        total_amount: totalAmount,
        payment_method: orderRequest.paymentMethod || "cash",
      })
      .select()
      .single();

    if (orderErr || !newOrder) {
      throw orderErr || new Error("Failed to create order");
    }

    try {
      const whatsappResult = await sendWhatsAppNotification({
        orderId: newOrder.id,
        customerName: orderRequest.deliveryDetails.name,
        customerPhone: orderRequest.deliveryDetails.phone,
        deliveryAddress: `${orderRequest.deliveryDetails.addressLine1}, ${orderRequest.deliveryDetails.city}`,
        cartItems: validatedCartItems,
        subtotal,
        deliveryFee: restaurant.delivery_price,
        total: totalAmount,
        paymentMethod: orderRequest.paymentMethod || "cash",
      });

      const transformed = transformOrder(newOrder as Record<string, unknown>, restaurant as Record<string, unknown>, null);
      res.status(201).json({
        order: transformed,
        whatsappUrl: whatsappResult.whatsappUrl,
        whatsappSent: whatsappResult.sent,
        redirectUrl: `${FRONTEND_URL}/order-status?success=true`,
      });
    } catch (whatsappError) {
      console.error("WhatsApp notification failed:", whatsappError);
      const transformed = transformOrder(newOrder as Record<string, unknown>, restaurant as Record<string, unknown>, null);
      res.status(201).json({
        order: transformed,
        whatsappUrl: null,
        whatsappSent: false,
        redirectUrl: `${FRONTEND_URL}/order-status?success=true`,
      });
    }
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: (error as Error).message || "Something went wrong" });
  }
};

export default {
  getMyOrders,
  getOrderById,
  createOrder,
  createGuestOrder,
};
