import express from "express";
import multer from "multer";
import MyRestaurantController from "../controllers/MyRestaurantController";
import verifyToken from "../middleware/auth";
import requireAdmin from "../middleware/requireAdmin";
import { validateMyRestaurantRequest } from "../middleware/validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb
  },
});

// Admin only: restaurant management & order dashboard
router.get("/order", verifyToken, requireAdmin, MyRestaurantController.getMyRestaurantOrders);
router.patch("/order/:orderId/status", verifyToken, requireAdmin, MyRestaurantController.updateOrderStatus);
router.get("/", verifyToken, requireAdmin, MyRestaurantController.getMyRestaurant);
router.post(
  "/",
  upload.single("imageFile"),
  validateMyRestaurantRequest,
  verifyToken,
  requireAdmin,
  MyRestaurantController.createMyRestaurant
);
router.put(
  "/",
  upload.single("imageFile"),
  validateMyRestaurantRequest,
  verifyToken,
  requireAdmin,
  MyRestaurantController.updateMyRestaurant
);

export default router;
