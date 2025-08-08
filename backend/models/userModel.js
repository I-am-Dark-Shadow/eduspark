import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['student', 'teacher'] },
    // This is the line that has been updated with your new URL
    profilePicture: { type: String, default: 'https://res.cloudinary.com/dsaokpnjp/image/upload/v1754650045/user_icon_uugtcj.png' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // For students, references the teacher
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;