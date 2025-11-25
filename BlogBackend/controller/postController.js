import Post from '../model/postModel.js';

// Get all posts (public - only published ones)
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({ published: true })
            .populate('author', 'name username')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: posts,
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Get single post by ID
export const getPost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).populate(
            'author',
            'name username'
        );

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        // Check if post is published or user is the author
        if (!post.published && post.author._id.toString() !== req.user_id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
            });
        }

        const currentUserId = req.user_id ? req.user_id.toString() : null;

        const isLiked = post.likes.some(
            (userId) => userId.toString() === currentUserId
        );

        res.status(200).json({
            success: true,
            data: {
                ...post.toObject(), // Convert mongoose doc to plain object
                isLiked, // <--- SEND THIS BOOLEAN
                likeCount: post.likes.length, // Ensure count is accurate
            },
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
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

// Helper function to extract intro from content (first 2 sentences)
const extractIntro = (content) => {
    if (!content) return '';
    const sentenceRegex = /[^.!?]+[.!?]+/g;
    const matches = content.match(sentenceRegex);
    if (!matches || matches.length === 0) {
        // Fallback: take first 100 characters
        return (
            content.substring(0, 100).trim() +
            (content.length > 100 ? '...' : '')
        );
    }
    // Take first 2 sentences
    const intro = matches.slice(0, 2).join(' ').trim();
    return intro;
};

// Create new post
export const createPost = async (req, res) => {
    try {
        const { title, content, tags, published, alt, ...rest } = req.body; // estimatedReadTime is ignored

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title and content are required',
            });
        }

        const estimatedReadTime = calculateReadTime(content);
        const intro = extractIntro(content);

        const newPost = new Post({
            title,
            content,
            author: req.user_id,
            tags: tags || [],
            published: published || false,
            estimatedReadTime,
            intro,
        });

        // Handle image upload if provided
        if (req.file) {
            newPost.featuredImage = {
                url: req.file.path,
                publicId: req.file.filename,
                alt: alt || '',
            };
        }

        const savedPost = await newPost.save();

        // Populate author info
        await savedPost.populate('author', 'name username');

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: savedPost,
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Update post
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, tags, published, estimatedReadTime, ...rest } =
            req.body; // estimatedReadTime is ignored

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        // Check if user is the author
        if (post.author.toString() !== req.user_id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
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
            message: 'Post updated successfully',
            data: updatedPost,
        });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
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
                message: 'Post not found',
            });
        }

        // Check if user is the author
        if (post.author.toString() !== req.user_id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
            });
        }

        await Post.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
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
            data: posts,
        });
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
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
                message: 'Post not found',
            });
        }

        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            // Unlike the post
            await Post.findByIdAndUpdate(id, {
                $pull: { likes: userId },
                $inc: { likeCount: -1 },
            });
            res.json({
                success: true,
                message: 'Post unliked',
                liked: false,
            });
        } else {
            // Like the post
            await Post.findByIdAndUpdate(id, {
                $addToSet: { likes: userId },
                $inc: { likeCount: 1 },
            });
            res.json({
                success: true,
                message: 'Post liked',
                liked: true,
            });
        }
    } catch (error) {
        console.error('Error liking/unliking post:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Search posts by query
export const searchPosts = async (req, res) => {
    try {
        const { q } = req.query; // query parameter for search term

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required',
            });
        }

        const posts = await Post.find({
            published: true,
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { content: { $regex: q, $options: 'i' } },
                { tags: { $in: [new RegExp(q, 'i')] } },
            ],
        })
            .populate('author', 'name username')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: posts,
        });
    } catch (error) {
        console.error('Error searching posts:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Get popular posts
export const getPopularPosts = async (req, res) => {
    try {
        const posts = await Post.find({ published: true })
            .populate('author', 'name username')
            .sort({ likeCount: -1, createdAt: -1 }) // Sort by likes descending, then by date
            .limit(10); // Limit to top 10 popular posts

        res.status(200).json({
            success: true,
            data: posts,
        });
    } catch (error) {
        console.error('Error fetching popular posts:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Get related posts based on tags
export const getRelatedPosts = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the current post to get its tags
        const currentPost = await Post.findById(id);
        if (!currentPost) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        const tags = currentPost.tags || [];

        // Find related posts: published, not the current post, have at least one common tag
        const relatedPosts = await Post.find({
            published: true,
            _id: { $ne: id },
            tags: { $in: tags },
        })
            .populate('author', 'name username')
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            data: relatedPosts,
        });
    } catch (error) {
        console.error('Error fetching related posts:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
