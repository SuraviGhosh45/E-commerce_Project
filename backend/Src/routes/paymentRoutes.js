import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
    createdOrder,
    verifyPayment
} from "../controllers/paymentController.js";

const router = express.Router();

router.post(
    "/order",
    authMiddleware.protect,
    createdOrder
);

router.post(
    "/verify",
    authMiddleware.protect,
    verifyPayment
);

export default router;