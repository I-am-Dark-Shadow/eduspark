import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'elearning_profiles',
        allowed_formats: ['png', 'jpg', 'jpeg'],
        format: async (req, file) => path.extname(file.originalname).substring(1),
        public_id: (req, file) => file.fieldname + '-' + Date.now(),
    },
});

export { cloudinary, storage };