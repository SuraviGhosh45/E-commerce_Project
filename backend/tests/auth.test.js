import { jest } from "@jest/globals";
import nodemailer from "nodemailer";
import request from "supertest";
import app from "../app.js";
import userModel from "../Src/model/user.model.js";
import { connectTestDB, clearTestDB, closeTestDB } from "./testSetup.js";

describe("Auth & OTP Verification Flow", () => {
  let sendMailMock;

  beforeAll(async () => {
    process.env.JWT_SECRET = "test_jwt_secret_key_123456789";
    sendMailMock = jest.fn().mockResolvedValue({ messageId: "test-id" });
    jest.spyOn(nodemailer, "createTransport").mockReturnValue({
      sendMail: sendMailMock,
    });
    await connectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
    sendMailMock.mockClear();
  });

  afterAll(async () => {
    await closeTestDB();
    jest.restoreAllMocks();
  });

  it("should register a new user, create OTP, and send verification email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test Customer",
        email: "customer@vendora.com",
        password: "Password@123",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.email).toBe("customer@vendora.com");
    expect(res.body.isVerified).toBe(false);

    // Verify user saved in DB with OTP
    const userInDb = await userModel.findOne({ email: "customer@vendora.com" });
    expect(userInDb).not.toBeNull();
    expect(userInDb.otp).toBeDefined();
    expect(userInDb.otp.length).toBe(6);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });

  it("should reject registration with existing email", async () => {
    await userModel.create({
      name: "Existing User",
      email: "existing@vendora.com",
      password: "HashedPassword123",
    });

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Existing User",
        email: "existing@vendora.com",
        password: "Password@123",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Already Exist/i);
  });

  it("should reject OTP verification with incorrect OTP", async () => {
    await userModel.create({
      name: "OTP User",
      email: "otp@vendora.com",
      password: "HashedPassword123",
      otp: "123456",
      otpExpires: new Date(Date.now() + 10 * 60 * 1000),
      isVerified: false,
    });

    const res = await request(app)
      .post("/api/auth/verify-otp")
      .send({
        email: "otp@vendora.com",
        otp: "999999",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Invalid OTP/i);
  });

  it("should verify user with valid OTP and return auth token", async () => {
    await userModel.create({
      name: "OTP User",
      email: "otp@vendora.com",
      password: "HashedPassword123",
      otp: "654321",
      otpExpires: new Date(Date.now() + 10 * 60 * 1000),
      isVerified: false,
    });

    const res = await request(app)
      .post("/api/auth/verify-otp")
      .send({
        email: "otp@vendora.com",
        otp: "654321",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.isVerified).toBe(true);

    const userInDb = await userModel.findOne({ email: "otp@vendora.com" });
    expect(userInDb.isVerified).toBe(true);
    expect(userInDb.otp).toBeUndefined();
  });

  it("should reject login if email is not verified", async () => {
    // Register user first (unverified)
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Unverified User",
        email: "unverified@vendora.com",
        password: "Password@123",
      });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "unverified@vendora.com",
        password: "Password@123",
      });

    expect(loginRes.status).toBe(403);
    expect(loginRes.body.message).toMatch(/verify your email/i);
  });

  it("should successfully login verified user with correct credentials", async () => {
    // 1. Register
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Verified User",
        email: "verified@vendora.com",
        password: "Password@123",
      });

    const user = await userModel.findOne({ email: "verified@vendora.com" });

    // 2. Verify OTP
    await request(app)
      .post("/api/auth/verify-otp")
      .send({
        email: "verified@vendora.com",
        otp: user.otp,
      });

    // 3. Login
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "verified@vendora.com",
        password: "Password@123",
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty("token");
    expect(loginRes.body.email).toBe("verified@vendora.com");
  });

  it("should reject login with incorrect password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "nonexistent@vendora.com",
        password: "WrongPassword",
      });

    expect(res.status).toBe(400);
  });
});
