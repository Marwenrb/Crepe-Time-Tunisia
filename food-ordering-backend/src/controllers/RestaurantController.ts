import { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { transformRestaurant } from "../lib/transform";

const isValidUuid = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.restaurantId;

    if (!restaurantId || !isValidUuid(restaurantId)) {
      return res.status(400).json({
        message: "Invalid restaurant ID format",
      });
    }

    const { data: restaurant, error } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", restaurantId)
      .single();

    if (error || !restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }

    res.json(transformRestaurant(restaurant as Record<string, unknown>));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const searchRestaurant = async (req: Request, res: Response) => {
  try {
    const city = req.params.city;
    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const sortOption = (req.query.sortOption as string) || "last_updated";
    const page = parseInt(req.query.page as string) || 1;

    let query = supabase.from("restaurants").select("*", { count: "exact" });

    if (city && city.toLowerCase() !== "all") {
      query = query.ilike("city", `%${city}%`);
    }

    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines.split(",").map((c) => c.trim()).filter(Boolean);
      if (cuisinesArray.length > 0) {
        query = query.overlaps("cuisines", cuisinesArray);
      }
    }

    if (searchQuery) {
      query = query.ilike("restaurant_name", `%${searchQuery}%`);
    }

    const sortCol = sortOption === "lastUpdated" ? "last_updated" : sortOption;
    const pageSize = 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: restaurants, error, count } = await query
      .order(sortCol, { ascending: true })
      .range(from, to);

    if (error) throw error;

    const transformed = (restaurants || []).map((r) => transformRestaurant(r as Record<string, unknown>));

    res.json({
      data: transformed,
      pagination: {
        total: count || 0,
        page,
        pages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getDefaultRestaurant = async (req: Request, res: Response) => {
  try {
    const city = req.params.city || "Nabeul";
    const { data: restaurant, error } = await supabase
      .from("restaurants")
      .select("*")
      .ilike("city", `%${city}%`)
      .limit(1)
      .single();

    if (error || !restaurant) {
      return res.status(404).json({ message: "No restaurant found" });
    }

    res.json(transformRestaurant(restaurant as Record<string, unknown>));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getAllCities = async (req: Request, res: Response) => {
  try {
    const { data: restaurants, error } = await supabase.from("restaurants").select("city");
    if (error) throw error;
    const cities = [...new Set((restaurants || []).map((r) => r.city).filter(Boolean))];
    res.json({ cities });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default {
  getRestaurant,
  searchRestaurant,
  getAllCities,
  getDefaultRestaurant,
};
