import userModel from "../model/user.model.js";
import getToken from "../utils/getToken.js";

const verifyOtp = async (req, res) => {
    try{
        const { email, otp } = req.body

    if (!email || !otp) {
        return res.status(400).json({
            message: "Email and OTP are required"
        });
    }
    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    if (user.isVerified) {
        return res.status(400).json({
            message: "Email is already verified"
        });
    }

    if (!user.otp || !user.otpExpires) {
        return res.status(400).json({
            message: "OTP not found. Please request a new OTP."
        });
    }
    if (user.otpExpires < new Date()) {
        return res.status(400).json({
            message: "OTP has expired. Please request a new OTP."
        });
    }
    if (user.otp !== otp) {
        return res.status(400).json({
            message: "Invalid OTP"
        });
    }
    
        user.isVerified = true
        user.otp = undefined
        user.otpExpires = undefined

        await user.save()

        const token = getToken(user)

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({
            message: "Email verified successfully",
            token
        });
    
    }catch(error){

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }

}
export default verifyOtp