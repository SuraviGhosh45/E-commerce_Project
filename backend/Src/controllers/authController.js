import userModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import getToken from "../utils/getToken.js";

import {
  sendVerificationEmail,
  sendLoginNotificationEmail,
} from "../utils/emailService.js";

// ======================================================
// REGISTER
// ======================================================

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    const normalizedName = String(name || "").trim();

    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    if (!normalizedName) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    if (!normalizedEmail) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const userExist = await userModel.findOne({
      email: normalizedEmail,
    });

    if (userExist) {
      return res.status(400).json({
        message: "Email Already Exist",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const otpExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    const newUser = await userModel.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
    });

    try {
      await sendVerificationEmail(
        normalizedEmail,
        normalizedName,
        otp
      );
    } catch (emailError) {
      console.error(
        "REGISTRATION EMAIL ERROR:",
        emailError
      );

      /*
       * The account has already been created, so we
       * return a clear response instead of pretending
       * the database operation failed.
       */
      return res.status(500).json({
        message:
          "Account created, but verification email could not be sent. Please try again.",
      });
    }

    return res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isVerified: newUser.isVerified,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// LOGIN
// ======================================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    const user = await userModel.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        message: "Kindly Register first.",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message:
          "Please verify your email before logging in",
      });
    }

    const passwordMatched =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatched) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    // Generate token only after successful password check.
    const token = getToken(user);

    /*
     * Login should succeed even if the notification
     * email temporarily fails.
     */
    try {
      await sendLoginNotificationEmail(
        user.email,
        user.name
      );
    } catch (emailError) {
      console.error(
        "LOGIN NOTIFICATION EMAIL ERROR:",
        emailError
      );
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// GET USERS
// ======================================================

const getUsers = async (req, res) => {
  try {
    const users = await userModel
      .find({})
      .select("-password");

    if (!users.length) {
      return res.status(404).json({
        message: "Users not found",
        users: [],
      });
    }

    return res.status(200).json({
      message: "All users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};
// ======================================================
// UPDATE OWN PROFILE
// ======================================================

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body || {};

    const normalizedName = String(name || "").trim();
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    // ----------------------------------------------
    // Validate name
    // ----------------------------------------------

    if (!normalizedName) {
      return res.status(400).json({
        message: "Name cannot be empty",
      });
    }

    // ----------------------------------------------
    // Validate email
    // ----------------------------------------------

    if (!normalizedEmail) {
      return res.status(400).json({
        message: "Email cannot be empty",
      });
    }

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Enter a valid email",
      });
    }

    // ----------------------------------------------
    // Find current user
    // ----------------------------------------------

    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    // ----------------------------------------------
    // Check duplicate email
    // ----------------------------------------------

    const emailExists = await userModel.findOne({
      email: normalizedEmail,
      _id: { $ne: user._id },
    });

    if (emailExists) {
      return res.status(400).json({
        message: "Email is already in use",
      });
    }

    // ----------------------------------------------
    // Update profile
    // ----------------------------------------------

    user.name = normalizedName;
    user.email = normalizedEmail;

    const updatedUser = await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        authProvider: updatedUser.authProvider,
      },
    });
  } catch (error) {
    console.error(
      "UPDATE PROFILE ERROR:",
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

export default {
  register,
  login,
  getUsers,
  updateProfile
};