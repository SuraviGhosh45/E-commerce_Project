import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

import orderModel from "../model/order.model.js";
import productModel from "../model/product.model.js";
import sendEmail from "../utils/sendEmail.js";

dotenv.config();

const getRazorpayInstance = () => {
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

const calculateOrderDetails = async (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Order items are required");
    }

    const normalizedItems = items.map((item) => ({
        productId: item.productId || item._id || item.id,
        quantity: Number(item.quantity),
    }));

    for (const item of normalizedItems) {
        if (
            !item.productId ||
            !Number.isInteger(item.quantity) ||
            item.quantity < 1
        ) {
            throw new Error("Invalid product or quantity");
        }
    }

    const productIds = normalizedItems.map(
        (item) => item.productId
    );

    const products = await productModel.find({
        _id: { $in: productIds },
    });

    if (products.length !== normalizedItems.length) {
        throw new Error(
            "One or more products are no longer available"
        );
    }

    const productMap = new Map(
        products.map((product) => [
            product._id.toString(),
            product,
        ])
    );

    const orderItems = [];
    let subtotal = 0;

    for (const item of normalizedItems) {
        const product = productMap.get(
            item.productId.toString()
        );

        if (!product) {
            throw new Error("Product not found");
        }

        if (item.quantity > product.stock) {
            throw new Error(
                `Only ${product.stock} units of ${product.name} are available`
            );
        }

        const price = Number(product.price);
        const itemTotal = price * item.quantity;

        subtotal += itemTotal;

        orderItems.push({
            productId: product._id,
            quantity: item.quantity,
            price,
        });
    }

    const shipping = subtotal >= 100 ? 0 : 10;
    const totalAmount = subtotal + shipping;

    return {
        orderItems,
        subtotal,
        shipping,
        totalAmount,
    };
};

const createdOrder = async (req, res) => {
    try {
        const { items } = req.body;

        const { totalAmount } =
            await calculateOrderDetails(items);

        const instance = getRazorpayInstance();

        const options = {
            amount: Math.round(totalAmount * 100),
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };

        const order = await instance.orders.create(
            options
        );

        return res.status(200).json({
            message: "Razorpay Order Created",
            order,
            amount: totalAmount,
        });
    } catch (error) {
        console.error(
            "RAZORPAY ORDER ERROR:",
            error
        );

        return res.status(400).json({
            message:
                error.message ||
                "Unable to create Razorpay order",
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            items,
            address,
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                message: "Incomplete payment details",
            });
        }

        if (!address) {
            return res.status(400).json({
                message: "Delivery address is required",
            });
        }

        const existingOrder =
            await orderModel.findOne({
                paymentId: razorpay_payment_id,
            });

        if (existingOrder) {
            return res.status(200).json({
                message: "Payment already processed",
                order: existingOrder,
            });
        }

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");

        if (
            generatedSignature.length !==
            razorpay_signature.length
        ) {
            return res.status(400).json({
                message: "Payment Verification Failed",
            });
        }

        const signaturesMatch =
            crypto.timingSafeEqual(
                Buffer.from(generatedSignature),
                Buffer.from(razorpay_signature)
            );

        if (!signaturesMatch) {
            return res.status(400).json({
                message: "Payment Verification Failed",
            });
        }

        const {
            orderItems,
            totalAmount,
        } = await calculateOrderDetails(items);

        const instance = getRazorpayInstance();

        const razorpayOrder =
            await instance.orders.fetch(
                razorpay_order_id
            );

        const expectedAmountInPaise =
            Math.round(totalAmount * 100);

        if (
            Number(razorpayOrder.amount) !==
            expectedAmountInPaise
        ) {
            return res.status(400).json({
                message:
                    "Payment amount does not match order amount",
            });
        }

        for (const item of orderItems) {
            const updatedProduct =
                await productModel.findOneAndUpdate(
                    {
                        _id: item.productId,
                        stock: { $gte: item.quantity },
                    },
                    {
                        $inc: {
                            stock: -item.quantity,
                        },
                    },
                    {
                        new: true,
                    }
                );

            if (!updatedProduct) {
                return res.status(400).json({
                    message:
                        "Product stock changed. Please try again.",
                });
            }
        }

        let order;

        try {
            order = await orderModel.create({
                user: req.user._id,
                items: orderItems,
                totalAmount,
                address,
                paymentId:
                    razorpay_payment_id,
                status: "Processing",
            });
        } catch (error) {
            if (error.code === 11000) {
                const duplicateOrder =
                    await orderModel.findOne({
                        paymentId:
                            razorpay_payment_id,
                    });

                if (duplicateOrder) {
                    return res.status(200).json({
                        message:
                            "Payment already processed",
                        order: duplicateOrder,
                    });
                }
            }

            throw error;
        }

        const message = `Hello ${req.user.name},

Thank you for your order with Vendora!

We're happy to let you know that your payment was successful and your order has been placed.

Order Details:
Order ID: ${order._id}
Total Amount: ₹${order.totalAmount}
Order Status: ${order.status}
Payment ID: ${razorpay_payment_id}

We'll notify you when your order is shipped and provide further updates.

Thank you for shopping with Vendora.

Best regards,
The Vendora Team`;

        try {
            await sendEmail(
                req.user.email,
                "Vendora Order Confirmed",
                message
            );
        } catch (emailError) {
            console.error(
                "ORDER EMAIL ERROR:",
                emailError.message
            );
        }

        return res.status(201).json({
            message:
                "Payment Verified and Order Created",
            order,
        });
    } catch (error) {
        console.error(
            "VERIFY PAYMENT ERROR:",
            error
        );

        return res.status(400).json({
            message:
                error.message ||
                "Payment verification failed",
        });
    }
};

export {
    createdOrder,
    verifyPayment,
};