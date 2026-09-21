import { Router } from "express";
import { signup, signin, getMe } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

router.post("/signup", authLimiter, signup);
router.post("/signin", authLimiter, signin);
router.get("/me", authenticateToken, getMe);

export default router;
