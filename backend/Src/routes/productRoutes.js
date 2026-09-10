import express from "express"
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
import {
    getProducts, getProductById, createProduct, updateProduct, deleteProduct
} from "../controllers/productController.js";
import multer from "multer"
const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })


router.route('/').get(getProducts).post(authMiddleware.protect, adminMiddleware.admin, upload.single('image'), createProduct)
router.route('/:id').get(getProductById).put(authMiddleware.protect, adminMiddleware.admin, updateProduct).delete(authMiddleware.protect, adminMiddleware.admin, deleteProduct)

export default router
