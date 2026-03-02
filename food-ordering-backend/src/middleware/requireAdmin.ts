import { NextFunction, Request, Response } from "express";
import { supabase } from "../lib/supabase";

/**
 * Restricts access to admin users only (users who own a restaurant).
 * Must be used after verifyToken.
 */
export default async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { data: user } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", req.userId)
      .single();

    const { data: ownsRestaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("user_id", req.userId)
      .limit(1)
      .single();

    if (user?.is_admin || ownsRestaurant) {
      return next();
    }

    return res.status(403).json({ message: "Accès réservé à l'administrateur" });
  } catch {
    return res.status(403).json({ message: "Accès refusé" });
  }
}
