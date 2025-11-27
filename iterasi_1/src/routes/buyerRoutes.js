import express from "express";
import * as buyerController from "../controller/buyerController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Buyer profile
router.get("/", buyerController.getAllBuyers);
router.get("/:id", buyerController.getBuyerById);
router.put("/:id", authenticateToken, buyerController.updateBuyer);
router.delete("/:id", authenticateToken, buyerController.deleteBuyer);

// Orders for buyer
router.get("/:buyerId/orders", authenticateToken, buyerController.getBuyerOrders);
router.get("/:buyerId/orders/:orderId", authenticateToken, buyerController.getBuyerOrderById);
router.post("/:buyerId/orders", authenticateToken, buyerController.createOrder);
router.post("/:buyerId/orders/:orderId/cancel", authenticateToken, buyerController.cancelOrder);

export default router;
