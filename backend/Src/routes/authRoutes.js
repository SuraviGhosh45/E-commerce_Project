import express from "express"
import authController  from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
import verifyOtp from "../controllers/verifyOtpController.js"
import { googleLogin } from "../controllers/googleAuthController.js"
const router=express.Router()


router.post("/register",authController.register)
router.post("/google", googleLogin);
router.post("/verify-otp",verifyOtp);
router.post("/login",authController.login)
router.get("/users",authMiddleware.protect,adminMiddleware.admin,authController.getUsers)
router.put(
  "/profile",
  authMiddleware.protect,
  authController.updateProfile
);

export default router
