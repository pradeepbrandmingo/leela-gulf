import express from "express";
import {
  createLead,
  getAllLeads,
  updateLeadStatus,
  deleteLead,
} from "../controllers/leadController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public endpoint for website visitors to submit contact form inquiries
router.post("/", createLead);

// Protected Admin endpoints to manage leads
router.get("/", protectAdmin, getAllLeads);
router.patch("/:id/status", protectAdmin, updateLeadStatus);
router.delete("/:id", protectAdmin, deleteLead);

export default router;
