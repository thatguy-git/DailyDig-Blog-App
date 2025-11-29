import express from 'express';
import {
    createComment,
    getComments,
    updateComment,
    deleteComment,
    likeComment,
} from '../controller/commentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for a specific post's comments
router.route('/:postId').post(authMiddleware, createComment).get(getComments);

// Routes for a specific comment
router
    .route('/:commentId')
    .put(authMiddleware, updateComment)
    .delete(authMiddleware, deleteComment);

router.route('/:commentId/like').put(authMiddleware, likeComment);

export default router;
