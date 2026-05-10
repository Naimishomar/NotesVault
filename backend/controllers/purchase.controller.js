import Razorpay from "razorpay";
import crypto from "crypto";
import Purchase from "../models/purchase.model.js";
import Notes from "../models/notes.model.js";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config({quiet: true});

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
    const start = Date.now();
    try {
        const { noteId } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated", success: false });
        }

        // 1. Fetch note and check existing purchase (Parallel)
        const [note, existingPurchase] = await Promise.all([
            Notes.findById(noteId),
            Purchase.findOne({ user: userId, note: noteId, status: "completed" })
        ]);

        if (!note) {
            return res.status(404).json({ message: "Note not found", success: false });
        }

        if (existingPurchase) {
            return res.status(400).json({ message: "You have already purchased this note", success: false });
        }

        const options = {
            amount: Math.round(note.price * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        // 2. Create Razorpay order
        console.log(`[Perf] Starting Razorpay order creation for ₹${note.price}...`);
        const rzpStart = Date.now();
        
        let order;
        try {
            order = await razorpay.orders.create(options);
            console.log(`[Perf] Razorpay API took ${Date.now() - rzpStart}ms`);
        } catch (rzpError) {
            console.error("Razorpay API Error:", rzpError.message || rzpError);
            return res.status(502).json({ 
                message: "Payment Gateway unreachable. Please check your connection.", 
                success: false 
            });
        }

        if (!order || !order.id) {
            return res.status(500).json({ message: "Failed to create order ID", success: false });
        }

        // 3. Send response immediately to unblock UI
        res.status(201).json({
            success: true,
            order
        });

        // 4. Background: Create the pending purchase record
        Purchase.create({
            user: userId,
            note: noteId,
            price: note.price,
            razorpayOrderId: order.id,
            status: "pending",
        }).catch(err => console.error("Background Purchase Creation Error:", err.message));

        console.log(`[Perf] Total createOrder processing time: ${Date.now() - start}ms`);

    } catch (error) {
        console.error("Internal Purchase Error:", error.stack || error.message);
        if (!res.headersSent) {
            res.status(500).json({ message: "Internal server error during order creation", success: false });
        }
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment verified
            const purchase = await Purchase.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature,
                    status: "completed"
                },
                { new: true }
            );

            if (!purchase) {
                return res.status(404).json({ message: "Purchase record not found", success: false });
            }

            // Add purchase to user's record
            await User.findByIdAndUpdate(purchase.user, {
                $addToSet: { purchases: purchase._id }
            });

            return res.status(200).json({ message: "Payment verified successfully", success: true });
        } else {
            return res.status(400).json({ message: "Invalid payment signature", success: false });
        }
    } catch (error) {
        console.error("Verify Payment Error:", error.message);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const getUserPurchases = async (req, res) => {
    try {
        const userId = req.user.id;
        const purchases = await Purchase.find({ user: userId, status: "completed" })
            .populate("note")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, purchases });
    } catch (error) {
        console.error("Get User Purchases Error:", error.message);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
