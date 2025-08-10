import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    duration: { type: String, required: true }, // e.g., "5h 30m"
    thumbnail: { type: String, required: true }, // URL from Cloudinary
    videoUrl: { type: String, required: true }, // YouTube video link
    status: { type: String, enum: ['available', 'coming-soon'], default: 'available' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
export default Course;