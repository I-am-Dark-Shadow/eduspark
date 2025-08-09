import express from 'express';
import { protect, teacher } from '../middleware/authMiddleware.js';
import { getPendingCounts } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/pending-counts', protect, teacher, getPendingCounts);

export default router;