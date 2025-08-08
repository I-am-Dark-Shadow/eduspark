import Payment from '../models/paymentModel.js';
import User from '../models/userModel.js';

// @desc    Student creates a payment request
// @route   POST /api/payments/request
// @access  Private/Student
const createPaymentRequest = async (req, res) => {
    const { month, year, paymentMethod, billScreenshot } = req.body;
    const student = await User.findById(req.user._id);

    const request = new Payment({
        student: req.user._id,
        teacher: student.createdBy,
        month,
        year,
        paymentMethod,
        billScreenshot: billScreenshot || null,
    });
    await request.save();
    res.status(201).json(request);
};

// @desc    Teacher gets all payment data for all their students
// @route   GET /api/payments/students
// @access  Private/Teacher
const getAllStudentPayments = async (req, res) => {
    const students = await User.find({ createdBy: req.user._id }).select('_id name');
    const studentIds = students.map(s => s._id);

    const payments = await Payment.find({ student: { $in: studentIds } });
    
    // Structure data for easy frontend use
    const paymentData = students.map(student => {
        return {
            studentId: student._id,
            studentName: student.name,
            payments: payments.filter(p => p.student.toString() === student._id.toString())
        };
    });

    res.status(200).json(paymentData);
};

// @desc    Student gets their own payment history
// @route   GET /api/payments/my-history
// @access  Private/Student
const getMyPaymentHistory = async (req, res) => {
    const payments = await Payment.find({ student: req.user._id });
    res.status(200).json(payments);
};

// @desc    Teacher gets pending payment requests
// @route   GET /api/payments/requests
// @access  Private/Teacher
const getPaymentRequests = async (req, res) => {
    const { history } = req.query;
    let query = { teacher: req.user._id };
    query.status = history === 'true' ? { $in: ['approved', 'denied'] } : 'pending';

    const requests = await Payment.find(query)
        .populate('student', 'name')
        .sort({ createdAt: -1 });
    res.status(200).json(requests);
};

// @desc    Teacher updates a payment request
// @route   PUT /api/payments/request/:id
// @access  Private/Teacher
const updatePaymentRequest = async (req, res) => {
    const { status } = req.body;
    const request = await Payment.findById(req.params.id);

    if (!request || request.teacher.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized.' });
    }
    request.status = status;
    await request.save();
    res.status(200).json(request);
};

export { createPaymentRequest, getAllStudentPayments, getMyPaymentHistory, getPaymentRequests, updatePaymentRequest };