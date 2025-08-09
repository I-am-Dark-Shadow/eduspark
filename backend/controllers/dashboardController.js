import User from '../models/userModel.js';
import Exam from '../models/examModel.js';
import RetakeRequest from '../models/retakeRequestModel.js';
import ViewRequest from '../models/viewRequestModel.js';
import Result from '../models/resultModel.js';
import { startOfWeek, startOfMonth, subWeeks, subMonths } from 'date-fns';

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

const getStudentPerformance = async (req, res) => {
    try {
        const studentId = req.user._id;
        const { period = 'monthly' } = req.query; // Default to monthly

        const allResults = await Result.find({ student: studentId, submitted: true });

        if (allResults.length === 0) {
            return res.status(200).json({ overallAverage: 0, performanceData: [] });
        }

        // Calculate overall average
        const totalScore = allResults.reduce((acc, r) => acc + (r.score / r.totalMarks) * 100, 0);
        const overallAverage = totalScore / allResults.length;

        // Filter data for the chart based on period
        const now = new Date();
        let startDate;
        if (period === 'weekly') {
            startDate = startOfWeek(now);
        } else if (period === 'monthly') {
            startDate = startOfMonth(now);
        } else { // default to monthly
            startDate = startOfMonth(now);
        }
        
        const periodResults = allResults.filter(r => new Date(r.createdAt) >= startDate);
        
        const performanceData = periodResults.map(r => ({
            name: new Date(r.createdAt).toLocaleDateString(),
            score: (r.score / r.totalMarks) * 100
        }));

        res.status(200).json({ overallAverage, performanceData });

    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching performance data.' });
    }
};

export { getTeacherDashboardStats, getStudentPerformance  };