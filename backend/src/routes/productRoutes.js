import express from "express";
import {
  createProduct,
  getProducts,
  getProductBySlugOrId,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// GET /api/products - Get all products
router.get("/", getProducts);

// GET /api/products/:slugOrId - Get single product
router.get("/:slugOrId", getProductBySlugOrId);

// POST /api/products - Create new product
router.post("/", createProduct);

// PUT /api/products/:id - Update product
router.put("/:id", updateProduct);

// DELETE /api/products/:id - Delete product
router.delete("/:id", deleteProduct);

export default router;
