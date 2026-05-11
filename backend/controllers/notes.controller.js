import Notes from "../models/notes.model.js";
import Purchase from "../models/purchase.model.js";
import { uploadToR2, deleteFromR2, generatePresignedUrl, generatePresignedGetUrl } from "../utils/r2.js";

export const generatePresignedUrlController = async (req, res) => {
    try {
        const { fileName, fileType } = req.body;
        if (!fileName || !fileType) {
            return res.status(400).json({ message: "File name and type are required", success: false });
        }

        const uniqueFileName = `${Date.now()}-${fileName}`;
        const result = await generatePresignedUrl(uniqueFileName, fileType);
        
        if (!result.success) {
            return res.status(500).json({ message: "Failed to generate presigned URL", success: false });
        }

        res.status(200).json({
            success: true,
            uploadUrl: result.url,
            fileUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL 
                ? `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${uniqueFileName}`
                : `${process.env.CLOUDFLARE_R2_ENDPOINT}/${process.env.CLOUDFLARE_R2_BUCKET_NAME}/${uniqueFileName}`,
            fileKey: result.key
        });
    } catch (error) {
        console.error("Presigned URL Controller Error:", error.message);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const getNoteDownloadUrl = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.isAdmin;

        const note = await Notes.findById(id);
        if (!note) {
            return res.status(404).json({ message: "Note not found", success: false });
        }

        // Security Check: Admin or Purchased
        if (!isAdmin) {
            const purchase = await Purchase.findOne({ user: userId, note: id, status: "completed" });
            if (!purchase) {
                return res.status(403).json({ message: "Access denied. Please purchase this note to view/download.", success: false });
            }
        }

        // Generate high-security temporary URL
        const result = await generatePresignedGetUrl(note.fileKey);
        if (!result.success) {
            return res.status(500).json({ message: "Failed to generate secure download link", success: false });
        }

        res.status(200).json({
            success: true,
            downloadUrl: result.url
        });

    } catch (error) {
        console.error("Get Download URL Error:", error.message);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const uploadNote = async (req, res) => {
    try {
        console.log("Upload Request Body:", req.body);
        const { title, description, price, totalPages, subject, pdfUrl, pdfKey, thumbnailUrl, thumbnailKey } = req.body;
        const pdfFile = req.files?.pdf?.[0];
        const thumbnailFile = req.files?.thumbnail?.[0];

        // Process subject to ensure it's an array
        let processedSubject = subject;
        if (typeof subject === 'string') {
            processedSubject = [subject];
        }

        if (!title || !description || !price || !totalPages || !processedSubject || processedSubject.length === 0) {
            return res.status(400).json({ message: "Please provide all details", success: false });
        }

        let finalPdfUrl = pdfUrl;
        let finalPdfKey = pdfKey;
        let finalThumbnailUrl = thumbnailUrl;
        let finalThumbnailKey = thumbnailKey;

        // Handle Legacy File Upload if direct URLs aren't provided
        if (!finalPdfUrl && pdfFile) {
            const pdfUploadResult = await uploadToR2(pdfFile);
            if (!pdfUploadResult.success) return res.status(500).json({ message: "PDF upload failed", success: false });
            finalPdfUrl = pdfUploadResult.url;
            finalPdfKey = pdfUploadResult.key;
        }

        if (!finalThumbnailUrl && thumbnailFile) {
            const thumbnailUploadResult = await uploadToR2(thumbnailFile);
            if (!thumbnailUploadResult.success) return res.status(500).json({ message: "Thumbnail upload failed", success: false });
            finalThumbnailUrl = thumbnailUploadResult.url;
            finalThumbnailKey = thumbnailUploadResult.key;
        }

        if (!finalPdfUrl || !finalThumbnailUrl) {
            return res.status(400).json({ message: "Missing files or URLs", success: false });
        }

        const newNote = new Notes({
            title,
            description,
            price,
            totalPages,
            subject: processedSubject,
            url: finalPdfUrl,
            fileKey: finalPdfKey,
            thumbnail: finalThumbnailUrl,
            thumbnailKey: finalThumbnailKey
        });

        await newNote.save();
        res.status(201).json({ message: "Note published successfully", success: true, note: newNote });

    } catch (error) {
        console.error("Upload Note Error:", error.message);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, totalPages, subject } = req.body;
        const pdfFile = req.files?.pdf?.[0];
        const thumbnailFile = req.files?.thumbnail?.[0];

        const note = await Notes.findById(id);
        if (!note) {
            return res.status(404).json({ message: "Note not found", success: false });
        }

        if (title) note.title = title;
        if (description) note.description = description;
        if (price) note.price = price;
        if (totalPages) note.totalPages = totalPages;
        
        if (subject) {
            let processedSubject = subject;
            if (typeof subject === 'string') {
                processedSubject = [subject];
            }
            note.subject = processedSubject;
        }

        if (pdfFile) {
            // Delete old file from R2
            await deleteFromR2(note.fileKey);
            // Upload new file
            const uploadResult = await uploadToR2(pdfFile);
            if (!uploadResult.success) {
                return res.status(500).json({ message: "Failed to upload new PDF to R2", success: false });
            }
            note.url = uploadResult.url;
            note.fileKey = uploadResult.key;
        }

        if (thumbnailFile) {
            // Delete old thumbnail from R2
            await deleteFromR2(note.thumbnailKey);
            // Upload new thumbnail
            const uploadResult = await uploadToR2(thumbnailFile);
            if (!uploadResult.success) {
                return res.status(500).json({ message: "Failed to upload new thumbnail to R2", success: false });
            }
            note.thumbnail = uploadResult.url;
            note.thumbnailKey = uploadResult.key;
        }

        await note.save();

        res.status(200).json({
            message: "Note updated successfully",
            success: true,
            note
        });

    } catch (error) {
        console.error("Update Note Error:", error.message);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        const note = await Notes.findById(id);
        if (!note) {
            return res.status(404).json({ message: "Note not found", success: false });
        }

        // Delete files from R2
        await deleteFromR2(note.fileKey);
        await deleteFromR2(note.thumbnailKey);

        // Delete from database
        await Notes.findByIdAndDelete(id);

        res.status(200).json({
            message: "Note deleted successfully from database and R2",
            success: true
        });

    } catch (error) {
        console.error("Delete Note Error:", error.message);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const getAllNotes = async (req, res) => {
    try {
        // SECURITY: Exclude URL and fileKey from public listings
        const notes = await Notes.find().select("-url -fileKey").sort({ createdAt: -1 });
        res.status(200).json({ success: true, notes });
    } catch (error) {
        console.error("Get All Notes Error:", error.message);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
