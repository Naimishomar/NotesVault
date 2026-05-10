import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createOrder, verifyPayment, getUserPurchases } from "../controllers/purchase.controller.js";

const router = express.Router();

// Create Razorpay order
router.post("/create-order", authMiddleware, createOrder);

// Verify Razorpay payment
router.post("/verify-payment", authMiddleware, verifyPayment);

// Get user's purchased notes
router.get("/my-purchases", authMiddleware, getUserPurchases);

export default router;
