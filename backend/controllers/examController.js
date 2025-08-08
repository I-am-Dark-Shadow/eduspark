import Exam from '../models/examModel.js';

// @desc    Create a new exam
// @route   POST /api/exams
// @access  Private/Teacher
const createExam = async (req, res) => {
    const { title, duration, questions } = req.body;
    
    if (!title || !duration || !questions || questions.length === 0) {
        res.status(400);
        // Use a more specific error message
        throw new Error('Please provide a title, duration, and a valid list of questions.');
    }

    const exam = new Exam({
        title,
        duration,
        questions,
        createdBy: req.user._id, // This comes from the 'protect' middleware
    });

    const createdExam = await exam.save();
    res.status(201).json(createdExam);
};

// @desc    Get all exams (for students or teachers)
// @route   GET /api/exams
// @access  Private
const getAllExams = async (req, res) => {
    const query = req.user.role === 'teacher' ? { createdBy: req.user._id } : {};
    const exams = await Exam.find(query).populate('createdBy', 'name');
    res.status(200).json(exams);
};

// @desc    Get a single exam by ID
// @route   GET /api/exams/:id
// @access  Private
const getExamById = async (req, res) => {
    const exam = await Exam.findById(req.params.id);
    if (exam) {
        res.status(200).json(exam);
    } else {
        res.status(404).json({ message: 'Exam not found' });
    }
};

export { createExam, getAllExams, getExamById };