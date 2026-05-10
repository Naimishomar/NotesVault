import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({quiet: true});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ETHEREAL_USERNAME, 
        pass: process.env.ETHEREAL_PASSWORD
    }
});

export const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: '"Notes Selling" <no-reply@notesvault.com>',
        to: email,
        subject: "Verify your email - OTP",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #333; text-align: center;">Welcome to Notes Selling!</h2>
                <p style="font-size: 16px; color: #555;">Hello,</p>
                <p style="font-size: 16px; color: #555;">Thank you for signing up. Please use the following OTP to verify your email address. This OTP is valid for 10 minutes.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px;">${otp}</span>
                </div>
                <p style="font-size: 14px; color: #888; text-align: center;">If you did not request this, please ignore this email.</p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("-----------------------------------------");
        console.log("OTP Sent to:", email);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        console.log("-----------------------------------------");
        return { success: true, previewUrl: nodemailer.getTestMessageUrl(info) };
    } catch (error) {
        console.error("Nodemailer Error:", error);
        return { success: false, error: error.message };
    }
};

export default transporter;
