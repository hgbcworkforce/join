import { Router } from "express";
import { getDashboardMetrics } from "../controllers/metricsController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authenticateToken, getDashboardMetrics);

export default router;
