import express from "express";
import {
  getPublishedJobs,
  getAdminJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  submitJobApplication,
  getAdminApplications,
  getApplicationById,
  deleteJobApplication,
} from "../controllers/careerController.js";

const router = express.Router();

// ── Public Routes (Frontend /careers & job modal) ──
router.get("/jobs", getPublishedJobs);
router.get("/jobs/:id", getJobById);
router.post("/apply", submitJobApplication);

// ── Admin Routes (Admin Dashboard Careers Management) ──
router.get("/admin/jobs", getAdminJobs);
router.post("/jobs", createJob);
router.put("/jobs/:id", updateJob);
router.delete("/jobs/:id", deleteJob);

// ── Admin Candidate Applications / Leads Routes ──
router.get("/applications", getAdminApplications);
router.get("/applications/:id", getApplicationById);
router.delete("/applications/:id", deleteJobApplication);

export default router;
