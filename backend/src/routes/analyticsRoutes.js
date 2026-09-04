import express from "express";
import rateLimit from "express-rate-limit";
import { protectAdmin } from "../middleware/authMiddleware.js";
import {
  trackHit,
  getAnalyticsStats,
  clearAllLogs,
} from "../controllers/analyticsController.js";

const router = express.Router();

// Rate limiter for visitor tracking endpoint (Prevents spam / DoS)
const trackLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 120, // Limit each IP to 120 tracking hits per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many tracking requests from this IP. Please slow down.",
  },
});

// Public Beacon tracking endpoint (Called silently from client)
router.post("/track", trackLimiter, trackHit);

// Analytics Statistics endpoint (Used by /admin/visitors dashboard)
router.get("/stats", getAnalyticsStats);

// Protected: Clear all visitor logs (Requires authenticated admin)
router.delete("/clear", protectAdmin, clearAllLogs);

export default router;
