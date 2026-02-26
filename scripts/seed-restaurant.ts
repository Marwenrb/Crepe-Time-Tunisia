/**
 * Seed the Crêpe Time Tunisia restaurant with 12 artisanal crêpes.
 * Run: cd food-ordering-backend && npx ts-node ../scripts/seed-restaurant.ts
 * Requires MONGODB_URI in .env
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  addressLine1: { type: String },
  city: { type: String },
  country: { type: String },
  image: { type: String },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

const menuItemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true, default: () => new mongoose.Types.ObjectId() },
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const restaurantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  restaurantName: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  deliveryPrice: { type: Number, required: true },
  estimatedDeliveryTime: { type: Number, required: true },
  cuisines: { type: [String], required: true },
  menuItems: { type: [menuItemSchema], required: true },
  imageUrl: { type: String, required: true },
  lastUpdated: { type: Date, required: true },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

const CREPE_MENU = [
  { name: "Crêpe Nutella Banane",        price: 1200 },
  { name: "Crêpe Fraise Crème",          price: 1400 },
  { name: "Crêpe Lotus Biscoff",         price: 1500 },
  { name: "Crêpe Kinder Bueno",          price: 1600 },
  { name: "Crêpe Oréo Crème",            price: 1400 },
  { name: "Crêpe Caramel Noix de Pécan", price: 1500 },
  { name: "Crêpe Fruits des Bois",       price: 1300 },
  { name: "Crêpe Pistache Rose",         price: 1700 },
  { name: "Crêpe Coco Mangue",           price: 1400 },
  { name: "Crêpe Miel & Noix",           price: 1100 },
  { name: "Crêpe Sucre & Citron",        price: 900  },
  { name: "Crêpe Time Signature",        price: 1900 },
];

async function main() {
  const uri = process.env.MONGODB_URI || process.env.MONGODB_CONNECTION_STRING;
  if (!uri) {
    console.error("Set MONGODB_URI in .env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  let owner = await User.findOne({ email: "admin@crepetime.tn" });
  if (!owner) {
    owner = new User({
      email: "admin@crepetime.tn",
      password: "CrepeTime2026!",
      name: "Marouan Rabai",
      city: "Nabeul",
      country: "Tunisia",
    });
    await owner.save();
    console.log("Created admin user: admin@crepetime.tn / CrepeTime2026!");
  } else {
    console.log("Admin user already exists:", owner.email);
  }

  const existing = await Restaurant.findOne({ restaurantName: "Crêpe Time Tunisia" });
  if (existing) {
    console.log("Restaurant already exists. Updating menu...");
    existing.menuItems = CREPE_MENU.map((item) => ({
      _id: new mongoose.Types.ObjectId(),
      ...item,
    }));
    existing.lastUpdated = new Date();
    await existing.save();
    console.log("Menu updated with", CREPE_MENU.length, "crêpes");
  } else {
    const restaurant = new Restaurant({
      user: owner._id,
      restaurantName: "Crêpe Time Tunisia",
      city: "Nabeul",
      country: "Tunisia",
      deliveryPrice: 300,
      estimatedDeliveryTime: 30,
      cuisines: ["Crêpes", "Desserts", "Français"],
      menuItems: CREPE_MENU.map((item) => ({
        _id: new mongoose.Types.ObjectId(),
        ...item,
      })),
      imageUrl: "https://images.unsplash.com/photo-1635350736475-c8cef4b21906?w=1200&q=90",
      lastUpdated: new Date(),
    });
    await restaurant.save();
    console.log("Created restaurant: Crêpe Time Tunisia");
    console.log("Menu:", CREPE_MENU.length, "crêpes");
    console.log("Delivery fee: 3.00 TND");
    console.log("Estimated delivery: 30 min");
  }

  console.log("\n--- Menu ---");
  CREPE_MENU.forEach((item, i) => {
    console.log(`  ${i + 1}. ${item.name} — ${(item.price / 100).toFixed(2)} TND`);
  });

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
