import express from "express";
import * as promoterController from "../controller/promoterController.js";
import { authenticateToken, isPromoter } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", authenticateToken, isPromoter, promoterController.getPromoterProfile);

export default router;
