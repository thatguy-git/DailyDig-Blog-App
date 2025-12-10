import User from '../model/userModel.js';
import Post from '../model/postModel.js';
import Comment from '../model/commentModel.js';
import cloudinary from '../config/cloudinary.js';

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user_id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { name, username, bio } = req.body;
        const user = await User.findById(req.user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username && username !== user.username) {
            const userExists = await User.findOne({ username });
            if (userExists)
                return res.status(400).json({
                    message: 'Username taken',
                });
        }

        if (name) user.name = name;
        if (username) user.username = username;
        if (bio) user.bio = bio;

        if (req.file) {
            // Delete old profile image from Cloudinary if exists
            if (user.profileImage && user.profileImage.publicId) {
                try {
                    await cloudinary.uploader.destroy(
                        user.profileImage.publicId
                    );
                } catch (cloudinaryError) {
                    console.error(
                        'Error deleting old profile image:',
                        cloudinaryError
                    );
                }
            }
            // Update with new profile image info
            user.profileImage = {
                url: req.file.path,
                publicId: req.file.filename,
            };
        }

        await user.save();
        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(200).json({
            message: 'Profile updated successfully',
            user: userResponse,
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user_id;

        // Find the user first to get their data
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete user's profile image from Cloudinary if exists
        if (user.profileImage && user.profileImage.publicId) {
            try {
                await cloudinary.uploader.destroy(user.profileImage.publicId);
            } catch (cloudinaryError) {
                console.error(
                    'Error deleting profile image from Cloudinary:',
                    cloudinaryError
                );
                // Continue with deletion even if image deletion fails
            }
        }

        // Find all posts by the user
        const userPosts = await Post.find({ author: userId });

        // Delete featured images from Cloudinary for each post
        for (const post of userPosts) {
            if (post.featuredImage && post.featuredImage.publicId) {
                try {
                    await cloudinary.uploader.destroy(
                        post.featuredImage.publicId
                    );
                } catch (cloudinaryError) {
                    console.error(
                        'Error deleting post image from Cloudinary:',
                        cloudinaryError
                    );
                }
            }
        }

        // Delete all posts by the user
        await Post.deleteMany({ author: userId });

        // Delete all comments made by the user
        await Comment.deleteMany({ author: userId });

        // Delete all comments on the user's posts (to avoid orphaned comments)
        await Comment.deleteMany({
            post: { $in: userPosts.map((post) => post._id) },
        });

        // Remove user ID from likes arrays in all posts
        await Post.updateMany(
            { likes: userId },
            { $pull: { likes: userId }, $inc: { likeCount: -1 } }
        );

        // Remove user ID from likes arrays in all comments
        await Comment.updateMany(
            { likes: userId },
            { $pull: { likes: userId }, $inc: { likeCount: -1 } }
        );

        // Finally, delete the user
        await User.findByIdAndDelete(userId);

        res.status(200).json({
            message:
                'User account and all associated data deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting user account:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;

        // 1. Validation
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required.',
            });
        }

        // 2. Search
        const users = await User.find(
            {
                // This uses the index you just created on name/username/email
                $text: { $search: q },
            },
            {
                // PROJECTION: This creates a temporary field 'score'
                // representing how well the user matched the query.
                score: { $meta: 'textScore' },
            }
        )
            // 3. Sort by Relevance (Best match first)
            .sort({ score: { $meta: 'textScore' } })

            // 4. SECURITY: Only select public fields!
            // Never return password or sensitive data in a search result.
            .select('name username email role');

        res.status(200).json({
            success: true,
            //count: users.length,
            data: users,
        });
    } catch (error) {
        console.error('User Search Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
