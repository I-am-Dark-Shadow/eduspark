import express from 'express';
import { protect, teacher } from '../middleware/authMiddleware.js';
import { createCourse, getCourses } from '../controllers/courseController.js';

const router = express.Router();

router.route('/').post(protect, teacher, createCourse).get(getCourses);

export default router;