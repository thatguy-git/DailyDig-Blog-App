import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { uploadPostImage } from '../middleware/uploadMiddleware.js';
import {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    getUserPosts,
    getUserPostsById,
    likePost,
    searchPosts,
    getPopularPosts,
    getRelatedPosts,
    getFeaturedPosts,
    getEditorPicksPosts,
    getHighlightsPosts,
    getRecentPosts,
    sharePost,
} from '../controller/postController.js';
import { handleUploadErrors } from '../middleware/errorMiddleware.js';

export const router = express.Router();

// Public routes
router.get('/', getAllPosts);
router.get('/search', searchPosts);
router.get('/popular', getPopularPosts);
router.get('/related/:id', getRelatedPosts);
router.get('/featured', getFeaturedPosts);
router.get('/editor-picks', getEditorPicksPosts);
router.get('/highlights', getHighlightsPosts);
router.get('/recent', getRecentPosts);
router.get('/:id', getPostById);
router.post('/:id/share', sharePost);

// Protected routes
router.post(
    '/',
    authMiddleware,
    uploadPostImage.single('coverImage'),
    handleUploadErrors,
    createPost
);
router.put('/:id', authMiddleware, uploadPostImage.single('coverImage'), handleUploadErrors, updatePost);
router.delete('/:id', authMiddleware, deletePost);
router.get('/user/:userId/posts', getUserPostsById);
router.get('/user/posts', authMiddleware, getUserPosts);
router.post('/:id/like', authMiddleware, likePost);
