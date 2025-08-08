const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Check for Mongoose bad ObjectId
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }
    
    // THIS IS THE NEW, IMPROVED PART
    // Check for Mongoose duplicate key error
    if (err.code === 11000) {
        statusCode = 400; // Bad Request
        const field = Object.keys(err.keyValue)[0];
        if (field === 'email') {
            message = 'This email address is already in use. Please choose another.';
        } else {
            message = `Duplicate field value entered for: ${field}. Please use another value.`;
        }
    }

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export { notFound, errorHandler };