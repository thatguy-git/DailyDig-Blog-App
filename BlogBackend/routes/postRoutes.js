import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    getUserPosts,
    likePost
} from "../controller/postController.js";

export const router = express.Router();

// Public routes
router.get("/", getPosts);
router.get("/:id", getPost);

// Protected routes
router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);
router.get("/user/posts", authMiddleware, getUserPosts);
router.post("/:id/like", authMiddleware, likePost);
