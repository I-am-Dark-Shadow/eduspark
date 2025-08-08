import express from 'express';
import { protect, teacher, student } from '../middleware/authMiddleware.js';
import { createViewRequest, getPendingViewRequests, updateViewRequestStatus, getMyViewRequestStatuses } from '../controllers/viewRequestController.js';

const router = express.Router();

router.post('/request', protect, student, createViewRequest);
router.get('/', protect, teacher, getPendingViewRequests);
router.get('/my-statuses', protect, student, getMyViewRequestStatuses);
router.put('/:id', protect, teacher, updateViewRequestStatus);

export default router;