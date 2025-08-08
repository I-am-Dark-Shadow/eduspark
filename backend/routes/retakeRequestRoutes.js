import express from 'express';
import { protect, teacher, student } from '../middleware/authMiddleware.js';
import {
    createRetakeRequest,
    getRetakeRequests,
    updateRetakeRequestStatus,
    getMyRetakeRequests // Import the new function
} from '../controllers/retakeRequestController.js';

const router = express.Router();

// NEW ROUTE for students to check their request statuses
router.get('/my-requests', protect, student, getMyRetakeRequests);

router.post('/request', protect, student, createRetakeRequest);
router.get('/', protect, teacher, getRetakeRequests);
router.put('/:id', protect, teacher, updateRetakeRequestStatus);

export default router;