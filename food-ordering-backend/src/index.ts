import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";
import authRoute from "./routes/auth";
import { v2 as cloudinary } from "cloudinary";
import myRestaurantRoute from "./routes/MyRestaurantRoute";
import restaurantRoute from "./routes/RestaurantRoute";
import orderRoute from "./routes/OrderRoute";
import analyticsRoute from "./routes/AnalyticsRoute";

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_CONNECTION_STRING;
mongoose.connect(MONGODB_URI as string).then(() => console.log("Connected to database!"));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

const serverStartTime = Date.now();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:3000",
    ].filter((o): o is string => Boolean(o)),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
  })
);

app.use(cookieParser());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send(
    `<h1>🧇 Crêpe Time Tunisia — API Server</h1><p>Backend is running. Visit <a href='${process.env.FRONTEND_URL || "http://localhost:5173"}'>Crêpe Time</a> to place an order.</p>`
  );
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Crêpe Time Tunisia API started on port ${PORT}`);
});
