import { Router } from "express";
import { 
  signup, 
  signin, 
  getMe, 
  updateProfile, 
  changePassword 
} from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

router.post("/signup", authLimiter, signup);
router.post("/signin", authLimiter, signin);
router.get("/me", authenticateToken, getMe);
router.put("/profile", authenticateToken, updateProfile);
router.patch("/profile", authenticateToken, updateProfile);
router.put("/change-password", authenticateToken, changePassword);
router.post("/change-password", authenticateToken, changePassword);

export default router;
