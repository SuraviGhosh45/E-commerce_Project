import express from "express"
import authController  from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
const router=express.Router()


router.post("/register",authController.register)
router.post("/login",authController.login)
router.get("/users",authMiddleware.protect,adminMiddleware.admin,authController.getUsers)

export default router
