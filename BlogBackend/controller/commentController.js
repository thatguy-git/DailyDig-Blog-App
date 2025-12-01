import Comment from '../model/commentModel.js';
import Post from '../model/postModel.js';

// Create a new comment on a post
export const createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { postId } = req.params;
        const userId = req.user_id;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Comment content is required',
            });
        }

        // Verify post exists and is published
        const post = await Post.findById(postId);
        if (!post || !post.published) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        const comment = new Comment({
            content: content.trim(),
            author: userId,
            post: postId,
        });

        const savedComment = await comment.save();
        await savedComment.populate(
            'author',
            '_id name username profileImage'
        );

        res.status(201).json({
            success: true,
            message: 'Comment created successfully',
            data: savedComment,
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Get all comments for a post (with pagination)
export const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Verify post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        const comments = await Comment.find({
            post: postId,
            isDeleted: false,
        })
            .populate('author', '_id name username profileImage')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalComments = await Comment.countDocuments({
            post: postId,
            isDeleted: false,
        });

        res.status(200).json({
            success: true,
            data: comments,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalComments / limit),
                totalComments,
                hasNextPage: page * limit < totalComments,
                hasPrevPage: page > 1,
            },
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Update a comment //not functional yet
export const updateComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { commentId } = req.params;
        const userId = req.user_id;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Comment content is required',
            });
        }

        const comment = await Comment.findById(commentId);

        if (!comment || comment.isDeleted) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found',
            });
        }

        // Check if user is the author
        if (comment.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
            });
        }

        comment.content = content.trim();
        const updatedComment = await comment.save();
        await updatedComment.populate('author', '_id name username profileImage');

        res.status(200).json({
            success: true,
            message: 'Comment updated successfully',
            data: updatedComment,
        });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Delete a comment (soft delete)
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user_id;

        const comment = await Comment.findById(commentId);

        if (!comment || comment.isDeleted) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found',
            });
        }

        // Check if user is the author or post author
        const post = await Post.findById(comment.post);
        const isAuthor = comment.author.toString() === userId;
        const isPostAuthor = post && post.author.toString() === userId;

        if (!isAuthor && !isPostAuthor) {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
            });
        }

        comment.isDeleted = true;
        await comment.save();

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Like or unlike a comment
export const likeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user_id;

        const comment = await Comment.findById(commentId);
        if (!comment || comment.isDeleted) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found',
            });
        }

        const isLiked = comment.likes.includes(userId);

        if (isLiked) {
            // Unlike the comment
            comment.likes.pull(userId);
            comment.likeCount -= 1;
            await comment.save();
            res.json({
                success: true,
                message: 'Comment unliked',
                liked: false,
                likeCount: comment.likeCount,
            });
        } else {
            // Like the comment
            comment.likes.addToSet(userId);
            comment.likeCount += 1;
            await comment.save();
            res.json({
                success: true,
                message: 'Comment liked',
                liked: true,
                likeCount: comment.likeCount,
            });
        }
    } catch (error) {
        console.error('Error liking/unliking comment:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
