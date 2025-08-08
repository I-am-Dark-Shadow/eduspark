import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    score: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    answers: [{ questionId: Number, selectedOption: Number, isCorrect: Boolean }],
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    isRetake: { type: Boolean, default: false },
    submitted: { type: Boolean, default: false },
}, { timestamps: true });

// Ensure a student can only take a specific exam once unless it's a retake
resultSchema.index({ student: 1, exam: 1, isRetake: 1 }, { unique: true });

const Result = mongoose.model('Result', resultSchema);
export default Result;