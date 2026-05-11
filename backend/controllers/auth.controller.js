import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { customAlphabet } from "nanoid";
import User from "../models/user.model.js";
import OTP from "../models/otp.model.js";
import { sendOTPEmail } from "../utils/nodemailer.js";
import { uploadToR2, deleteFromR2 } from "../utils/r2.js";

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
    return { accessToken, refreshToken };
};

export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required", success: false });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email", success: false });
        }

        // Generate 6 digit numerical OTP using nanoid
        const generateOtp = customAlphabet("0123456789", 6);
        const otp = generateOtp();

        await OTP.findOneAndUpdate(
            { email },
            { otp, createdAt: Date.now() },
            { upsert: true, returnDocument: "after" }
        );

        // Send Email
        const emailResult = await sendOTPEmail(email, otp);
        if (!emailResult.success) {
            return res.status(500).json({ message: "Failed to send OTP email", success: false });
        }

        res.status(200).json({ message: "OTP sent successfully", success: true });
    } catch (error) {
        console.error("Send OTP Error:", error.message);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const register = async (req, res) => {
    try {
        const { name, username, email, password, otp } = req.body;
        if (!name || !username || !email || !password || !otp) {
            return res.status(400).json({ message: "Please provide all required fields including OTP", success: false });
        }

        // Ensure username has no spaces and length
        if (/\s/.test(username)) {
            return res.status(400).json({ message: "Username cannot contain spaces", success: false });
        }
        if (username.length < 5) {
            return res.status(400).json({ message: "Username must be at least 5 characters long", success: false });
        }

        // Password length check
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long", success: false });
        }

        // Verify OTP
        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid or expired OTP", success: false });
        }

        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            const field = user.email === email ? "Email" : "Username";
            return res.status(400).json({ message: `${field} is already taken`, success: false });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
        });

        // Delete OTP record after successful registration
        await OTP.deleteOne({ _id: otpRecord._id });

        const { accessToken, refreshToken } = generateTokens(newUser._id);
        
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        return res.status(201).json({ message: "User created successfully", success: true, accessToken });
    } catch (error) {
        console.log("Internal server error", error.message);
        return res.status(400).json({ message: "Internal server error", success: false });
    }
};

export const login = async(req,res)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Please provide all the required fields", success: false});
        }
        const user = await User.findOne({$or: [{email: email}, {username: email}]});
        if(!user){
            return res.status(400).json({message: "User not found", success: false});
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Incorrect password", success: false});
        }
        
        const { accessToken, refreshToken } = generateTokens(user._id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        return res.status(200).json({message: "Login successful", success: true, accessToken});  
    } catch (error) {
        console.log("Internal server error", error.message);  
        return res.status(400).json({message: "Internal server error", success: false});
    }
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided", success: false });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid refresh token", success: false });
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.id);

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ success: true, accessToken });
    } catch (error) {
        console.error("Refresh Token Error:", error.message);
        res.status(401).json({ message: "Invalid or expired refresh token", success: false });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;
        const file = req.file;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const updateData = {};
        if (name) updateData.name = name;

        if (file) {
            console.log("Attempting R2 upload for profile image...");
            const uploadResult = await uploadToR2(file);
            if (uploadResult.success) {
                updateData.profileImage = uploadResult.url;
                
                if (user.profileImage) {
                    const oldKey = user.profileImage.split('/').pop();
                    await deleteFromR2(oldKey);
                }
            } else {
                console.error("R2 Upload Failed:", uploadResult.error);
                return res.status(400).json({ 
                    message: "Image upload failed: " + uploadResult.error, 
                    success: false 
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");

        res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user: updatedUser
        });

    } catch (error) {
        console.error("Update Profile Error:", error.message);
        res.status(500).json({ message: "Internal server error during profile update", success: false });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password", success: false });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters long", success: false });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: "Password updated successfully", success: true });

    } catch (error) {
        console.error("Change Password Error:", error.message);
        res.status(500).json({ message: "Internal server error during password update", success: false });
    }
};

export const profile = async(req,res)=>{
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: 'purchases',
                populate: {
                    path: 'note',
                    model: 'Notes'
                }
            })
            .select("-password"); 

        if(!user){
            return res.status(400).json({message: "User not found", success: false});
        }
        return res.status(200).json({message: "Profile fetched successfully", success: true, user});
    } catch (error) {
        console.log("Internal server error", error.message);  
        return res.status(400).json({message: "Internal server error", success: false});       
    }
}

export const logout = async(req,res)=>{
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        return res.status(200).json({message: "Logout successful", success: true});
    } catch (error) {
        console.log("Internal server error", error.message);  
        return res.status(400).json({message: "Internal server error", success: false});     
    }
}