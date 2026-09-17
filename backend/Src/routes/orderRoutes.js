import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
} from "../controllers/orderController.js";

const router = express.Router();

router.get(
  "/myorders",
  authMiddleware.protect,
  getMyOrders
);

router.get(
  "/:id",
  authMiddleware.protect,
  getOrderById
);

router.get(
  "/",
  authMiddleware.protect,
  adminMiddleware.admin,
  getAllOrders
);

router.put(
  "/:id/status",
  authMiddleware.protect,
  adminMiddleware.admin,
  updateOrderStatus
);

export default router;