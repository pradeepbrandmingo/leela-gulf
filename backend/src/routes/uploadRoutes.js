import express from "express";
import multer from "multer";
import { uploadSingleFile, uploadMultipleFiles, deleteFile } from "../controllers/uploadController.js";

const router = express.Router();

// Memory storage for fast buffer streaming to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max file size
  },
});

// POST /api/upload & /api/upload/single
router.post("/", upload.single("file"), uploadSingleFile);
router.post("/single", upload.single("file"), uploadSingleFile);

// POST /api/upload/multiple
router.post("/multiple", upload.array("files", 10), uploadMultipleFiles);

// POST /api/upload/delete
router.post("/delete", deleteFile);

export default router;
