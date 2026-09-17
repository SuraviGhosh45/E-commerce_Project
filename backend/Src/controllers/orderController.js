import orderModel from "../model/order.model.js";

const getMyOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ user: req.user._id })
      .populate("items.productId", "name price imageURL")
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

const getAllOrders = async (req, res) => {
  try {
    const allOrders = await orderModel
      .find({})
      .populate("user", "name email")
      .populate("items.productId", "name price imageURL")
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

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Returned",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid Order Status",
      });
    }

    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order Not Found",
      });
    }

    order.status = status;

    await order.save();

    const updatedOrder = await orderModel
      .findById(order._id)
      .populate("user", "name email")
      .populate("items.productId", "name price imageURL");

    return res.status(200).json({
      message: "Order Status Updated Successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export {
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};