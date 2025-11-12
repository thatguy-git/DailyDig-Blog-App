import Post from "../model/postModel.js";


// Get all posts (public - only published ones)
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({ published: true })
            .populate('author', 'name username')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get single post by ID
export const getPost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id)
            .populate('author', 'name username');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check if post is published or user is the author
        if (!post.published && post.author._id.toString() !== req.user_id) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Helper function to calculate estimated read time
const calculateReadTime = (content) => {
    const wordsPerMinute = 100; // Average reading speed
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return Math.max(1, minutes); // Minimum 1 minute
};

// Create new post
export const createPost = async (req, res) => {
    try {
        const { title, content, tags, published, ...rest } = req.body; // estimatedReadTime is ignored

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        const estimatedReadTime = calculateReadTime(content);

        const newPost = new Post({
            title,
            content,
            author: req.user_id,
            tags: tags || [],
            published: published || false,
            estimatedReadTime
        });

        const savedPost = await newPost.save();

        // Populate author info
        await savedPost.populate('author', 'name username');

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: savedPost
        });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Update post
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, tags, published, estimatedReadTime, ...rest } = req.body; // estimatedReadTime is ignored

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check if user is the author
        if (post.author.toString() !== req.user_id) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        // Update fields
        if (title !== undefined) post.title = title;
        if (content !== undefined) {
            post.content = content;
            post.estimatedReadTime = calculateReadTime(content);
        }
        if (tags !== undefined) post.tags = tags;
        if (published !== undefined) post.published = published;

        const updatedPost = await post.save();
        await updatedPost.populate('author', 'name username');

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: updatedPost
        });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Delete post
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check if user is the author
        if (post.author.toString() !== req.user_id) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        await Post.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get user's own posts (including drafts)
export const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.user_id })
            .populate('author', 'name username')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Like or unlike a post
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user_id;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            // Unlike the post
            await Post.findByIdAndUpdate(id, {
                $pull: { likes: userId },
                $inc: { likeCount: -1 }
            });
            res.json({
                success: true,
                message: "Post unliked",
                liked: false
            });
        } else {
            // Like the post
            await Post.findByIdAndUpdate(id, {
                $addToSet: { likes: userId },
                $inc: { likeCount: 1 }
            });
            res.json({
                success: true,
                message: "Post liked",
                liked: true
            });
        }
    } catch (error) {
        console.error("Error liking/unliking post:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
