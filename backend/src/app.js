import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import firstTimerRoutes from "./routes/firstTimerRoutes.js";
import metricsRoutes from "./routes/metricsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Enable trust proxy for Render / reverse proxies
app.set("trust proxy", 1);

// Robust CORS configuration supporting all HGBC domains, custom subdomains, and preflight requests
const corsOptions = {
  origin: (origin, callback) => {
    // Automatically allow and reflect the requesting origin
    callback(null, true);
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "x-access-token",
    "x-total-count",
  ],
  exposedHeaders: ["x-total-count", "Content-Disposition"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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

app.use("/api/users", userRoutes);
app.use("/users", userRoutes);

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
