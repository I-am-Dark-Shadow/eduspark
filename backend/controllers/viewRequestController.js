import ViewRequest from '../models/viewRequestModel.js';
import Result from '../models/resultModel.js';

// @desc    Student requests to view detailed result
// @route   POST /api/view-requests/request
// @access  Private/Student
const createViewRequest = async (req, res) => {
    const { resultId } = req.body;
    const studentId = req.user._id;

    const result = await Result.findById(resultId).populate('exam');
    if (!result) return res.status(404).json({ message: 'Result not found.' });

    const request = new ViewRequest({
        student: studentId,
        result: resultId,
        teacher: result.exam.createdBy,
    });

    await request.save();
    res.status(201).json({ message: 'Request to view details has been sent.' });
};

// UPDATED to handle both pending and history
// @desc    Teacher gets pending or historical view requests
// @route   GET /api/view-requests
// @access  Private/Teacher
const getPendingViewRequests = async (req, res) => {
    const { history } = req.query;
    let query = { teacher: req.user._id };

    if (history === 'true') {
        query.status = { $in: ['approved', 'denied'] };
    } else {
        query.status = 'pending';
    }

    const requests = await ViewRequest.find(query)
        .populate('student', 'name')
        .populate({
            path: 'result',
            select: 'exam score totalMarks',
            populate: { path: 'exam', select: 'title' }
        })
        .sort({ createdAt: -1 });

    res.status(200).json(requests);
};

// @desc    Teacher updates a view request
// @route   PUT /api/view-requests/:id
// @access  Private/Teacher
const updateViewRequestStatus = async (req, res) => {
    const { status } = req.body;
    const request = await ViewRequest.findById(req.params.id);
    if (!request || request.teacher.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Request not found or not authorized.' });
    }
    request.status = status;
    await request.save();
    res.status(200).json(request);
};

// @desc    Student gets the status of all their view requests
// @route   GET /api/view-requests/my-statuses
// @access  Private/Student
const getMyViewRequestStatuses = async (req, res) => {
    const statuses = await ViewRequest.find({ student: req.user._id });
    res.status(200).json(statuses);
};

export { createViewRequest, getPendingViewRequests, updateViewRequestStatus, getMyViewRequestStatuses };