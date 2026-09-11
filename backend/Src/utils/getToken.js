import jwt from "jsonwebtoken"
const getToken = (user) => {
    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return token
}

export default getToken