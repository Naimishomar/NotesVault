import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authMiddleware = async(req,res, next)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({message: "Please provide token", success: false});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message: "Invalid token", success: false});
        }
        const user = await User.findById(decoded.id);
        if(!user){
            return res.status(401).json({message: "User not found", success: false});
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Internal server error", error.message);
        return res.status(400).json({message: "Internal server error", success: false});
    }
}

export const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(403).json({ message: "Access denied. Admins only.", success: false });
    }
};