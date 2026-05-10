import express from "express";
import User from "../models/user.model.js";

export const uploadNotes = async(req,res)=>{
    try {
        
    } catch (error) {
        console.log("Internal server error", error.message);  
        return res.status(400).json({message: "Internal server error", success: false}); 
    }
}
