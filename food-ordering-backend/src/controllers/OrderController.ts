import { Request, Response } from "express";
import Restaurant, { MenuItemType } from "../models/restaurant";
import Order from "../models/order";
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
    const activeStatuses = [
      "placed",
      "confirmed",
      "inProgress",
      "outForDelivery",
      "delivered",
    ];
    const orders = await Order.find({
      user: req.userId,
      status: { $in: activeStatuses },
    })
      .populate("restaurant")
      .populate("user");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const createOrder = async (req: Request, res: Response) => {
  try {
    const orderRequest: CreateOrderRequest = req.body;

    const restaurant = await Restaurant.findById(orderRequest.restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menuItems = restaurant.menuItems as Array<{ _id: unknown; name: string; price: number }>;
    let subtotal = 0;
    const validatedCartItems = orderRequest.cartItems.map((cartItem) => {
      const menuItem = menuItems.find(
        (m) => String(m._id) === String(cartItem.menuItemId)
      );

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

    const totalAmount = subtotal + Number(restaurant.deliveryPrice);

    const newOrder = new Order({
      restaurant: restaurant._id,
      user: req.userId,
      status: "placed",
      deliveryDetails: {
        ...orderRequest.deliveryDetails,
        phone: orderRequest.deliveryDetails.phone || "",
      },
      cartItems: validatedCartItems,
      totalAmount,
      paymentMethod: orderRequest.paymentMethod || "cash",
      createdAt: new Date(),
    });

    await newOrder.save();

    try {
      const whatsappResult = await sendWhatsAppNotification({
        orderId: newOrder._id.toString(),
        customerName: orderRequest.deliveryDetails.name,
        customerPhone: orderRequest.deliveryDetails.phone,
        deliveryAddress: `${orderRequest.deliveryDetails.addressLine1}, ${orderRequest.deliveryDetails.city}`,
        cartItems: validatedCartItems,
        subtotal,
        deliveryFee: restaurant.deliveryPrice,
        total: totalAmount,
        paymentMethod: orderRequest.paymentMethod || "cash",
      });

      res.status(201).json({
        order: newOrder,
        whatsappUrl: whatsappResult.whatsappUrl,
        whatsappSent: whatsappResult.sent,
        redirectUrl: `${FRONTEND_URL}/order-status?success=true`,
      });
    } catch (whatsappError) {
      console.error("WhatsApp notification failed:", whatsappError);
      res.status(201).json({
        order: newOrder,
        whatsappUrl: null,
        whatsappSent: false,
        redirectUrl: `${FRONTEND_URL}/order-status?success=true`,
      });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

export default {
  getMyOrders,
  createOrder,
};
