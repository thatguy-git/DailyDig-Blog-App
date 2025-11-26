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
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/signup', createUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.post('/send-otp', sendOTP);
router.post('/reset-password', authMiddleware, resetPassword);
router.post('/send-email-verification-otp', sendEmailVerificationOTP);
router.post('/verify-email-otp', verifyEmailOTP);

// Google OAuth
router.get(
    '/google',
    (req, res, next) => {
        console.log('🔥 /api/auth/google hit, session id:', req.sessionID);
        next();
    },
    passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/login',
    }),
    (req, res) => {
        const token = jwt.sign(
            { userId: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.redirect(`${process.env.FRONTEND_URL}/callback?token=${token}`);
    }
);

// // Facebook OAuth
// router.get(
//     '/facebook',
//     passport.authenticate('facebook', { scope: ['email'] })
// );
// router.get(
//     '/facebook/callback',
//     passport.authenticate('facebook', { failureRedirect: '/login' }),
//     (req, res) => {
//         const token = jwt.sign(
//             { userId: req.user._id },
//             process.env.JWT_SECRET,
//             { expiresIn: '7d' }
//         );
//         res.redirect(`${process.env.FRONTEND_URL}/callback?token=${token}`);
//     }
// );

// // Twitter OAuth
// router.get('/twitter', passport.authenticate('twitter'));
// router.get(
//     '/twitter/callback',
//     passport.authenticate('twitter', { failureRedirect: '/login' }),
//     (req, res) => {
//         const token = jwt.sign(
//             { userId: req.user._id },
//             process.env.JWT_SECRET,
//             { expiresIn: '7d' }
//         );
//         res.redirect(`${process.env.FRONTEND_URL}/callback?token=${token}`);
//     }
// );

export default router;
