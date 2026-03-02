import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import { supabase } from "../lib/supabase";

const router = express.Router();

/**
 * Validate Supabase JWT and return user info.
 * Frontend uses Supabase Auth (signInWithPassword, signInWithOAuth).
 * Token is sent in Authorization header.
 */
router.get("/validate-token", verifyToken, async (req: Request, res: Response) => {
  try {
    const { data: profile } = await supabase
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

    const isAdmin = !!profile?.is_admin || !!ownsRestaurant;
    res.status(200).json({ userId: req.userId, isAdmin });
  } catch {
    res.status(200).json({ userId: req.userId, isAdmin: false });
  }
});

router.post("/logout", (req: Request, res: Response) => {
  res.cookie("session_id", "", {
    expires: new Date(0),
    maxAge: 0,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
  res.send();
});

export default router;
