import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import firstTimerRoutes from "./routes/firstTimerRoutes.js";
import metricsRoutes from "./routes/metricsRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

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
        origin.includes("hgbcinfluencers.org")
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    exposedHeaders: ["x-total-count"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route for Render
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "hgbc-firsttimer-backend",
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/first-timers", firstTimerRoutes);
app.use("/api/metrics", metricsRoutes);

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
