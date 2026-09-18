import bcrypt from "bcrypt";
import userModel from "../model/user.model.js";
import productModel from "../model/product.model.js";
import orderModel from "../model/order.model.js";
import mongoose from "mongoose";
// ======================================================
// ADMIN ANALYTICS
// ======================================================

export const getAdminStats = async (req, res) => {
  try {
    const [
      total_user,
      total_product,
      total_order,
      completed_order,
      active_order,
      cancelled_order,
      returned_order,
      revenueResult,
    ] = await Promise.all([
      // Total registered customers
      userModel.countDocuments({
        role: "user",
      }),

      // Total products
      productModel.countDocuments({}),

      // All orders
      orderModel.countDocuments({}),

      // Successfully completed orders
      orderModel.countDocuments({
        status: "Delivered",
      }),

      // Orders currently in progress
      orderModel.countDocuments({
        status: {
          $in: [
            "Pending",
            "Processing",
            "Shipped",
          ],
        },
      }),

      // Cancelled orders
      orderModel.countDocuments({
        status: "Cancelled",
      }),

      // Returned orders
      orderModel.countDocuments({
        status: "Returned",
      }),

      // Revenue from completed orders only
      orderModel.aggregate([
        {
          $match: {
            status: "Delivered",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$totalAmount",
            },
          },
        },
      ]),
    ]);

    const total_Revenue =
      revenueResult[0]?.total || 0;

    return res.status(200).json({
      total_user,
      total_product,
      total_order,

      completed_order,
      active_order,
      cancelled_order,
      returned_order,

      total_Revenue,
    });
  } catch (error) {
    console.error(
      "GET ADMIN STATS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Internal Error",
    });
  }
};

// ======================================================
// GET ALL USERS
// ======================================================

export const getAdminUsers = async (req, res) => {
  try {
    const users = await userModel
      .find({})
      .select("-password -otp -otpExpires")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Users Fetched Successfully",
      users,
    });
  } catch (error) {
    console.error(
      "GET ADMIN USERS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Internal Error",
    });
  }
};

// ======================================================
// UPDATE USER
// ======================================================

export const updateAdminUser = async (req, res) => {
  try {
    const { name, email, password, role } =
      req.body || {};

    const user = await userModel.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    // ----------------------------------------------
    // Name
    // ----------------------------------------------

    if (name !== undefined) {
      const normalizedName = String(name).trim();

      if (!normalizedName) {
        return res.status(400).json({
          message: "Name cannot be empty",
        });
      }

      user.name = normalizedName;
    }

    // ----------------------------------------------
    // Email
    // ----------------------------------------------

    if (email !== undefined) {
      const normalizedEmail = String(email)
        .trim()
        .toLowerCase();

      if (!normalizedEmail) {
        return res.status(400).json({
          message: "Email cannot be empty",
        });
      }

      const emailExists =
        await userModel.findOne({
          email: normalizedEmail,
          _id: { $ne: user._id },
        });

      if (emailExists) {
        return res.status(400).json({
          message: "Email is already in use",
        });
      }

      user.email = normalizedEmail;
    }

    // ----------------------------------------------
    // Role
    // ----------------------------------------------

    if (role !== undefined) {
      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({
          message: "Invalid user role",
        });
      }

      // Prevent current admin from removing
      // their own admin role.
      if (
        user._id.toString() ===
          req.user._id.toString() &&
        role !== "admin"
      ) {
        return res.status(400).json({
          message:
            "You cannot remove your own admin role",
        });
      }

      user.role = role;
    }

    // ----------------------------------------------
    // Password
    // ----------------------------------------------

    if (password !== undefined) {
      const newPassword = String(password).trim();

      // Empty password means keep current password.
      if (newPassword) {
        if (newPassword.length < 8) {
          return res.status(400).json({
            message:
              "Password must be at least 8 characters",
          });
        }

        user.password = await bcrypt.hash(
          newPassword,
          10
        );
      }
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      message: "User Updated Successfully",

      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "UPDATE ADMIN USER ERROR:",
      error
    );

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email is already in use",
      });
    }

    return res.status(500).json({
      message: "Internal Error",
    });
  }
};

// ======================================================
// DELETE USER
// ======================================================

export const deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    // Do not allow an admin to delete their own account
    if (String(req.user._id) === String(id)) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    // Check user exists
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Delete all orders belonging to this user
    const deletedOrders = await orderModel.deleteMany({
      user: id,
    });

    // Delete the user
    await userModel.findByIdAndDelete(id);

    return res.status(200).json({
      message:
        "User and associated orders deleted successfully",
      deletedOrders: deletedOrders.deletedCount,
      userId: id,
    });
  } catch (error) {
    console.error(
      "DELETE ADMIN USER ERROR:",
      error
    );

    return res.status(500).json({
      message: "Internal Error",
    });
  }
};