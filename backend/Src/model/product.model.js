import mongoose from "mongoose";

const productScheema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    ratings: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    }
})

const productModel = mongoose.model('product', productScheema)

export default productModel