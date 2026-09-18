import userModel from "../model/user.model.js";
import getToken from "../utils/getToken.js";

import { sendWelcomeEmail } from "../utils/emailService.js";

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body || {};

    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    const normalizedOtp = String(otp || "").trim();

    if (!normalizedEmail || !normalizedOtp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const user = await userModel.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({
        message:
          "OTP not found. Please request a new OTP.",
      });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({
        message:
          "OTP has expired. Please request a new OTP.",
      });
    }

    if (user.otp !== normalizedOtp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // ==================================================
    // VERIFY USER
    // ==================================================

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    // ==================================================
    // WELCOME EMAIL
    // ==================================================

    try {
      await sendWelcomeEmail(
        user.email,
        user.name
      );
    } catch (emailError) {
      /*
       * Verification has already succeeded.
       * An email failure should not make the user
       * unverified or invalidate the account.
       */
      console.error(
        "WELCOME EMAIL ERROR:",
        emailError
      );
    }

    // ==================================================
    // CREATE JWT
    // ==================================================

    const token = getToken(user);

    // ==================================================
    // AUTH COOKIE
    // ==================================================

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message:
        "Email verified successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default verifyOtp;