import express from 'express';
import { protect, teacher } from '../middleware/authMiddleware.js';
import { createExam, getAllExams, getExamById } from '../controllers/examController.js';

const router = express.Router();

router.route('/').post(protect, teacher, createExam).get(protect, getAllExams);
router.route('/:id').get(protect, getExamById);

export default router;