import express from "express";
import * as buyerController from "../controller/buyerController.js"
import { authenticateToken, isPromoter } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/tickets", authenticateToken,buyerController.getUserOrders);
router.post("/order", authenticateToken, buyerController.createOrder);

export default router;