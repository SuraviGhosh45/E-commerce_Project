import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductImage,
} from "../controllers/productController.js";

import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

router.get("/", getProducts);

router.post(
  "/",
  authMiddleware.protect,
  adminMiddleware.admin,
  upload.single("image"),
  createProduct
);

router.get("/:id/image", getProductImage);

router.get("/:id", getProductById);

router.put(
  "/:id",
  authMiddleware.protect,
  adminMiddleware.admin,
  upload.single("image"),
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware.protect,
  adminMiddleware.admin,
  deleteProduct
);

export default router;