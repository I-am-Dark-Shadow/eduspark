// routes/uploadRoutes.js
import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';

const router = express.Router();
const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
    res.status(200).json({
        message: 'Image uploaded successfully',
        imageUrl: req.file.path
    });
});

export default router;