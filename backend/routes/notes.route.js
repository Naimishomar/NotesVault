import express from "express";
import multer from "multer";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";
import { uploadNote, getAllNotes, updateNote, deleteNote, generatePresignedUrlController } from "../controllers/notes.controller.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

router.post("/generate-presigned-url", authMiddleware, adminMiddleware, generatePresignedUrlController);
router.post("/upload", authMiddleware, adminMiddleware, upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), uploadNote);
router.put("/update/:id", authMiddleware, adminMiddleware, upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), updateNote);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteNote);
router.get("/all", getAllNotes);

export default router;
