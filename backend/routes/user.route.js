import express from "express";
import multer from "multer";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { register, login, logout, profile, sendOTP, refreshToken, updateProfile, changePassword } from "../controllers/auth.controller.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/send-otp", sendOTP);
router.post("/refresh-token", refreshToken);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/profile", authMiddleware, profile);
router.put("/update-profile", authMiddleware, upload.single("profileImage"), updateProfile);
router.put("/change-password", authMiddleware, changePassword);

export default router;