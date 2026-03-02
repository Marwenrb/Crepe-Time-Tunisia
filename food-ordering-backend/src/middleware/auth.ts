import { NextFunction, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    token = req.cookies["session_id"];
  }

  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ message: "unauthorized" });
    }
    req.userId = user.id;
    next();
  } catch {
    return res.status(401).json({ message: "unauthorized" });
  }
};

export default verifyToken;
