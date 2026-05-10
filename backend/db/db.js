import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({quiet: true});

export const connectDB = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        const connect = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`Connected to database: ${connect.connection.host} ✅`);
    } catch (error) {
        console.error("❌ Database connection error:", error.message);
        if (error.message.includes("ETIMEOUT") || error.message.includes("selection timed out")) {
            console.error("Critical: Your network is blocking the connection to MongoDB Atlas.");
        }
        throw error; // Re-throw to prevent server from starting
    }
}