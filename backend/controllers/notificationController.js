import RetakeRequest from '../models/retakeRequestModel.js';
import ViewRequest from '../models/viewRequestModel.js';
import Payment from '../models/paymentModel.js';

// @desc    Get counts of all pending requests for a teacher
// @route   GET /api/notifications/pending-counts
// @access  Private/Teacher
const getPendingCounts = async (req, res) => {
    try {
        const teacherId = req.user._id;

        const [retakeCount, viewCount, paymentCount] = await Promise.all([
            RetakeRequest.countDocuments({ teacher: teacherId, status: 'pending' }),
            ViewRequest.countDocuments({ teacher: teacherId, status: 'pending' }),
            Payment.countDocuments({ teacher: teacherId, status: 'pending' })
        ]);

        res.status(200).json({
            retakeCount,
            viewCount,
            paymentCount,
            totalPending: retakeCount + viewCount + paymentCount
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching notification counts.' });
    }
};

export { getPendingCounts };