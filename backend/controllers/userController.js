import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id, user.role);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = (req, res) => {
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Register a new student
// @route   POST /api/users/register-student
// @access  Private/Teacher
const registerStudent = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        role: 'student',
        createdBy: req.user._id,
    });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email });
};

// @desc    Get current user's profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
    });
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.profilePicture = req.body.profilePicture || user.profilePicture;
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profilePicture: updatedUser.profilePicture
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all students for a teacher
// @route   GET /api/users/students
// @access  Private/Teacher
const getMyStudents = async (req, res) => {
    const students = await User.find({ role: 'student', createdBy: req.user._id }).select('-password');
    res.status(200).json(students);
};

// @desc    Get a single student's details
// @route   GET /api/users/students/:id
// @access  Private/Teacher
const getStudentById = async (req, res) => {
    const student = await User.findOne({ _id: req.params.id, role: 'student', createdBy: req.user._id }).select('-password');
    if (student) {
        res.status(200).json(student);
    } else {
        res.status(404).json({ message: 'Student not found' });
    }
};


export {
    loginUser,
    logoutUser,
    registerStudent,
    getUserProfile,
    updateUserProfile,
    getMyStudents,
    getStudentById
};