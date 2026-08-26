import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import express from "express"
import dns from 'node:dns'; 
dns.setServers(["8.8.8.8","1.1.1.1"])

const app=express()
app.use(cors())

app.get("/",(req,res)=>{
    res.status(200).json({
        message: "vendora working properly!"
    })
})

const port=process.env.PORT||5000
app.listen(port,()=>{
    console.log("Vendora started")
})