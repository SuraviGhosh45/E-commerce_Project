import userModel from "../model/user.model.js"
import bcrypt from 'bcrypt'
import sendEmail from "../utils/sendEmail.js"
import getToken from "../utils/getToken.js"



const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const UserExist = await userModel.findOne({ email })

        if (UserExist) {
            return res.status(400).json({
                message: "Email Already Exist"
            })
        }


        const hashedPassword = await bcrypt.hash(password, 10)

        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        const otpExpires = new Date(
            Date.now() + 10 * 60 * 1000
        )
        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpires,
            isVerified: false
        })
        const message = `Hello ${name},

Thank you for signing up with Vendora!

Your verification code is:

${otp}

This code is valid for 10 minutes. For your security, please do not share this code with anyone.

If you did not request this code, please ignore this email.

Best regards,
The Vendora Team`;

        await sendEmail(email, "Vendora Email Verification OTP", message)


        return res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            isVerified: newUser.isVerified
        });




    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}


const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Kindly Register first."
            })
        }
        if (!user.isVerified) {
            return res.status(403).json({
                message: "Please verify your email before logging in"
            });
        }
        const token = getToken(user);

        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            })
        }
        else {
            return res.status(400).json({
                message: "Invalid Email or Password"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password')
        if (users) {
            return res.status(200).json({
                message: "All users fetched successfully",
                users: users
            })
        }
        else {
            return res.status(404).json({
                message: "Users not found"
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export default { register, login, getUsers }