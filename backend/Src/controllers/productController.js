import productModel from "../model/product.model.js";
import s3 from "../config/s3.js"
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const getProducts = async (req, res) => {
    try {
        const products = await productModel.find({})
        if (products) {
            return res.status(200).json({
                message: "Products Fetched Successfully",
                products
            })
        }
        else {
            return res.status(404).json({
                message: "No Products Available"
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: "Server Error"
        })
    }
}

const getProductById = async (req, res) => {
    try {

        const product = await productModel.findById(req.params.id)

        if (product) {
            return res.status(200).json({
                product,
                message: "Product Fetched Successfully."
            })
        }
        else {
            return res.status(404).json({
                message: "This Product Not Available"
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: "Server Error"
        })
    }
}

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body
        let imageURL = ''
        if (req.file) {
            const key = `products/${Date.now()}-${req.file.originalname}`;
            const command = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: key,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            })
            await s3.send(command)
            imageURL = key
        }

        const newProduct = await productModel.create({
            name: name,
            description: description,
            price: price,
            category: category,
            stock: stock,
            imageURL: imageURL
        })

        res.status(201).json({
            message: "Product Created and Saved Successfully",
            newProduct
        })

    } catch (error) {
        return res.status(500).json({
            message: "Server Error"
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body || {};

        const product = await productModel.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product Not Found"
            });
        }

        product.name = name ?? product.name;
        product.description = description ?? product.description;
        product.price = price ?? product.price;
        product.category = category ?? product.category;
        product.stock = stock ?? product.stock;


        if (req.file) {
            const oldImageKey = product.imageURL;
            const key = `products/${Date.now()}-${req.file.originalname}`;

            const command = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: key,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            });

            await s3.send(command);

            product.imageURL = key;


            if (oldImageKey) {
                const deleteCommand = new DeleteObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: oldImageKey
                });
                await s3.send(deleteCommand);
            }
        }

        const updatedProduct = await product.save();

        return res.status(200).json({
            message: "Product Updated Successfully",
            updatedProduct
        });

    } catch (error) {
        console.log("UPDATE PRODUCT ERROR:", error);

        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        if (product) {
            if (product.imageURL) {

                const deleteCommand = new DeleteObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: product.imageURL
                });

                await s3.send(deleteCommand);
            }
            await productModel.deleteOne({ _id: req.params.id });
            return res.status(200).json({
                message: "Product Deleted Successfully"
            })
        }
        else {
            return res.status(404).json({
                message: "Product Not Found"
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: "Server Error"
        })
    }
}

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};