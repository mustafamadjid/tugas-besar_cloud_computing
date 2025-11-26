import { Router } from "express";
import { googleSignIn } from "../controller/googleAuthController.js";

const router = Router();

// POST /api/auth/google
router.post("/google", googleSignIn);

export default router;
