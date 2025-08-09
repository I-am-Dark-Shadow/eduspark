import express from 'express';
import { protect, teacher, student } from '../middleware/authMiddleware.js';
import { getTeacherDashboardStats, getStudentPerformance } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/teacher', protect, teacher, getTeacherDashboardStats);
router.get('/student-performance', protect, student, getStudentPerformance);

export default router;