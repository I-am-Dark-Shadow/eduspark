import express from 'express';
import { protect, teacher, student } from '../middleware/authMiddleware.js';
import { createPaymentRequest, getAllStudentPayments, getMyPaymentHistory, getPaymentRequests, updatePaymentRequest } from '../controllers/paymentController.js';

const router = express.Router();

// Student Routes
router.post('/request', protect, student, createPaymentRequest);
router.get('/my-history', protect, student, getMyPaymentHistory);

// Teacher Routes
router.get('/students', protect, teacher, getAllStudentPayments);
router.get('/requests', protect, teacher, getPaymentRequests);
router.put('/request/:id', protect, teacher, updatePaymentRequest);

export default router;