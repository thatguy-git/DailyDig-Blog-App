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
    likePost,
    searchPosts,
    getPopularPosts,
    getRelatedPosts,
    getFeaturedPosts,
    getEditorPicksPosts,
    getHighlightsPosts,
    getRecentPosts,
} from '../controller/postController.js';

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

// Protected routes
router.post(
    '/',
    authMiddleware,
    uploadPostImage.single('coverImage'),
    createPost
);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);
router.get('/user/posts', authMiddleware, getUserPosts);
router.post('/:id/like', authMiddleware, likePost);
