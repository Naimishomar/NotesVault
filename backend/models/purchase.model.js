import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    note:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notes",
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    razorpayOrderId:{
        type: String,
        required: true,
    },
    razorpayPaymentId:{
        type: String,
    },
    razorpaySignature:{
        type: String,
    },
    status:{
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    }
}, {timestamps: true});

const Purchase = mongoose.model("Purchase", PurchaseSchema);
export default Purchase;