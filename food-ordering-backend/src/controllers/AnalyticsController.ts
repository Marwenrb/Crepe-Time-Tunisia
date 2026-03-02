import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

const getAnalyticsData = async (req: Request, res: Response) => {
  try {
    const timeRange = req.query.timeRange || "30d";
    const days =
      timeRange === "7d" ? 7 : timeRange === "90d" ? 90 : timeRange === "1y" ? 365 : 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*, restaurant:restaurants(*)")
      .gte("created_at", startDate.toISOString());

    if (error) throw error;

    const ordersList = orders || [];

    const totalOrders = ordersList.length;
    const totalRevenue = ordersList.reduce((sum: number, o: Record<string, unknown>) => sum + (Number(o.total_amount) || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const uniqueCustomers = new Set(
      ordersList
        .filter((o: Record<string, unknown>) => o.user_id)
        .map((o: Record<string, unknown>) => String(o.user_id))
    ).size;

    const cityStats: Record<string, { orders: number; revenue: number }> = {};
    ordersList.forEach((o: Record<string, unknown>) => {
      const details = o.delivery_details as { city?: string } | null;
      const city = details?.city || "Unknown";
      if (!cityStats[city]) cityStats[city] = { orders: 0, revenue: 0 };
      cityStats[city].orders += 1;
      cityStats[city].revenue += Number(o.total_amount) || 0;
    });

    const topCities = Object.entries(cityStats)
      .map(([city, stats]) => ({ city, orders: stats.orders, revenue: stats.revenue }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);

    const cuisineStats: Record<string, number> = {};
    ordersList.forEach((o: Record<string, unknown>) => {
      const rest = o.restaurant as { cuisines?: string[] } | null;
      if (rest?.cuisines) {
        rest.cuisines.forEach((c: string) => {
          cuisineStats[c] = (cuisineStats[c] || 0) + 1;
        });
      }
    });

    const topCuisines = Object.entries(cuisineStats)
      .map(([cuisine, count]) => ({
        cuisine,
        orders: count,
        percentage: Math.round((count / totalOrders) * 100 * 100) / 100,
      }))
      .sort((a, b) => b.orders - a.orders);

    const recentOrders = ordersList
      .filter((o: Record<string, unknown>) => o.delivery_details)
      .sort(
        (a, b) =>
          new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime()
      )
      .map((o: Record<string, unknown>) => {
        const details = o.delivery_details as { name?: string };
        return {
          id: o.id,
          customer: details?.name || "",
          amount: o.total_amount || 0,
          status: o.status,
          date: (o.created_at as string)?.split("T")[0] || "",
        };
      });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = [];
    for (let i = 0; i < 12; i++) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - (11 - i));
      monthStart.setDate(1);
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0);

      const monthOrders = ordersList.filter((o: Record<string, unknown>) => {
        const d = new Date(o.created_at as string);
        return d >= monthStart && d <= monthEnd;
      });
      const monthRevenue = monthOrders.reduce((s, o) => s + (Number((o as Record<string, unknown>).total_amount) || 0), 0);
      monthlyData.push({
        month: months[monthStart.getMonth()],
        orders: monthOrders.length,
        revenue: monthRevenue,
      });
    }

    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - days);

    const { data: previousOrders } = await supabase
      .from("orders")
      .select("total_amount")
      .gte("created_at", previousStartDate.toISOString())
      .lt("created_at", startDate.toISOString());

    const previousTotalRevenue = (previousOrders || []).reduce((s, o) => s + (Number(o.total_amount) || 0), 0);
    const previousTotalOrders = (previousOrders || []).length;

    let orderGrowth = 0;
    let revenueGrowth = 0;

    const { data: firstOrder } = await supabase
      .from("orders")
      .select("created_at")
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    const businessAge = firstOrder
      ? Math.floor(
          (Date.now() - new Date(firstOrder.created_at).getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;

    if (businessAge < 60) {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      const { data: currentMonthOrders } = await supabase
        .from("orders")
        .select("total_amount")
        .gte("created_at", new Date(currentYear, currentMonth, 1).toISOString())
        .lt("created_at", new Date(currentYear, currentMonth + 1, 1).toISOString());

      const { data: previousMonthOrders } = await supabase
        .from("orders")
        .select("total_amount")
        .gte("created_at", new Date(prevYear, prevMonth, 1).toISOString())
        .lt("created_at", new Date(prevYear, prevMonth + 1, 1).toISOString());

      const currentMonthRevenue = (currentMonthOrders || []).reduce((s, o) => s + (Number(o.total_amount) || 0), 0);
      const previousMonthRevenue = (previousMonthOrders || []).reduce((s, o) => s + (Number(o.total_amount) || 0), 0);

      if ((previousMonthOrders || []).length === 0 && (currentMonthOrders || []).length > 0) {
        orderGrowth = 100;
        revenueGrowth = 100;
      } else if ((previousMonthOrders || []).length > 0) {
        orderGrowth = Math.round(
          (((currentMonthOrders || []).length - (previousMonthOrders || []).length) /
            (previousMonthOrders || []).length) *
            100
        );
        revenueGrowth = Math.round(
          ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
        );
      }
    } else {
      if (previousTotalOrders === 0 && totalOrders > 0) {
        orderGrowth = 100;
        revenueGrowth = 100;
      } else if (previousTotalOrders > 0) {
        orderGrowth = Math.round(((totalOrders - previousTotalOrders) / previousTotalOrders) * 100);
        revenueGrowth = Math.round(((totalRevenue - previousTotalRevenue) / previousTotalRevenue) * 100);
      }
    }

    res.json({
      totalOrders,
      totalRevenue,
      averageOrderValue,
      totalCustomers: uniqueCustomers,
      orderGrowth,
      revenueGrowth,
      topCities,
      topCuisines,
      recentOrders,
      monthlyData,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Error fetching analytics data" });
  }
};

export default {
  getAnalyticsData,
};
