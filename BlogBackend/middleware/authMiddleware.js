import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user_id = decoded.id;
        req.user_role = decoded.role; // Add role to request
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export const adminMiddleware = (req, res, next) => {
    if (req.user_role !== 'admin') {
        return res
            .status(403)
            .json({ message: 'Access denied. Admin role required.' });
    }
    next();
};

export default authMiddleware;
