import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
        unique: true,
        minLength: [5, "Username must be at least 5 characters long"],
        maxLength: [128, "Username must be less than 128 characters long"],
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        minLength: [5, "Password must be at least 5 characters long"],
        maxLength: [128, "Password must be less than 128 characters long"],
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
    profileImage:{
        type: String,
    },
    purchases:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Purchase",
    }]
}, {timestamps: true});

const User = mongoose.model("User", UserSchema);
export default User;