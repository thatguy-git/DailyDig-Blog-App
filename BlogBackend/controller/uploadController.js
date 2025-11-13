import User from '../model/userModel.js';
import Post from '../model/postModel.js';
import cloudinary from '../config/cloudinary.js';

// Upload profile image
export const uploadProfileImage = async (req, res) => {
    try {
        const userId = req.user_id;

        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete old profile image from Cloudinary if exists
        if (user.profileImage?.publicId) {
            try {
                await cloudinary.uploader.destroy(user.profileImage.publicId);
            } catch (error) {
                console.error('Error deleting old profile image:', error);
                // Continue with upload even if old image deletion fails
            }
        }

        // Update user with new image info
        user.profileImage = {
            url: req.file.path,
            publicId: req.file.filename,
        };

        await user.save();

        res.status(200).json({
            message: 'Profile image uploaded successfully',
            image: {
                url: req.file.path,
                publicId: req.file.filename,
            },
        });
    } catch (error) {
        console.error('Profile image upload error:', error);
        res.status(500).json({ message: 'Failed to upload profile image' });
    }
};

// Upload post featured image
export const uploadPostImage = async (req, res) => {
    try {
        const userId = req.user_id;
        const { postId, alt } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user is the author
        if (post.author.toString() !== userId) {
            return res
                .status(403)
                .json({
                    message: 'You can only upload images for your own posts',
                });
        }

        // Delete old featured image from Cloudinary if exists
        if (post.featuredImage?.publicId) {
            try {
                await cloudinary.uploader.destroy(post.featuredImage.publicId);
            } catch (error) {
                console.error('Error deleting old post image:', error);
                // Continue with upload even if old image deletion fails
            }
        }

        // Update post with new image info
        post.featuredImage = {
            url: req.file.path,
            publicId: req.file.filename,
            alt: alt || '',
        };

        await post.save();

        res.status(200).json({
            message: 'Post image uploaded successfully',
            image: {
                url: req.file.path,
                publicId: req.file.filename,
                alt: post.featuredImage.alt,
            },
        });
    } catch (error) {
        console.error('Post image upload error:', error);
        res.status(500).json({ message: 'Failed to upload post image' });
    }
};

// Delete profile image
export const deleteProfileImage = async (req, res) => {
    try {
        const userId = req.user_id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.profileImage?.publicId) {
            return res
                .status(400)
                .json({ message: 'No profile image to delete' });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(user.profileImage.publicId);

        // Remove from user document
        user.profileImage = undefined;
        await user.save();

        res.status(200).json({ message: 'Profile image deleted successfully' });
    } catch (error) {
        console.error('Profile image deletion error:', error);
        res.status(500).json({ message: 'Failed to delete profile image' });
    }
};

// Delete post image
export const deletePostImage = async (req, res) => {
    try {
        const userId = req.user_id;
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user is the author
        if (post.author.toString() !== userId) {
            return res
                .status(403)
                .json({
                    message: 'You can only delete images from your own posts',
                });
        }

        if (!post.featuredImage?.publicId) {
            return res
                .status(400)
                .json({ message: 'No featured image to delete' });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(post.featuredImage.publicId);

        // Remove from post document
        post.featuredImage = undefined;
        await post.save();

        res.status(200).json({ message: 'Post image deleted successfully' });
    } catch (error) {
        console.error('Post image deletion error:', error);
        res.status(500).json({ message: 'Failed to delete post image' });
    }
};
