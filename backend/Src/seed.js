import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import dns from 'node:dns';

import userModel from "./model/user.model.js";
import productModel from "./model/product.model.js";
import orderModel from "./model/order.model.js";
dns.setServers(["8.8.8.8","1.1.1.1"])

dotenv.config();

const seedData = async () => {
    try {
        // Connect MongoDB
        await mongoose.connect(process.env.MONGO_URL);

        console.log("MongoDB Connected");

        // Clear existing data
        await userModel.deleteMany({});
        await productModel.deleteMany({});
        await orderModel.deleteMany({});

        console.log("Old data deleted");

        // ---------------- USERS ----------------

        const hashedPassword = await bcrypt.hash("Admin@1234", 10);
        const hashedUserPassword = await bcrypt.hash("User@1234", 10);

        const users = await userModel.insertMany([
            {
                name: "Admin User",
                email: "admin@vendora.com",
                password: hashedPassword,
                role: "admin",
                isVerified: true
            },
            {
                name: "Mou",
                email: "mou@vendora.com",
                password: hashedUserPassword,
                role: "user",
                isVerified: true
            },
            {
                name: "Rahul Sharma",
                email: "rahul@vendora.com",
                password: hashedUserPassword,
                role: "user",
                isVerified: true
            },
            {
                name: "Priya Singh",
                email: "priya@vendora.com",
                password: hashedUserPassword,
                role: "user",
                isVerified: true
            }
        ]);

        console.log("Users created");

        // ---------------- PRODUCTS ----------------

        const products = await productModel.insertMany([
            {
                name: "Nike Air Max",
                description: "Comfortable running shoes",
                price: 4900,
                category: "Footwear",
                stock: 25,
                imageURL: "products/nike-air-max.jpg",
                ratings: 4.5,
                numReviews: 12
            },
            {
                name: "Adidas Running Shoes",
                description: "Lightweight running shoes",
                price: 3499,
                category: "Footwear",
                stock: 30,
                imageURL: "products/adidas-running.jpg",
                ratings: 4.2,
                numReviews: 8
            },
            {
                name: "Apple AirPods",
                description: "Wireless Bluetooth earbuds",
                price: 12999,
                category: "Electronics",
                stock: 15,
                imageURL: "products/airpods.jpg",
                ratings: 4.7,
                numReviews: 25
            },
            {
                name: "Samsung Galaxy Watch",
                description: "Smart fitness watch",
                price: 8999,
                category: "Electronics",
                stock: 20,
                imageURL: "products/galaxy-watch.jpg",
                ratings: 4.4,
                numReviews: 15
            },
            {
                name: "Levi's Denim Jacket",
                description: "Classic denim jacket",
                price: 2999,
                category: "Clothing",
                stock: 40,
                imageURL: "products/levis-jacket.jpg",
                ratings: 4.1,
                numReviews: 10
            }
        ]);

        console.log("Products created");

        // ---------------- ORDERS ----------------

        await orderModel.insertMany([
            {
                user: users[1]._id,
                items: [
                    {
                        productId: products[0]._id,
                        quantity: 1,
                        price: 4900
                    }
                ],
                totalAmount: 4900,
                address: {
                    fullname: "Mou",
                    street: "45 Lake View Road",
                    city: "Kolkata",
                    zipCode: "700029",
                    country: "India"
                },
                paymentId: "PAY_TEST_001",
                status: "Delivered"
            },

            {
                user: users[2]._id,
                items: [
                    {
                        productId: products[1]._id,
                        quantity: 2,
                        price: 3499
                    }
                ],
                totalAmount: 6998,
                address: {
                    fullname: "Rahul Sharma",
                    street: "Park Street",
                    city: "Kolkata",
                    zipCode: "700016",
                    country: "India"
                },
                paymentId: "PAY_TEST_002",
                status: "Shipped"
            },

            {
                user: users[3]._id,
                items: [
                    {
                        productId: products[2]._id,
                        quantity: 1,
                        price: 12999
                    }
                ],
                totalAmount: 12999,
                address: {
                    fullname: "Priya Singh",
                    street: "Salt Lake",
                    city: "Kolkata",
                    zipCode: "700091",
                    country: "India"
                },
                paymentId: "PAY_TEST_003",
                status: "Processing"
            },

            {
                user: users[1]._id,
                items: [
                    {
                        productId: products[3]._id,
                        quantity: 1,
                        price: 8999
                    }
                ],
                totalAmount: 8999,
                address: {
                    fullname: "Mou",
                    street: "45 Lake View Road",
                    city: "Kolkata",
                    zipCode: "700029",
                    country: "India"
                },
                paymentId: "PAY_TEST_004",
                status: "Pending"
            },

            {
                user: users[2]._id,
                items: [
                    {
                        productId: products[4]._id,
                        quantity: 1,
                        price: 2999
                    }
                ],
                totalAmount: 2999,
                address: {
                    fullname: "Rahul Sharma",
                    street: "Park Street",
                    city: "Kolkata",
                    zipCode: "700016",
                    country: "India"
                },
                paymentId: "PAY_TEST_005",
                status: "Cancelled"
            }
        ]);

        console.log("Orders created");

        console.log("✅ Database seeded successfully");

        process.exit();

    } catch (error) {
        console.error("❌ Seed Error:", error);
        process.exit(1);
    }
};

seedData();
