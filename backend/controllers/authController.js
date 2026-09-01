import userModel from "../model/user.model"
import bcrypt from 'bcrypt'
import  jwt  from "jsonwebtoken"
import { sendEmail } from "../utils/sendEmail.js"

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
            Password: hashedPassword
        })

        if (newUser) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString()

            const message = `Hello ${name},
                        Your Vendora verification code is: ${otp}

                  This code is valid for 10 minutes. For security, do not share it with anyone.
Thank you,
The Vendora Team`;

            await sendEmail(email, "OTP For Registration", message)

            const token = getToken(newUser)

            res.cookie('authToken', token, {
                httpOnly: true,
                secure: false,
                maxAge: 3600000
            });

            res.status(201).json({
                _id:newUser._id,
                name:newUser.name,
                email:newUser.email,
                role:newUser.role,
                token:token
            })

        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}
