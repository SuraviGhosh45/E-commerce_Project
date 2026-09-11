import express from "express"
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
import {createOrder,getOrderById,getOrders,updateOrderStatus} from "../controllers/orderController.js"

const router=express.Router()

router.route('/').post(authMiddleware.protect,createOrder).get(authMiddleware.protect,adminMiddleware.admin,getOrders)
router.route('/myorders').get(authMiddleware.protect,getOrderById)
router.route('/:id/status').put(authMiddleware.protect,adminMiddleware.admin,updateOrderStatus)

export default router
