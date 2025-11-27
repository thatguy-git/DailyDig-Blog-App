import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    createComment,
    getComments,
    updateComment,
    deleteComment,
    likeComment
} from "../controller/commentController.js";

const router = express.Router();

// Comment routes
router.post("/:postId", authMiddleware, createComment);
router.get("/:postId", getComments);
router.put("/:commentId", authMiddleware, updateComment);
router.delete("/:commentId", authMiddleware, deleteComment);
router.post("/:commentId/like", authMiddleware, likeComment);

export default router;
