import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
import { getAdminStats } from '../controllers/adminController.js'

const router=express.Router()

router.get("/analytics",authMiddleware.protect,adminMiddleware.admin,getAdminStats)

export default router