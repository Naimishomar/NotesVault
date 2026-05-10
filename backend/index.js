import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./db/db.js";
import authRouter from "./routes/user.route.js";
import notesRouter from "./routes/notes.route.js";
import purchaseRouter from "./routes/purchase.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ["http://localhost:5173"], // Add your frontend URL
    credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/notes", notesRouter);
app.use("/api/purchase", purchaseRouter);

app.get("/", (req,res)=>{
    res.send("Backend never gets down!🚀")
})

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is listening at PORT: ${PORT} 🚀`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
    }
};

startServer();