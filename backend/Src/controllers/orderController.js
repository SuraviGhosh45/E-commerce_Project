import orderModel from '../model/order.model.js'
import sendEmail from '../utils/sendEmail.js'

const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, address, paymentId } = req.body

        if (!items || items.length === 0 || !totalAmount || !address) {
            return res.status(400).json({
                message: "Invalid Order Details"
            })
        }
        else {
            const order = await orderModel.create({
                user: req.user._id,
                items,
                totalAmount,
                address,
                paymentId
            });
            const message = `Hello ${req.user.name},

Thank you for your order with Vendora!

We're happy to let you know that your order has been successfully placed.

Order Details:
Order ID: ${order._id}
Total Amount: ₹${order.totalAmount}
Order Status: ${order.status}

We'll notify you when your order is shipped and provide further updates along the way.

Thank you for shopping with Vendora. We appreciate your business!

Best regards,
The Vendora Team`;

            await sendEmail(req.user.email, "Order Created Successfully", message)
            return res.status(201).json({
                message: "Order Created",
                order
            })
        }
    } catch (error) {
        return res.status(500).json({
            error,
            message: "Internal Server Error"
        })
    }
}

const getMyOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({
            user: req.user._id
        }).populate('items.productId', 'name price')

        if (orders) {
            return res.status(200).json({
                message: "Your Orders Fetched",
                orders
            })
        }
        else {
            return res.status(404).json({
                message: "No Order Created Yet"
            })
        }
    } catch (error) {
        return res.status(500).json({
            error,
            message: "Internal Server Error"
        })
    }
}

const getAllOrders = async (req, res) => {
    try {
        const allOrders = await orderModel.find({})

        if (allOrders) {
            return res.status(200).json({
                message: "All Orders Fetched",
                allOrders
            })
        }
        else {
            return res.status(404).json({
                message: "No Order Created Yet"
            })
        }

    } catch (error) {
        return res.status(500).json({
            error,
            message: "Internal Server Error"
        })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body
        const order = await orderModel.findById(req.params.id)

        if (order) {
            order.status = status
            await order.save()
            return res.status(200).json({
                message: "Order Status Updated Successfully",
                order
            })
        }
        else {
            return res.status(404).json({
                message: "Order Not Found",
            })
        }
    } catch (error) {
        return res.status(500).json({
            error,
            message: "Internal Server Error"
        })
    }
}


export {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
}

