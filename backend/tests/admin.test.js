import { jest } from "@jest/globals";
import request from "supertest";
import bcrypt from "bcrypt";
import app from "../app.js";
import userModel from "../Src/model/user.model.js";
import getToken from "../Src/utils/getToken.js";
import { connectTestDB, clearTestDB, closeTestDB } from "./testSetup.js";

describe("Protected Admin Routes & Access Control", () => {
  let customerUser, adminUser, customerToken, adminToken;

  beforeAll(async () => {
    process.env.JWT_SECRET = "test_jwt_secret_key_123456789";
    await connectTestDB();
  });

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash("Password@123", 10);

    customerUser = await userModel.create({
      name: "Normal Customer",
      email: "customer@test.com",
      password: hashedPassword,
      role: "user",
      isVerified: true,
    });
    customerToken = getToken(customerUser);

    adminUser = await userModel.create({
      name: "Admin User",
      email: "admin@test.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });
    adminToken = getToken(adminUser);
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe("Access Control (401 and 403)", () => {
    it("should return 401 when no token is provided to admin analytics", async () => {
      const res = await request(app).get("/api/admin/analytics");
      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/No token/i);
    });

    it("should return 403 when a customer attempts to access admin analytics", async () => {
      const res = await request(app)
        .get("/api/admin/analytics")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/Access denied as Admin/i);
    });

    it("should return 403 when a customer attempts to access admin user management", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/Access denied as Admin/i);
    });

    it("should return 403 when a customer attempts to fetch all orders", async () => {
      const res = await request(app)
        .get("/api/orders")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/Access denied as Admin/i);
    });
  });

  describe("Admin Authorized Actions (200)", () => {
    it("should allow admin to access analytics stats", async () => {
      const res = await request(app)
        .get("/api/admin/analytics")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("total_user");
      expect(res.body).toHaveProperty("total_product");
      expect(res.body).toHaveProperty("total_order");
      expect(res.body).toHaveProperty("total_Revenue");
    });

    it("should allow admin to fetch all users", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.users)).toBe(true);
      expect(res.body.users.length).toBe(2);
    });

    it("should allow admin to update a user's details", async () => {
      const res = await request(app)
        .put(`/api/admin/users/${customerUser._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Updated Customer Name",
        });

      expect(res.status).toBe(200);
      expect(res.body.user.name).toBe("Updated Customer Name");

      const updated = await userModel.findById(customerUser._id);
      expect(updated.name).toBe("Updated Customer Name");
    });

    it("should prevent admin from deleting their own account", async () => {
      const res = await request(app)
        .delete(`/api/admin/users/${adminUser._id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/cannot delete your own account/i);
    });

    it("should allow admin to delete another user", async () => {
      const res = await request(app)
        .delete(`/api/admin/users/${customerUser._id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);

      const deleted = await userModel.findById(customerUser._id);
      expect(deleted).toBeNull();
    });
  });
});
