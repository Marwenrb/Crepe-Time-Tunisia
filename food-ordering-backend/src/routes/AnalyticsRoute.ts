import express from "express";
import verifyToken from "../middleware/auth";
import requireAdmin from "../middleware/requireAdmin";
import AnalyticsController from "../controllers/AnalyticsController";
import { supabase } from "../lib/supabase";

const router = express.Router();

router.get("/", verifyToken, requireAdmin, AnalyticsController.getAnalyticsData);

router.get("/db-test", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { count, error } = await supabase.from("orders").select("*", { count: "exact", head: true });
    if (error) throw error;
    res.json({
      message: "Database connection OK",
      orderCount: count ?? 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("DB test error:", error);
    res.status(500).json({
      message: "Database error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/debug-orders", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*, restaurant:restaurants(restaurant_name, cuisines)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const orderData = (orders || []).map((o: Record<string, unknown>) => {
      const details = o.delivery_details as { city?: string } | null;
      const rest = o.restaurant as { id?: string; restaurant_name?: string; cuisines?: string[] } | null;
      return {
        id: o.id,
        city: details?.city || "NO CITY",
        amount: o.total_amount || 0,
        createdAt: o.created_at,
        restaurant: rest
          ? { id: rest.id, name: rest.restaurant_name, cuisines: rest.cuisines }
          : null,
      };
    });

    res.json({ totalOrders: orderData.length, orders: orderData });
  } catch (error) {
    console.error("Debug orders error:", error);
    res.status(500).json({
      message: "Database error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/debug-restaurants", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { data: restaurants, error } = await supabase.from("restaurants").select("*");
    if (error) throw error;

    const restaurantData = (restaurants || []).map((r: Record<string, unknown>) => ({
      id: r.id,
      name: r.restaurant_name,
      cuisines: r.cuisines,
      city: r.city,
    }));

    res.json({ totalRestaurants: restaurantData.length, restaurants: restaurantData });
  } catch (error) {
    console.error("Debug restaurants error:", error);
    res.status(500).json({
      message: "Database error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
