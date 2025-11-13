import express from 'express';
import {
    createUser,
    loginUser,
    verifyOTP,
    sendOTP,
    resetPassword,
    sendEmailVerificationOTP,
    verifyEmailOTP,
} from '../controller/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const router = express.Router();
router.post('/signup', createUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.post('/send-otp', sendOTP);
router.post('/reset-password', authMiddleware, resetPassword);
router.post('/send-email-verification-otp', sendEmailVerificationOTP);
router.post('/verify-email-otp', verifyEmailOTP);
