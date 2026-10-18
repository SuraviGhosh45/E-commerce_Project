import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import productModel from "../Src/model/product.model.js";
import { connectTestDB, clearTestDB, closeTestDB } from "./testSetup.js";

describe("Products Public Flow", () => {
  let sampleProduct;

  beforeAll(async () => {
    await connectTestDB();
  });

  beforeEach(async () => {
    sampleProduct = await productModel.create({
      name: "Wireless Noise Cancelling Headphones",
      description: "Over-ear headphones with superior sound",
      price: 2999,
      category: "Electronics",
      stock: 15,
      imageURL: "products/headphones.jpg",
    });

    await productModel.create({
      name: "Casual Cotton T-Shirt",
      description: "Comfortable breathable cotton shirt",
      price: 499,
      category: "Fashion",
      stock: 50,
      imageURL: "products/tshirt.jpg",
    });
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  it("should fetch all products successfully", async () => {
    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Products Fetched Successfully");
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.products.length).toBe(2);
  });

  it("should search and filter products by query parameter", async () => {
    const res = await request(app).get("/api/products?search=headphones");

    expect(res.status).toBe(200);
    expect(res.body.products.length).toBe(1);
    expect(res.body.products[0].name).toContain("Headphones");
  });

  it("should fetch product details by ID", async () => {
    const res = await request(app).get(`/api/products/${sampleProduct._id}`);

    expect(res.status).toBe(200);
    expect(res.body.product.name).toBe(sampleProduct.name);
    expect(res.body.product.price).toBe(2999);
  });

  it("should return 404 if product ID does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/products/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/Not Available/i);
  });
});
