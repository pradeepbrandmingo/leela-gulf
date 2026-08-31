import express from "express";
import rateLimit from "express-rate-limit";
import { loginAdmin, getAdminProfile, logoutAdmin } from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Strict Rate Limiter for Login Endpoint (Max 10 requests per 15 mins to prevent brute-force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public login route with rate limiting
router.post("/login", loginLimiter, loginAdmin);

// Protected routes (Single Admin authentication required)
router.get("/me", protectAdmin, getAdminProfile);
router.post("/logout", protectAdmin, logoutAdmin);

export default router;
