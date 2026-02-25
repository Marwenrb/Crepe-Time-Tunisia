import express from "express";
import verifyToken from "../middleware/auth";
import OrderController from "../controllers/OrderController";

const router = express.Router();

router.get("/", verifyToken, OrderController.getMyOrders);
router.post("/create", verifyToken, OrderController.createOrder);

export default router;
