import express from "express";
import { translateSingleOrBatch } from "../controllers/translateController.js";

const router = express.Router();

// POST /api/translate
router.post("/", translateSingleOrBatch);

export default router;
