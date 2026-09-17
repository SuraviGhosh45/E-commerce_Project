import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} from "../controllers/orderController.js";

const router = express.Router();

// User orders
router.get(
    "/myorders",
    authMiddleware.protect,
    getMyOrders
);

// Admin - all orders
router.get(
    "/",
    authMiddleware.protect,
    adminMiddleware.admin,
    getAllOrders
);

// Admin - update order status
router.put(
    "/:id/status",
    authMiddleware.protect,
    adminMiddleware.admin,
    updateOrderStatus
);

export default router;