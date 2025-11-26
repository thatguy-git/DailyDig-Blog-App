import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req, res, next) => {
    // 1. Get token
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // 2. Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // 3. DEBUG: Check what is inside the token
        // console.log("Decoded Token:", decoded);

        // 4. FIX: Handle both 'id' (standard) and 'userId' (Google Auth)
        const userId = decoded.userId || decoded.id;

        if (!userId) {
            return res
                .status(401)
                .json({ message: 'Token is valid but contains no ID' });
        }

        // 5. Attach to request
        // We attach to BOTH req.user and req.user_id to be safe and compatible with all your routes
        req.user_id = userId;
        req.user = {
            userId: userId,
            role: decoded.role,
        };
        req.user_role = decoded.role;

        next();
    } catch (error) {
        console.error('Middleware Error:', error.message);
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
