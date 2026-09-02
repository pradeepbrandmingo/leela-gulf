import express from "express";
import { translateSingleOrBatch } from "../controllers/translateController.js";

const router = express.Router();

// POST /api/translate
router.post("/", translateSingleOrBatch);
router.post("/product", translateSingleOrBatch);
router.post("/batch", translateSingleOrBatch);
router.post("/:type", translateSingleOrBatch);

export default router;
