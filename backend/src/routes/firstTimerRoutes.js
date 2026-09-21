import { Router } from "express";
import {
  createFirstTimer,
  getFirstTimers,
  getFirstTimerById,
  updateFirstTimer,
  exportCSV,
} from "../controllers/firstTimerController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { submissionLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

// Public route for form submission from landing page
router.post("/", submissionLimiter, createFirstTimer);

// Protected routes for dashboard admins / follow-up team
router.get("/", authenticateToken, getFirstTimers);
router.get("/export", authenticateToken, exportCSV);
router.get("/:id", authenticateToken, getFirstTimerById);
router.patch("/:id", authenticateToken, updateFirstTimer);

export default router;
