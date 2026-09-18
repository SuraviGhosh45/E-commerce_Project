import jwt from "jsonwebtoken";
import userModel from "../model/user.model.js";

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            req.user = await userModel
                .findById(decoded.id)
                .select("-password");

                //tempo
            console.log("AUTH USER ID:", req.user?._id);
            console.log("AUTH USER EMAIL:", req.user?.email);
            console.log("JWT USER ID:", decoded.id);

            if (!req.user) {
                return res.status(401).json({
                    message: "User not found"
                });
            }

            next();

        } catch (error) {
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }
    } else {
        return res.status(401).json({
            message: "Auth failed. No token"
        });
    }
};

export default { protect };