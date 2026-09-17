import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  getAdminStats,
  getAdminUsers,
  updateAdminUser,
  deleteAdminUser,
} from "../controllers/adminController.js";

const router = express.Router();

router.get(
  "/analytics",
  authMiddleware.protect,
  adminMiddleware.admin,
  getAdminStats
);

router.get(
  "/users",
  authMiddleware.protect,
  adminMiddleware.admin,
  getAdminUsers
);

router.put(
  "/users/:id",
  authMiddleware.protect,
  adminMiddleware.admin,
  updateAdminUser
);

router.delete(
  "/users/:id",
  authMiddleware.protect,
  adminMiddleware.admin,
  deleteAdminUser
);

export default router;