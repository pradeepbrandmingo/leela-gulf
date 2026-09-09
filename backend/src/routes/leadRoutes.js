import express from "express";
import rateLimit from "express-rate-limit";
import {
  createLead,
  getAllLeads,
  updateLeadStatus,
  deleteLead,
} from "../controllers/leadController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Strict Rate Limiter for Lead Creation (Max 10 submissions per 15 mins per IP to prevent spam & bot floods)
const leadCreateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 10, // Max 10 leads per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many inquiries submitted from this IP. Please wait a few minutes before submitting again.",
  },
});

// Public endpoint for website visitors to submit contact form inquiries (Spam Protected)
router.post("/", leadCreateLimiter, createLead);

// Protected Admin endpoints to manage leads
router.get("/", protectAdmin, getAllLeads);
router.patch("/:id/status", protectAdmin, updateLeadStatus);
router.delete("/:id", protectAdmin, deleteLead);

export default router;
