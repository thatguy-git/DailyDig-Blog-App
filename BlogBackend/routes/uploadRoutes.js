import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
    uploadProfileImage,
    uploadPostImage,
} from '../middleware/uploadMiddleware.js';
import {
    uploadProfileImage as uploadProfileImageController,
    uploadPostImage as uploadPostImageController,
    deleteProfileImage,
    deletePostImage,
} from '../controller/uploadController.js';
import { handleUploadErrors } from '../middleware/errorMiddleware.js';

const router = express.Router();

// All upload routes require authentication
router.use(authMiddleware);

// Upload profile image
router.post(
    '/profile-image',
    uploadProfileImage.single('image'),
    handleUploadErrors,
    uploadProfileImageController
);

// Upload post featured image
router.post(
    '/post-image',
    uploadPostImage.single('image'),
    handleUploadErrors,
    uploadPostImageController
);

// Delete profile image
router.delete('/profile-image', deleteProfileImage);

// Delete post image
router.delete('/post-image/:postId', deletePostImage);

export default router;
