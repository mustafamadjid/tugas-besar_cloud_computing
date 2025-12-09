import { Router } from "express";
import { googleSignInBuyer,googleSignInPromoter } from "../controller/googleAuthController.js";

const router = Router();

// POST /api/auth/buyer
router.post("/buyer", googleSignInBuyer);
router.post("/promoter", googleSignInPromoter);

export default router;
