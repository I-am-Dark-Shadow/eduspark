import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correct: { type: Number, required: true },
});

const examSchema = new mongoose.Schema({
    title: { type: String, required: true },
    duration: { type: Number, required: true }, // Duration in minutes
    questions: [questionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true });

const Exam = mongoose.model('Exam', examSchema);
export default Exam;