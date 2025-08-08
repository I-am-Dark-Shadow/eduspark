import mongoose from 'mongoose';

const viewRequestSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    result: { type: mongoose.Schema.Types.ObjectId, ref: 'Result', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
}, { timestamps: true });

// Ensure a student can only request access once per result
viewRequestSchema.index({ student: 1, result: 1 }, { unique: true });

const ViewRequest = mongoose.model('ViewRequest', viewRequestSchema);
export default ViewRequest;