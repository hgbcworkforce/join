import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import firstTimerRoutes from "./routes/firstTimerRoutes.js";
import metricsRoutes from "./routes/metricsRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Enable trust proxy for Render / reverse proxies
app.set("trust proxy", 1);

// CORS configuration
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      
      if (
        allowedOrigins.length === 0 ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin) ||
        origin.includes("localhost") ||
        origin.includes("hgbcinfluencers.org") ||
        origin.includes("onrender.com")
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in production
    },
    credentials: true,
    exposedHeaders: ["x-total-count"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root and Health check route for Render
app.get(["/", "/health", "/api/health"], (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "hgbc-firsttimer-backend",
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes (supports both /api/auth and /auth)
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/first-timers", firstTimerRoutes);
app.use("/first-timers", firstTimerRoutes);

app.use("/api/metrics", metricsRoutes);
app.use("/metrics", metricsRoutes);

// Fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
