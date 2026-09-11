import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import express from "express"
import dns from 'node:dns'; 
import connectDB from "./Src/config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./Src/routes/authRoutes.js";
import productRoutes from "./Src/routes/productRoutes.js"
import orderRoutes from "./Src/routes/orderRoutes.js"
import paymentRoutes from "./Src/routes/paymentRoutes.js"
import adminRoutes from "./Src/routes/adminRoutes.js"

dns.setServers(["8.8.8.8","1.1.1.1"])  // dns resolved
connectDB()   //database connected 

const app=express()
app.use(cors())
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/auth',authRoutes)
app.use('/api/products',productRoutes)
app.use('/api/orders',orderRoutes)
app.use('/api/payments',paymentRoutes)
app.use('/api/admin',adminRoutes)



app.get("/",(req,res)=>{
    res.status(200).json({
        message: "vendora working properly!"
    })
})

//server started
const port=process.env.PORT
app.listen(port,()=>{
    console.log("Vendora started")
})