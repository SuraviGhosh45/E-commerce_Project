import Razorpay from 'razorpay'
import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()

const createdOrder=async(req,res)=>{
    try{
        const instance=new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })
        const options={
            amount:req.body.amount*100, //amount in the smallest currency unit
            currency:"INR",
            receipt:crypto.randomBytes(10).toString("hex")
        }
        const order=await instance.orders.create(options)
        return res.status(200).json({
            message:"Initiated",
            order
        })
    }catch(error){
        return res.status(500).json({
            message:"Server Error"
        })
    }
}

const verifyPayment=async(req,res)=>{
    try{
        const{razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body
        const generated_signature=crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(razorpay_order_id+"|"+razorpay_payment_id).digest("hex")
        if(generated_signature===razorpay_signature){
            return res.status(200).json({
                message:"Payment Verification Successful"
            })
        }
        else{
            return res.status(400).json({
                message:"Payment Verification Failed"
            })
        }
    }catch(error){
        return res.status(500).json({
            message:"Server Error"
        })
    }
}

export {
    createdOrder,verifyPayment
}