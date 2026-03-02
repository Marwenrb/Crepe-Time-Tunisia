import express from "express";
import verifyToken from "../middleware/auth";
import OrderController from "../controllers/OrderController";

const router = express.Router();

router.get("/track/:orderId", OrderController.getOrderById);
router.get("/", verifyToken, OrderController.getMyOrders);
router.post("/create", verifyToken, OrderController.createOrder);
router.post("/create-guest", OrderController.createGuestOrder);

export default router;
