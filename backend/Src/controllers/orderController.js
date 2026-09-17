import mongoose from "mongoose";
import orderModel from "../model/order.model.js";

// ======================================================
// GET MY ORDERS
// ======================================================

const getMyOrders = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ user: req.user._id })
            .populate(
                "items.productId",
                "name price imageURL"
            )
            .sort({ createdAt: -1 });

        if (!orders.length) {
            return res.status(404).json({
                message: "No Order Created Yet",
                orders: [],
            });
        }

        return res.status(200).json({
            message: "Your Orders Fetched",
            orders,
        });
    } catch (error) {
        console.error("GET MY ORDERS ERROR:", error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// ======================================================
// GET ALL ORDERS - ADMIN
// ======================================================

const getAllOrders = async (req, res) => {
    try {
        const allOrders = await orderModel
            .find({})
            .populate("user", "name email")
            .populate(
                "items.productId",
                "name price imageURL"
            )
            .sort({ createdAt: -1 });

        if (!allOrders.length) {
            return res.status(404).json({
                message: "No Order Created Yet",
                allOrders: [],
            });
        }

        return res.status(200).json({
            message: "All Orders Fetched",
            allOrders,
        });
    } catch (error) {
        console.error("GET ALL ORDERS ERROR:", error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// ======================================================
// UPDATE ORDER STATUS - ADMIN
// ======================================================

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body || {};
        const { id } = req.params;

        const allowedStatuses = [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
            "Returned",
        ];

        // Validate status
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid Order Status",
            });
        }

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid Order ID",
            });
        }

        // Check order exists first
        const existingOrder =
            await orderModel.findById(id);

        if (!existingOrder) {
            return res.status(404).json({
                message: "Order Not Found",
            });
        }

        /*
         * Use findByIdAndUpdate instead of:
         *
         * order.status = status;
         * await order.save();
         *
         * This updates only the status field and avoids
         * re-validating unrelated older order fields.
         */
        const updatedOrder =
            await orderModel
                .findByIdAndUpdate(
                    id,
                    {
                        $set: {
                            status,
                        },
                    },
                    {
                        new: true,
                    }
                )
                .populate("user", "name email")
                .populate(
                    "items.productId",
                    "name price imageURL"
                );

        return res.status(200).json({
            message:
                "Order Status Updated Successfully",
            order: updatedOrder,
        });
    } catch (error) {
        console.error(
            "UPDATE ORDER STATUS ERROR:",
            error
        );

        return res.status(500).json({
            message:
                error.message ||
                "Internal Server Error",
        });
    }
};

// ======================================================
// GET ORDER BY ID
// ======================================================

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid Order ID",
            });
        }

        const order = await orderModel
            .findById(id)
            .populate("user", "name email")
            .populate(
                "items.productId",
                "name price imageURL category"
            );

        if (!order) {
            return res.status(404).json({
                message: "Order Not Found",
            });
        }

        const isAdmin =
            req.user.role === "admin";

        const isOwner =
            order.user?._id?.toString() ===
            req.user._id.toString();

        if (!isAdmin && !isOwner) {
            return res.status(403).json({
                message:
                    "You are not authorized to view this order",
            });
        }

        return res.status(200).json({
            message:
                "The Order Fetched Successfully",
            order,
        });
    } catch (error) {
        console.error(
            "GET ORDER BY ID ERROR:",
            error
        );

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export {
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    getOrderById,
};