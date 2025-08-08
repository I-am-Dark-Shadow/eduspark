import jwt from 'jsonwebtoken';

const generateToken = (res, userId, role) => {
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    // Set JWT as an HTTP-Only cookie
    res.cookie('jwt', token, {
        sameSite: 'none',
        secure: true,
    });

    return token;
};

export default generateToken;