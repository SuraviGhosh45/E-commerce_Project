import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import express from "express"
import dns from 'node:dns'; 
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dns.setServers(["8.8.8.8","1.1.1.1"])  // dns resolved
connectDB()   //database connected 

const app=express()
app.use(cors())
app.use(cookieParser());

app.use('/api/auth',authRoutes)


//get api used for data fetching
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