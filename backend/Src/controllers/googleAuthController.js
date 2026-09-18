import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcrypt";
import crypto from "crypto";

import userModel from "../model/user.model.js";
import getToken from "../utils/getToken.js";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body || {};

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        message: "Invalid Google credential",
      });
    }

    const {
      sub: googleId,
      email,
      email_verified,
      name,
    } = payload;

    if (!email || email_verified !== true) {
      return res.status(401).json({
        message: "Google email could not be verified",
      });
    }

    const normalizedEmail = String(email)
      .trim()
      .toLowerCase();

    let user = await userModel.findOne({
      $or: [
        { googleId },
        { email: normalizedEmail },
      ],
    });

    // New Google user
    if (!user) {
      const randomPassword = crypto
        .randomBytes(32)
        .toString("hex");

      const hashedPassword = await bcrypt.hash(
        randomPassword,
        10
      );

      user = await userModel.create({
        name: name || "Vendora User",
        email: normalizedEmail,
        password: hashedPassword,
        role: "user",
        googleId,
        authProvider: "google",
        isVerified: true,
      });
    }

    // Existing account
    else {
      if (!user.googleId) {
        user.googleId = googleId;
      }

      user.isVerified = true;

      if (!user.name && name) {
        user.name = name;
      }

      await user.save();
    }

    const token = getToken(user);

    return res.status(200).json({
      message: "Google login successful",
      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);

    return res.status(401).json({
      message: "Google authentication failed",
    });
  }
};
