import Course from '../models/courseModel.js';

// @desc    Teacher creates a new course
// @route   POST /api/courses
// @access  Private/Teacher
const createCourse = async (req, res) => {
    const { title, duration, thumbnail, videoUrl, status } = req.body;
    const course = new Course({
        title,
        duration,
        thumbnail,
        videoUrl,
        status,
        createdBy: req.user._id,
    });
    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
};

// @desc    Get all courses with search and pagination
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    const pageSize = 8; // 8 courses per page
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword ? {
        title: {
            $regex: req.query.keyword,
            $options: 'i' // case-insensitive search
        }
    } : {};

    const count = await Course.countDocuments({ ...keyword });
    const courses = await Course.find({ ...keyword })
        .sort({ createdAt: -1 }) // Show newest first
        .limit(pageSize)
        .skip(pageSize * (page - 1));
    
    res.json({ courses, page, pages: Math.ceil(count / pageSize) });
};

export { createCourse, getCourses };