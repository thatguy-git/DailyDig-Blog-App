import Post from '../model/postModel.js';
import User from '../model/userModel.js';
import { v2 as cloudinary } from 'cloudinary';
import { extractIntro } from '../utils/postUtils.js';

// Create a new post
export const createPost = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const authorId = req.user_id;

        if (!title || !content) {
            return res
                .status(400)
                .json({ message: 'Title and content are required.' });
        }

        let featuredImage = {};
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'blog-app/post-images',
                public_id: `post-${authorId}-${Date.now()}`,
            });
            featuredImage = {
                url: result.secure_url,
                publicId: result.public_id,
            };
        }

        const post = new Post({
            title,
            content,
            author: authorId,
            tags: tags ? JSON.parse(tags) : [],
            featuredImage,
            published: true, // Or based on a request body field
        });

        const savedPost = await post.save();
        // Populate the author details before sending the response
        const populatedPost = await Post.findById(savedPost._id).populate(
            'author',
            'name username profileImage'
        );

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: populatedPost,
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get featured posts (latest 4)
export const getFeaturedPosts = async (req, res) => {
    try {
        const featuredPosts = await Post.find({ published: true })
            .sort({ createdAt: -1 })
            .limit(4)
            .populate('author', 'name');

        const postsWithIntro = featuredPosts.map((post) => {
            const postObject = post.toObject();
            postObject.intro = extractIntro(post.content);
            return postObject;
        });

        res.status(200).json({ success: true, data: postsWithIntro });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get posts marked as editor picks
export const getEditorPicksPosts = async (req, res) => {
    try {
        const editorPicksPosts = await Post.find({
            published: true,
            isEditorPick: true,
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('author', 'name');

        const postsWithIntro = editorPicksPosts.map((post) => {
            const postObject = post.toObject();
            postObject.intro = extractIntro(post.content);
            return postObject;
        });

        res.status(200).json({ success: true, data: postsWithIntro });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get posts with the most comments (highlights)
export const getHighlightsPosts = async (req, res) => {
    try {
        const highlightsPosts = await Post.find({ published: true })
            .sort({ 'comments.length': -1 })
            .limit(9)
            .populate('author', 'name');
        res.status(200).json({ success: true, data: highlightsPosts });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get recent posts (latest 10)
export const getRecentPosts = async (req, res) => {
    try {
        const recentPosts = await Post.find({ published: true })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('author', 'name');
        res.status(200).json({ success: true, data: recentPosts });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a single post by ID
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate(
            'author',
            'name username profileImage'
        );

        if (!post || !post.published) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const postObject = post.toObject();
        postObject.intro = extractIntro(post.content);

        // Check if the current user (if any) has liked the post
        if (req.user_id) {
            postObject.isLiked = post.likes.includes(req.user_id);
        } else {
            postObject.isLiked = false;
        }

        res.status(200).json({
            success: true,
            data: postObject,
        });
    } catch (error) {
        console.error('Error fetching post by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all posts (with optional search)
export const getAllPosts = async (req, res) => {
    try {
        const { q } = req.query;
        let query = { published: true };

        if (q) {
            query.title = { $regex: q, $options: 'i' };
        }

        const posts = await Post.find(query)
            .populate('author', 'name username profileImage')
            .sort({ createdAt: -1 });

        const postsWithIntro = posts.map((post) => {
            const postObject = post.toObject();
            postObject.intro = extractIntro(post.content);
            return postObject;
        });

        res.status(200).json({
            success: true,
            data: postsWithIntro,
        });
    } catch (error) {
        console.error('Error fetching all posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get posts by a specific user
export const getUserPosts = async (req, res) => {
    try {
        const userId = req.user_id;
        const posts = await Post.find({ author: userId })
            .populate('author', 'name username')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: posts,
        });
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Search posts
export const searchPosts = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res
                .status(400)
                .json({ message: 'Search query "q" is required.' });
        }

        const posts = await Post.find({
            published: true,
            $text: { $search: q },
        })
            .populate('author', 'name username')
            .sort({ score: { $meta: 'textScore' } });

        res.status(200).json({
            success: true,
            data: posts,
        });
    } catch (error) {
        console.log('Error searching posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get popular posts (sorted by likes)
export const getPopularPosts = async (req, res) => {
    try {
        const popularPosts = await Post.find({ published: true })
            .sort({ likeCount: -1 })
            .limit(20) // Get top 5 popular posts
            .populate('author', 'name');
        res.status(200).json({ success: true, data: popularPosts });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get related posts
export const getRelatedPosts = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const relatedPosts = await Post.find({
            tags: { $in: post.tags },
            _id: { $ne: post._id },
            published: true,
        })
            .populate('author', 'name')
            .limit(4)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: relatedPosts,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Like/Unlike a post
export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const userId = req.user_id;
        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            // Unlike
            post.likes.pull(userId);
            post.likeCount = post.likes.length;
            await post.save();
            res.status(200).json({
                success: true,
                message: 'Post unliked',
                liked: false,
                likeCount: post.likeCount,
            });
        } else {
            // Like
            post.likes.addToSet(userId);
            post.likeCount = post.likes.length;
            await post.save();
            res.status(200).json({
                success: true,
                message: 'Post liked',
                liked: true,
                likeCount: post.likeCount,
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a post
export const updatePost = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Authorization check
        if (post.author.toString() !== req.user_id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.tags = tags ? JSON.parse(tags) : post.tags;

        if (req.file) {
            // Delete old image from Cloudinary if it exists
            if (post.featuredImage && post.featuredImage.publicId) {
                await cloudinary.uploader.destroy(post.featuredImage.publicId);
            }
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'blog-app/post-images',
            });
            post.featuredImage = {
                url: result.secure_url,
                publicId: result.public_id,
            };
        }

        const updatedPost = await post.save();
        res.status(200).json({
            success: true,
            message: 'Post updated successfully',
            data: updatedPost,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Authorization check
        if (post.author.toString() !== req.user_id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Delete image from Cloudinary
        if (post.featuredImage && post.featuredImage.publicId) {
            await cloudinary.uploader.destroy(post.featuredImage.publicId);
        }

        await post.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
