import RetakeRequest from '../models/retakeRequestModel.js';
import Exam from '../models/examModel.js';

// @desc    Create a retake request
// @route   POST /api/retakes/request
// @access  Private/Student
const createRetakeRequest = async (req, res) => {
    const { examId, reason } = req.body;
    const studentId = req.user._id;

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const existingRequest = await RetakeRequest.findOne({ student: studentId, exam: examId });
    if (existingRequest) {
        return res.status(400).json({ message: 'You have already requested a retake for this exam.' });
    }

    const request = new RetakeRequest({
        student: studentId,
        exam: examId,
        teacher: exam.createdBy,
        reason,
    });
    await request.save();
    res.status(201).json({ message: 'Retake request submitted successfully.' });
};

// @desc    Get all retake requests for a teacher
// @route   GET /api/retakes
// @access  Private/Teacher
const getRetakeRequests = async (req, res) => {
    const { history } = req.query; // Check for a query param like ?history=true
    
    let query = { teacher: req.user._id };
    
    if (history === 'true') {
        // Fetch approved and denied requests for the history log
        query.status = { $in: ['approved', 'denied'] };
    } else {
        // Default to fetching only pending requests
        query.status = 'pending';
    }

    const requests = await RetakeRequest.find(query)
        .populate('student', 'name email')
        .populate('exam', 'title')
        .sort({ createdAt: -1 }); // Show newest first
    res.status(200).json(requests);
};

// @desc    Update the status of a retake request
// @route   PUT /api/retakes/:id
// @access  Private/Teacher
const updateRetakeRequestStatus = async (req, res) => {
    const { status } = req.body;
    const request = await RetakeRequest.findById(req.params.id);

    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.teacher.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    request.status = status;
    await request.save();
    res.status(200).json(request);
};

// NEW FUNCTION
// @desc    Get all retake requests for the logged-in student
// @route   GET /api/retakes/my-requests
// @access  Private/Student
const getMyRetakeRequests = async (req, res) => {
    const requests = await RetakeRequest.find({ student: req.user._id });
    res.status(200).json(requests);
};


// Make sure to export the new function
export { createRetakeRequest, getRetakeRequests, updateRetakeRequestStatus, getMyRetakeRequests };