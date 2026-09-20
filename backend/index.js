import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import dns from "node:dns";
import cookieParser from "cookie-parser";

import connectDB from "./Src/config/db.js";
import authRoutes from "./Src/routes/authRoutes.js";
import productRoutes from "./Src/routes/productRoutes.js";
import orderRoutes from "./Src/routes/orderRoutes.js";
import paymentRoutes from "./Src/routes/paymentRoutes.js";
import adminRoutes from "./Src/routes/adminRoutes.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://vendora-frontend-pznl.onrender.com",
  "https://e-commerce-project-two-gamma.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "vendora working properly!",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Vendora backend running on port ${PORT}`);
});