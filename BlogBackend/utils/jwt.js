import jsonwebtoken from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const jwt = jsonwebtoken;

const JWT_SECRET = process.env.JWT_SECRET;




// Generate JWT Token
export function generateToken (userId) {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured. Check your .env file');
    }
    const payload = {
        id: userId,
    };
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "30d"
    });
};



//generate temporary token for password reset or email verification
export function generateTempToken(userId) {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured. Check your .env file');
    }
    const payload = {
        id: userId,
    };
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "10m"
    });
};