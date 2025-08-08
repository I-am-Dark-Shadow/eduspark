import express from 'express';
import { protect, teacher, student } from '../middleware/authMiddleware.js';
import {
    startExam,
    submitExam,
    getMyResults,
    getStudentResults,
    getResultById
} from '../controllers/resultController.js';

const router = express.Router();

router.post('/start-exam', protect, student, startExam);
router.post('/submit', protect, student, submitExam);
router.get('/my-results', protect, student, getMyResults);
router.get('/student/:studentId', protect, teacher, getStudentResults);
router.get('/:id', protect, getResultById);

export default router;