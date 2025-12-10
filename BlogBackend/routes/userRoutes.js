import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
    searchUsers,
    getUserById,
} from '../controller/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { uploadProfileImage } from '../middleware/uploadMiddleware.js';
import { handleUploadErrors } from '../middleware/errorMiddleware.js';

const router = express.Router();

router.get('/search', searchUsers);
router.get('/profile/:userId', getUserById);
router.get('/profile', authMiddleware, getUserProfile);
router.put(
    '/profile',
    authMiddleware,
    uploadProfileImage.single('profileImage'),
    handleUploadErrors,
    updateUserProfile
);
router.delete('/delete', authMiddleware, deleteUserAccount);

export default router;
