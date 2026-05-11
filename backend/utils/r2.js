import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config({quiet: true});

const r2 = new S3Client({
    region: "auto",
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
});

export const generatePresignedUrl = async (fileName, fileType) => {
    const params = {
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: fileName,
        ContentType: fileType,
    };

    try {
        const command = new PutObjectCommand(params);
        const url = await getSignedUrl(r2, command, { expiresIn: 3600 }); // 1 hour
        return { success: true, url, key: fileName };
    } catch (error) {
        console.error("Presigned URL Error:", error);
        return { success: false, error: error.message };
    }
};

export const generatePresignedGetUrl = async (key) => {
    const params = {
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: key,
    };

    try {
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(r2, command, { expiresIn: 900 }); // 15 minutes
        return { success: true, url };
    } catch (error) {
        console.error("Presigned GET URL Error:", error);
        return { success: false, error: error.message };
    }
};

export const uploadToR2 = async (file) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    const params = {
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        const command = new PutObjectCommand(params);
        await r2.send(command);
        
        const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL 
            ? `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${fileName}`
            : `${process.env.CLOUDFLARE_R2_ENDPOINT}/${process.env.CLOUDFLARE_R2_BUCKET_NAME}/${fileName}`;
        
        return {
            success: true,
            url: publicUrl,
            key: fileName
        };
    } catch (error) {
        console.error("R2 Upload Error:", error);
        return { success: false, error: error.message };
    }
};

export const deleteFromR2 = async (key) => {
    const params = {
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: key,
    };

    try {
        const command = new DeleteObjectCommand(params);
        await r2.send(command);
        return { success: true };
    } catch (error) {
        console.error("R2 Delete Error:", error);
        return { success: false, error: error.message };
    }
};

export default r2;
