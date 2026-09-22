import { Router } from "express";
import {
  createFirstTimer,
  getFirstTimers,
  getFirstTimerById,
  updateFirstTimer,
  deleteFirstTimer,
  exportCSV,
} from "../controllers/firstTimerController.js";
import { authenticateToken, requireAdmin } from "../middlewares/authMiddleware.js";
import { submissionLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

// Public route for form submission from landing page
router.post("/", submissionLimiter, createFirstTimer);

// Protected routes for dashboard admins / follow-up team (Read access)
router.get("/", authenticateToken, getFirstTimers);
router.get("/export", authenticateToken, exportCSV);
router.get("/:id", authenticateToken, getFirstTimerById);

// Admin-only management actions (Mark as followed / update status, delete)
router.patch("/:id", authenticateToken, requireAdmin, updateFirstTimer);
router.delete("/:id", authenticateToken, requireAdmin, deleteFirstTimer);

export default router;
