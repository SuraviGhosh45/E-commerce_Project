import userModel from "../model/user.model.js"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import sendEmail from "../utils/sendEmail.js"

const getToken = (user) => {
    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return token
}

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

        const newUser = await userModel.create({
            name: name,
            email: email,
            password: hashedPassword
        })

        if (newUser) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString()

            const message = `Hello ${name},

Thank you for signing up with Vendora!

Your verification code is:

${otp}

This code is valid for 10 minutes. For your security, please do not share this code with anyone.

If you did not request this code, please ignore this email.

Best regards,
The Vendora Team`;

            await sendEmail(email, "OTP For Registration", message)

            const token = getToken(newUser)

            res.cookie("authToken", token, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                token
            });


        }
        else {
            return res.status(400).json({
                message: "Internal Error"
            })
        }

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
        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: getToken(user)
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