import productModel from "../model/product.model.js";
import s3 from "../config/s3.js";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const createS3Key = (file) => {
  const safeName = file.originalname
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");

  return `products/${Date.now()}-${safeName}`;
};

const getProducts = async (req, res) => {
  try {
    const products = await productModel.find({});

    return res.status(200).json({
      message: "Products Fetched Successfully",
      products,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "This Product Not Available",
      });
    }

    return res.status(200).json({
      product,
      message: "Product Fetched Successfully.",
    });
  } catch (error) {
    console.error("GET PRODUCT BY ID ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !description || price === undefined || !category || stock === undefined) {
      return res.status(400).json({
        message: "All product fields are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        message: "Invalid product price",
      });
    }

    if (!Number.isInteger(numericStock) || numericStock < 0) {
      return res.status(400).json({
        message: "Invalid product stock",
      });
    }

    const key = createS3Key(req.file);

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await s3.send(command);

    const newProduct = await productModel.create({
      name: name.trim(),
      description: description.trim(),
      price: numericPrice,
      category: category.trim(),
      stock: numericStock,
      imageURL: key,
    });

    return res.status(201).json({
      message: "Product Created and Saved Successfully",
      newProduct,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body || {};

    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(400).json({
          message: "Product name cannot be empty",
        });
      }
      product.name = String(name).trim();
    }

    if (description !== undefined) {
      if (!String(description).trim()) {
        return res.status(400).json({
          message: "Product description cannot be empty",
        });
      }
      product.description = String(description).trim();
    }

    if (price !== undefined) {
      const numericPrice = Number(price);

      if (!Number.isFinite(numericPrice) || numericPrice < 0) {
        return res.status(400).json({
          message: "Invalid product price",
        });
      }

      product.price = numericPrice;
    }

    if (category !== undefined) {
      if (!String(category).trim()) {
        return res.status(400).json({
          message: "Product category cannot be empty",
        });
      }
      product.category = String(category).trim();
    }

    if (stock !== undefined) {
      const numericStock = Number(stock);

      if (!Number.isInteger(numericStock) || numericStock < 0) {
        return res.status(400).json({
          message: "Invalid product stock",
        });
      }

      product.stock = numericStock;
    }

    if (req.file) {
      const oldImageKey = product.imageURL;
      const newImageKey = createS3Key(req.file);

      const uploadCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: newImageKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      });

      await s3.send(uploadCommand);

      product.imageURL = newImageKey;

      if (oldImageKey) {
        try {
          const deleteCommand = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: oldImageKey,
          });

          await s3.send(deleteCommand);
        } catch (deleteError) {
          console.error("OLD IMAGE DELETE ERROR:", deleteError);
        }
      }
    }

    const updatedProduct = await product.save();

    return res.status(200).json({
      message: "Product Updated Successfully",
      updatedProduct,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    if (product.imageURL) {
      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: product.imageURL,
        });

        await s3.send(deleteCommand);
      } catch (deleteError) {
        console.error("S3 IMAGE DELETE ERROR:", deleteError);
      }
    }

    await productModel.deleteOne({
      _id: req.params.id,
    });

    return res.status(200).json({
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const getProductImage = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (!product.imageURL) {
      return res.status(404).json({
        message: "Product image not found",
      });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: product.imageURL,
    });

    const response = await s3.send(command);

    if (!response.Body) {
      return res.status(404).json({
        message: "Image body not found",
      });
    }

    const imageBuffer = await response.Body.transformToByteArray();

    res.setHeader(
      "Content-Type",
      response.ContentType || "image/jpeg"
    );

    res.setHeader(
      "Content-Length",
      imageBuffer.length
    );

    res.setHeader(
      "Cache-Control",
      "public, max-age=3600"
    );

    return res.end(Buffer.from(imageBuffer));
  } catch (error) {
    console.error("GET PRODUCT IMAGE ERROR:", error);

    return res.status(500).json({
      message: "Unable to load product image",
    });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductImage,
};