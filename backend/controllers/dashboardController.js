import User from '../models/userModel.js';
import Exam from '../models/examModel.js';
import RetakeRequest from '../models/retakeRequestModel.js';
import ViewRequest from '../models/viewRequestModel.js';

// @desc    Get all aggregated stats for the teacher dashboard
// @route   GET /api/dashboard/teacher
// @access  Private/Teacher
const getTeacherDashboardStats = async (req, res) => {
    try {
        const teacherId = req.user._id;

        const [studentCount, examCount, pendingRetakes, pendingViewRequests, recentExams] = await Promise.all([
            User.countDocuments({ role: 'student', createdBy: teacherId }),
            Exam.countDocuments({ createdBy: teacherId }),
            RetakeRequest.countDocuments({ teacher: teacherId, status: 'pending' }),
            ViewRequest.countDocuments({ teacher: teacherId, status: 'pending' }),
            Exam.find({ createdBy: teacherId }).sort({ createdAt: -1 }).limit(5).select('title createdAt')
        ]);

        res.status(200).json({
            studentCount,
            examCount,
            pendingRetakes,
            pendingViewRequests,
            recentExams
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching dashboard data.' });
    }
};

export { getTeacherDashboardStats };