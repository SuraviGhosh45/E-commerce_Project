import mongoose from "mongoose";

const orderScheema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min:0
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min:0
    },
    address: {
        fullname: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }

    },
    paymentId: {
        type:String
    },
    status:{
        type:String,
        enum:["Pending","Processing","Shipped","Delivered","Cancelled","Returned"],
        default:"Pending"
    }
},
 {
    timestamps: true
})

const orderModel=mongoose.model('order',orderScheema)

export default orderModel