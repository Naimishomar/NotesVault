import mongoose from "mongoose";

const NotesSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    subject:{
        type: [String],
        required: true,
    },
    url:{
        type: String,
        required: true,
    },
    fileKey:{
        type: String,
        required: true,
    },
    thumbnail:{
        type: String,
        required: true,
    },
    thumbnailKey:{
        type: String,
        required: true,
    },
    totalPages:{
        type: Number,
        required: true,
    }
},{timestamps: true});

const Notes = mongoose.model("Notes", NotesSchema);
export default Notes;