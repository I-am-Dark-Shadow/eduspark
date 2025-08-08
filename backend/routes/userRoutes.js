import express from 'express';
import { protect, teacher } from '../middleware/authMiddleware.js';
import {
    loginUser,
    logoutUser,
    registerStudent,
    getUserProfile,
    updateUserProfile,
    getMyStudents,
    getStudentById,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.post('/register-student', protect, teacher, registerStudent);
router.get('/students', protect, teacher, getMyStudents);
router.get('/students/:id', protect, teacher, getStudentById);


export default router;