import Result from '../models/resultModel.js';
import Exam from '../models/examModel.js';
import RetakeRequest from '../models/retakeRequestModel.js';
import ViewRequest from '../models/viewRequestModel.js';

// @desc    Start or continue an exam, create/find a result entry
// @route   POST /api/results/start-exam
// @access  Private/Student
const startExam = async (req, res) => {
    const { examId, isRetake } = req.body;
    const studentId = req.user._id;

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    
    // --- NEW RETAKE LOGIC ---
    if (isRetake) {
        // First, check if the retake was actually approved
        const approvedRequest = await RetakeRequest.findOne({ student: studentId, exam: examId, status: 'approved' });
        if (!approvedRequest) {
            return res.status(403).json({ message: 'Retake for this exam has not been approved.' });
        }
        
        // Delete the student's previous result for this exam to allow a fresh start
        await Result.deleteOne({ student: studentId, exam: examId });

        // Now, proceed to create a new result document marked as a retake
    } else {
        // --- ORIGINAL LOGIC for first-time attempts ---
        const existingResult = await Result.findOne({ student: studentId, exam: examId });

        if (existingResult && !existingResult.submitted) {
            return res.status(200).json(existingResult); // Let user continue unfinished exam
        }
        if (existingResult && existingResult.submitted) {
            return res.status(400).json({ message: 'You have already completed this exam.' }); // Block if completed
        }
    }

    // This code now runs for both a fresh attempt AND an approved retake
    const result = new Result({
        student: studentId,
        exam: examId,
        startTime: new Date(),
        isRetake: isRetake || false,
        score: 0,
        totalMarks: exam.questions.length,
        submitted: false,
    });
    
    const createdResult = await result.save();
    res.status(201).json(createdResult);
};

// @desc    Submit exam answers
// @route   POST /api/results/submit
// @access  Private/Student
const submitExam = async (req, res) => {
    const { resultId, answers } = req.body;

    const result = await Result.findById(resultId).populate('exam');
    if (!result) return res.status(404).json({ message: 'Result entry not found.' });
    if (result.student.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized.' });
    }
    if (result.submitted) return res.status(400).json({ message: 'Exam already submitted.' });

    let score = 0;
    const answeredDetails = result.exam.questions.map(q => {
        const userAnswer = answers.find(a => a.questionId === q.id);
        const isCorrect = userAnswer ? userAnswer.selectedOption === q.correct : false;
        if (isCorrect) score++;
        return { questionId: q.id, selectedOption: userAnswer ? userAnswer.selectedOption : null, isCorrect };
    });

    result.score = score;
    result.answers = answeredDetails;
    result.submitted = true;
    result.endTime = new Date();

    const savedResult = await result.save();
    
    // If this was a retake, we now delete the approved request since it has been used
    if(result.isRetake) {
        await RetakeRequest.deleteOne({ student: result.student, exam: result.exam, status: 'approved' });
    }

    res.status(200).json(savedResult);
};

// @desc    Get results for the logged-in student
// @route   GET /api/results/my-results
// @access  Private/Student
const getMyResults = async (req, res) => {
    const results = await Result.find({ student: req.user._id }).populate('exam', 'title');
    res.status(200).json(results);
};

// @desc    Get results for a specific student (for teachers)
// @route   GET /api/results/student/:studentId
// @access  Private/Teacher
const getStudentResults = async (req, res) => {
    const results = await Result.find({ student: req.params.studentId }).populate('exam', 'title');
    res.status(200).json(results);
};

// @desc    Get a single result detail
// @route   GET /api/results/:id
// @access  Private
const getResultById = async (req, res) => {
    const result = await Result.findById(req.params.id).populate({
        path: 'exam',
        select: 'title questions createdBy',
        populate: { path: 'createdBy', select: 'name' }
    }).populate('student', 'name email');
    
    if(!result) return res.status(404).json({ message: 'Result not found.'});

    const isOwner = result.student._id.toString() === req.user._id.toString();
    const isTeacher = result.exam.createdBy.toString() === req.user._id.toString();

    if (isTeacher) { // A teacher can always view details
        return res.status(200).json(result);
    }
    
    if (isOwner) { // If a student owns it, check for view permission
        const viewRequest = await ViewRequest.findOne({ student: req.user._id, result: result._id, status: 'approved' });
        if (viewRequest) {
            return res.status(200).json(result); // Permission granted
        } else {
            // Permission not granted, return only the summary
            return res.status(200).json({
                score: result.score,
                totalMarks: result.totalMarks,
                exam: { title: result.exam.title },
                permissionDenied: true // Flag for the frontend
            });
        }
    }
    
    return res.status(401).json({ message: 'Not authorized to view this result.'});
};


export { startExam, submitExam, getMyResults, getStudentResults, getResultById };