import { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import cloudinary from "cloudinary";
import { transformRestaurant, transformOrder } from "../lib/transform";

const getMyRestaurant = async (req: Request, res: Response) => {
  try {
    const { data: restaurant, error } = await supabase
      .from("restaurants")
      .select("*")
      .eq("user_id", req.userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    res.json(restaurant ? transformRestaurant(restaurant as Record<string, unknown>) : null);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching restaurant" });
  }
};

const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    const { data: existingRestaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("user_id", req.userId)
      .single();

    if (existingRestaurant) {
      return res.status(409).json({ message: "User restaurant already exists" });
    }

    const imageUrl = await uploadImage(req.file as Express.Multer.File);

    const deliveryPrice = req.body.deliveryPrice
      ? Math.round(parseFloat(req.body.deliveryPrice) * 100)
      : 0;
    const menuItems = Array.isArray(req.body.menuItems)
      ? req.body.menuItems.map((item: Record<string, unknown>) => ({
          id: item._id || item.id || crypto.randomUUID(),
          name: item.name,
          price: item.price ? Math.round(parseFloat(String(item.price)) * 100) : 0,
          imageUrl: item.imageUrl,
        }))
      : [];

    const { data: restaurant, error } = await supabase
      .from("restaurants")
      .insert({
        user_id: req.userId,
        restaurant_name: req.body.restaurantName,
        city: req.body.city,
        country: req.body.country,
        delivery_price: deliveryPrice,
        estimated_delivery_time: req.body.estimatedDeliveryTime,
        cuisines: req.body.cuisines || [],
        menu_items: menuItems,
        image_url: imageUrl,
        last_updated: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).send(transformRestaurant(restaurant as Record<string, unknown>));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateMyRestaurant = async (req: Request, res: Response) => {
  try {
    const { data: restaurant, error: fetchErr } = await supabase
      .from("restaurants")
      .select("*")
      .eq("user_id", req.userId)
      .single();

    if (fetchErr || !restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }

    const deliveryPrice = req.body.deliveryPrice
      ? Math.round(parseFloat(req.body.deliveryPrice) * 100)
      : restaurant.delivery_price;
    const menuItems = Array.isArray(req.body.menuItems)
      ? req.body.menuItems.map((item: Record<string, unknown>) => ({
          id: item._id || item.id || crypto.randomUUID(),
          name: item.name,
          price: item.price ? Math.round(parseFloat(String(item.price)) * 100) : 0,
          imageUrl: item.imageUrl,
        }))
      : restaurant.menu_items;

    const updateData: Record<string, unknown> = {
      restaurant_name: req.body.restaurantName,
      city: req.body.city,
      country: req.body.country,
      delivery_price: deliveryPrice,
      estimated_delivery_time: req.body.estimatedDeliveryTime,
      cuisines: req.body.cuisines,
      menu_items: menuItems,
      last_updated: new Date().toISOString(),
    };

    if (req.file) {
      updateData.image_url = await uploadImage(req.file as Express.Multer.File);
    }

    const { data: updated, error } = await supabase
      .from("restaurants")
      .update(updateData)
      .eq("id", restaurant.id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).send(transformRestaurant(updated as Record<string, unknown>));
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getMyRestaurantOrders = async (req: Request, res: Response) => {
  try {
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("user_id", req.userId)
      .single();

    if (!restaurant) {
      return res.json([]);
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*, restaurant:restaurants(*), user:profiles(*)")
      .eq("restaurant_id", restaurant.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const transformed = (orders || []).map((o: Record<string, unknown>) => {
      const rest = o.restaurant as Record<string, unknown>;
      const usr = o.user as Record<string, unknown>;
      return transformOrder(o, rest, usr);
    });

    res.json(transformed);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!orderId || !uuidRegex.test(orderId)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*, restaurant:restaurants(user_id)")
      .eq("id", orderId)
      .single();

    if (orderErr || !order) {
      return res.status(404).json({ message: "order not found" });
    }

    const rest = order.restaurant as { user_id?: string } | null;
    if (rest?.user_id !== req.userId) {
      return res.status(401).send();
    }

    const { data: updated, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json(transformOrder(updated as Record<string, unknown>, null, null));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "unable to update order status" });
  }
};

const uploadImage = async (file: Express.Multer.File) => {
  const buffer: Buffer = Buffer.isBuffer(file.buffer)
    ? file.buffer
    : Buffer.from(file.buffer as ArrayBuffer);
  const base64Image = buffer.toString("base64");
  const dataURI = `data:${file.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};

export default {
  updateOrderStatus,
  getMyRestaurantOrders,
  getMyRestaurant,
  createMyRestaurant,
  updateMyRestaurant,
};
