import express from "express";
import {
  getBlogs,
  getBlogBySlugOrId,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";

const router = express.Router();

// Public / Admin CRUD Routes
router.get("/", getBlogs);
router.get("/:slugOrId", getBlogBySlugOrId);
router.post("/", createBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

export default router;
