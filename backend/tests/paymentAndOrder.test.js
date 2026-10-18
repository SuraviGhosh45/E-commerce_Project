import { jest } from "@jest/globals";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Razorpay from "razorpay";
import request from "supertest";
import app from "../app.js";
import orderModel from "../Src/model/order.model.js";
import productModel from "../Src/model/product.model.js";
import userModel from "../Src/model/user.model.js";
import getToken from "../Src/utils/getToken.js";
import { connectTestDB, clearTestDB, closeTestDB } from "./testSetup.js";

describe("Payment & Order Creation Flow", () => {
  let customerUser, adminUser, customerToken, adminToken, testProduct;
  let razorpayMockOrders;
  const originalAddResources = Razorpay.prototype.addResources;

  beforeAll(async () => {
    process.env.JWT_SECRET = "test_jwt_secret_key_123456789";
    process.env.RAZORPAY_KEY_ID = "rzp_test_mock_key_id";
    process.env.RAZORPAY_KEY_SECRET = "rzp_test_mock_secret_key";

    // Mock nodemailer
    jest.spyOn(nodemailer, "createTransport").mockReturnValue({
      sendMail: jest.fn().mockResolvedValue({ messageId: "order-mail-id" }),
    });

    // Mock Razorpay resources
    Razorpay.prototype.addResources = function () {
      originalAddResources.call(this);
      this.orders = razorpayMockOrders;
    };

    await connectTestDB();
  });

  beforeEach(async () => {
    customerUser = await userModel.create({
      name: "Shopper",
      email: "shopper@test.com",
      password: "HashedPassword123",
      role: "user",
      isVerified: true,
    });
    customerToken = getToken(customerUser);

    adminUser = await userModel.create({
      name: "Admin Manager",
      email: "admin_order@test.com",
      password: "HashedPassword123",
      role: "admin",
      isVerified: true,
    });
    adminToken = getToken(adminUser);

    testProduct = await productModel.create({
      name: "Test Running Shoes",
      description: "High quality running shoes",
      price: 500,
      category: "Footwear",
      stock: 20,
      imageURL: "products/test-shoes.jpg",
    });

    razorpayMockOrders = {
      create: jest.fn().mockImplementation((options) =>
        Promise.resolve({
          id: "order_mock_12345",
          amount: options.amount,
          currency: "INR",
          receipt: options.receipt,
          status: "created",
        })
      ),
      fetch: jest.fn().mockImplementation((orderId) =>
        Promise.resolve({
          id: orderId,
          amount: 100000, // 1000 INR (2 items * 500)
          currency: "INR",
          status: "paid",
        })
      ),
    };
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    Razorpay.prototype.addResources = originalAddResources;
    await closeTestDB();
    jest.restoreAllMocks();
  });

  describe("Razorpay Order Creation (/api/payment/order)", () => {
    it("should calculate correct total and create Razorpay order", async () => {
      const res = await request(app)
        .post("/api/payment/order")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          items: [
            {
              productId: testProduct._id.toString(),
              quantity: 2,
            },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Razorpay Order Created");
      expect(res.body.amount).toBe(1000); // 2 * 500
      expect(res.body.order.id).toBe("order_mock_12345");
      expect(razorpayMockOrders.create).toHaveBeenCalledTimes(1);
    });

    it("should reject order if requested quantity exceeds stock", async () => {
      const res = await request(app)
        .post("/api/payment/order")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          items: [
            {
              productId: testProduct._id.toString(),
              quantity: 999,
            },
          ],
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/units.*available/i);
    });
  });

  describe("Payment Signature Verification & Order Creation (/api/payment/verify)", () => {
    const razorpayOrderId = "order_mock_12345";
    const razorpayPaymentId = "pay_mock_67890";
    const address = {
      fullname: "Shopper",
      street: "123 Main Street",
      city: "Kolkata",
      state: "West Bengal",
      zipCode: "700001",
      country: "India",
    };

    it("should reject verification when signature is invalid", async () => {
      // Create invalid signature
      const invalidSignature = crypto
        .createHmac("sha256", "wrong_secret_key_abc")
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      const res = await request(app)
        .post("/api/payment/verify")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: invalidSignature,
          items: [
            {
              productId: testProduct._id.toString(),
              quantity: 2,
            },
          ],
          address,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Payment Verification Failed/i);

      // Verify no order created
      const orderCount = await orderModel.countDocuments({});
      expect(orderCount).toBe(0);
    });

    it("should verify valid payment signature, decrement stock, and create order", async () => {
      // Generate genuine signature using matching secret
      const validSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      const initialStock = testProduct.stock; // 20

      const res = await request(app)
        .post("/api/payment/verify")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: validSignature,
          items: [
            {
              productId: testProduct._id.toString(),
              quantity: 2,
            },
          ],
          address,
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toMatch(/Payment Verified and Order Created/i);
      expect(res.body.order).toHaveProperty("_id");
      expect(res.body.order.paymentId).toBe(razorpayPaymentId);
      expect(res.body.order.status).toBe("Processing");

      // Verify order saved in database
      const orderInDb = await orderModel.findOne({ paymentId: razorpayPaymentId });
      expect(orderInDb).not.toBeNull();
      expect(orderInDb.totalAmount).toBe(1000);
      expect(orderInDb.items[0].quantity).toBe(2);

      // Verify product stock decremented in database
      const updatedProduct = await productModel.findById(testProduct._id);
      expect(updatedProduct.stock).toBe(initialStock - 2);
    });

    it("should return existing order on duplicate verification submission", async () => {
      const validSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      // First verification creates order
      await request(app)
        .post("/api/payment/verify")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: validSignature,
          items: [
            {
              productId: testProduct._id.toString(),
              quantity: 2,
            },
          ],
          address,
        });

      // Second verification attempt
      const duplicateRes = await request(app)
        .post("/api/payment/verify")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: validSignature,
          items: [
            {
              productId: testProduct._id.toString(),
              quantity: 2,
            },
          ],
          address,
        });

      expect(duplicateRes.status).toBe(200);
      expect(duplicateRes.body.message).toMatch(/Payment already processed/i);
    });
  });

  describe("Customer and Admin Order Management", () => {
    let placedOrder;

    beforeEach(async () => {
      placedOrder = await orderModel.create({
        user: customerUser._id,
        items: [
          {
            productId: testProduct._id,
            quantity: 1,
            price: 500,
          },
        ],
        totalAmount: 500,
        address: {
          fullname: "Shopper",
          street: "123 Main",
          city: "Kolkata",
          state: "WB",
          zipCode: "700001",
          country: "India",
        },
        paymentId: "pay_test_order_111",
        status: "Processing",
      });
    });

    it("should allow customer to fetch their own orders", async () => {
      const res = await request(app)
        .get("/api/orders/myorders")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.orders.length).toBe(1);
      expect(res.body.orders[0]._id).toBe(placedOrder._id.toString());
    });

    it("should allow customer to fetch their own order by ID", async () => {
      const res = await request(app)
        .get(`/api/orders/${placedOrder._id}`)
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.order._id).toBe(placedOrder._id.toString());
    });

    it("should reject customer fetching another customer's order by ID with 403", async () => {
      const otherUser = await userModel.create({
        name: "Other User",
        email: "other@test.com",
        password: "Password@123",
        role: "user",
        isVerified: true,
      });
      const otherToken = getToken(otherUser);

      const res = await request(app)
        .get(`/api/orders/${placedOrder._id}`)
        .set("Authorization", `Bearer ${otherToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/not authorized/i);
    });

    it("should allow admin to update order status", async () => {
      const res = await request(app)
        .put(`/api/orders/${placedOrder._id}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          status: "Delivered",
        });

      expect(res.status).toBe(200);
      expect(res.body.order.status).toBe("Delivered");

      const inDb = await orderModel.findById(placedOrder._id);
      expect(inDb.status).toBe("Delivered");
    });
  });
});
