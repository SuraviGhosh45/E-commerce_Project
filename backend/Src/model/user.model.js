import mongoose from "mongoose";

const UserScheema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'Enter a valid email']
    },
    password:{
        type:String,
        required:true,
        match:[/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Enter 1 lowercase, 1 uppercase, 1 digit, 1 special character and minimum 8 characters']
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },

    isVerified: {
    type: Boolean,
    default: false
}
})

const userModel=mongoose.model("user",UserScheema)

export default userModel