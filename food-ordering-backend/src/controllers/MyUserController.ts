import { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { toApiFormat } from "../lib/transform";

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    let { data: user, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", req.userId)
      .single();

    const shouldBackfillFromAuth =
      error ||
      !user ||
      !user.name ||
      !user.email ||
      !user.phone;

    if (shouldBackfillFromAuth) {
      const { data: authUser } = await supabase.auth.admin.getUserById(req.userId);
      if (authUser?.user) {
        const { id, email, user_metadata } = authUser.user;
        await supabase.from("profiles").upsert(
          {
            id,
            email: email || undefined,
            name: user_metadata?.name || user_metadata?.full_name,
            image: user_metadata?.picture,
            phone: user_metadata?.phone,
          },
          { onConflict: "id" }
        );
        const { data: newProfile } = await supabase.from("profiles").select("*").eq("id", req.userId).single();
        user = newProfile;
      }
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(toApiFormat(user as Record<string, unknown>));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const { data: authUser } = await supabase.auth.admin.getUserById(req.userId);
    if (authUser?.user) {
      const { id, email, user_metadata } = authUser.user;
      await supabase.from("profiles").upsert(
        {
          id,
          email: email || undefined,
          name: user_metadata?.name || user_metadata?.full_name,
          image: user_metadata?.picture,
          phone: user_metadata?.phone,
        },
        { onConflict: "id" }
      );
      return res.status(200).send();
    }

    res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, country, city, phone } = req.body;

    const updatePayload: {
      name: string;
      address_line1: string;
      city: string;
      country: string;
      phone?: string;
    } = {
      name,
      address_line1: addressLine1,
      city,
      country,
    };

    if (typeof phone === "string") {
      updatePayload.phone = phone;
    }

    const { data: user, error } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", req.userId)
      .select()
      .single();

    if (error || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.send(toApiFormat(user as Record<string, unknown>));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export default {
  getCurrentUser,
  createCurrentUser,
  updateCurrentUser,
};
