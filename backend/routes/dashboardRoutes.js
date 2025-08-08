import express from 'express';
import { protect, teacher } from '../middleware/authMiddleware.js';
import { getTeacherDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/teacher', protect, teacher, getTeacherDashboardStats);

export default router;