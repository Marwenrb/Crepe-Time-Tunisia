import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDatabase } from "./lib/db";
import myUserRoute from "./routes/MyUserRoute";
import authRoute from "./routes/auth";
import { v2 as cloudinary } from "cloudinary";
import myRestaurantRoute from "./routes/MyRestaurantRoute";
import restaurantRoute from "./routes/RestaurantRoute";
import orderRoute from "./routes/OrderRoute";
import analyticsRoute from "./routes/AnalyticsRoute";

(async () => {
  await connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

const serverStartTime = Date.now();
const frontendOriginsFromEnv = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = Array.from(
  new Set([
    ...frontendOriginsFromEnv,
    "http://localhost:5173",
    "http://localhost:3000",
  ])
);

app.use(helmet({ contentSecurityPolicy: false }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
  })
);

app.use(cookieParser());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").split(",")[0].trim();
  // In production, redirect browsers to the frontend; bots/curl get a simple JSON response
  if (process.env.NODE_ENV === "production") {
    const accept = req.headers.accept || "";
    if (accept.includes("text/html")) {
      res.redirect(301, frontendUrl);
      return;
    }
  }
  res.json({
    service: "Crêpe Time Tunisia — API",
    status: "running",
    frontend: frontendUrl,
    docs: "/api/health",
  });
});

const healthHandler = async (req: Request, res: Response) => {
  const uptime = Math.floor((Date.now() - serverStartTime) / 1000);
  res.json({
    message: "health OK!",
    uptime: uptime,
    timestamp: new Date().toISOString(),
    serverStartTime: new Date(serverStartTime).toISOString(),
  });
};
app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

app.use("/api/auth", authRoute);
app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant", myRestaurantRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/order", orderRoute);
app.use("/api/business-insights", analyticsRoute);

// 404 for unknown API routes
app.use("/api/*", (req: Request, res: Response) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, _next: Function) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Crêpe Time Tunisia API started on port ${PORT}`);
});
})();
