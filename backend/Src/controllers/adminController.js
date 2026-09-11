import userModel from "../model/user.model.js";
import productModel from "../model/product.model.js";
import orderModel from "../model/order.model.js";

export const getAdminStats=async(req,res)=>{
    try{
        const total_user=await userModel.countDocuments({role:'user'})
        const total_product=await productModel.countDocuments({})
        const total_order=await orderModel.countDocuments({})

        const orders=await orderModel.find({})

        const total_Revenue_Data=orders.reduce((acc,order)=>acc+order.totalAmount,0)

        res.status(200).json({
            total_user,
            total_product,
            total_order,
            total_Revenue:total_Revenue_Data
        })

    }catch(error){
        return res.status(500).json({
            message:"Internal Error",
            error
        })
    }
}

