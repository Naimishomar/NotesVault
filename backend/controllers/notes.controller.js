import Notes from "../models/notes.model.js";
import { uploadToR2, deleteFromR2 } from "../utils/r2.js";

export const uploadNote = async (req, res) => {
    try {
        console.log("Upload Request Body:", req.body);
        const { title, description, price, totalPages, subject } = req.body;
        const pdfFile = req.files?.pdf?.[0];
        const thumbnailFile = req.files?.thumbnail?.[0];

        // Process subject to ensure it's an array
        let processedSubject = subject;
        if (typeof subject === 'string') {
            processedSubject = [subject];
        }

        if (!pdfFile) {
            return res.status(400).json({ message: "Please upload a PDF file", success: false });
        }

        if (!thumbnailFile) {
            return res.status(400).json({ message: "Please upload a thumbnail image", success: false });
        }

        if (!title || !description || !price || !totalPages || !processedSubject || processedSubject.length === 0) {
            return res.status(400).json({ message: "Please provide all details (title, description, price, totalPages, subject)", success: false });
        }

        // Upload PDF to Cloudflare R2
        const pdfUploadResult = await uploadToR2(pdfFile);
        if (!pdfUploadResult.success) {
            return res.status(500).json({ message: "Failed to upload PDF to R2", success: false });
        }

        // Upload Thumbnail to Cloudflare R2
        const thumbnailUploadResult = await uploadToR2(thumbnailFile);
        if (!thumbnailUploadResult.success) {
            // Cleanup: delete uploaded PDF if thumbnail fails
            await deleteFromR2(pdfUploadResult.key);
            return res.status(500).json({ message: "Failed to upload thumbnail to R2", success: false });
        }

        // Save note to database
        const newNote = new Notes({
            title,
            description,
            price,
            totalPages,
            subject: processedSubject,
            url: pdfUploadResult.url,
            fileKey: pdfUploadResult.key,
            thumbnail: thumbnailUploadResult.url,
            thumbnailKey: thumbnailUploadResult.key
        });

        await newNote.save();

        res.status(201).json({
            message: "Note uploaded successfully",
            success: true,
            note: newNote
        });

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
        const notes = await Notes.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, notes });
    } catch (error) {
        console.error("Get All Notes Error:", error.message);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
