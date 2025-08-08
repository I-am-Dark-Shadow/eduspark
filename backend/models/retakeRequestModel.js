import mongoose from 'mongoose';

const retakeRequestSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
}, { timestamps: true });

const RetakeRequest = mongoose.model('RetakeRequest', retakeRequestSchema);
export default RetakeRequest;