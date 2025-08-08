import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: Number, required: true }, // 1 for January, 2 for February, etc.
    year: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
    paymentMethod: { type: String, enum: ['hand-cash', 'online'], required: true },
    billScreenshot: { type: String }, // URL from Cloudinary
}, { timestamps: true });

// A student can only have one payment status per month
paymentSchema.index({ student: 1, month: 1, year: 1 }, { unique: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;