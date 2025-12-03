import User from '../model/userModel.js';
import Contact from '../model/contactModel.js';
import Post from '../model/postModel.js';
import bcrypt from 'bcrypt';
import os from 'os';
import mongoose from 'mongoose';

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select(
            '-password -resetOTP -otpExpiration -emailVerificationOTP -emailOTPExpiration'
        );
        res.status(200).json({
            message: 'Users retrieved successfully',
            users,
            count: users.length,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get contact messages for admin dashboard
export const getContactMessages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const contacts = await Contact.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalContacts = await Contact.countDocuments();

        res.status(200).json({
            success: true,
            data: contacts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalContacts / limit),
                totalContacts,
                hasNextPage: page * limit < totalContacts,
                hasPrevPage: page > 1,
            },
        });
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Get unread contact messages count for notifications
export const getUnreadContactCount = async (req, res) => {
    try {
        const unreadCount = await Contact.countDocuments({ isRead: false });

        res.status(200).json({
            success: true,
            data: { unreadCount },
        });
    } catch (error) {
        console.error('Error fetching unread contact count:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Mark contact message as read
export const markContactAsRead = async (req, res) => {
    try {
        const { contactId } = req.params;

        const contact = await Contact.findById(contactId);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found',
            });
        }

        contact.isRead = true;
        await contact.save();

        res.status(200).json({
            success: true,
            message: 'Message marked as read',
        });
    } catch (error) {
        console.error('Error marking contact as read:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Delete contact message
export const deleteContactMessage = async (req, res) => {
    try {
        const { contactId } = req.params;

        const contact = await Contact.findByIdAndDelete(contactId);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Message deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting contact message:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Update user by admin
export const updateUserByAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, username, email, role, isVerified } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update allowed fields
        if (name !== undefined) user.name = name;
        if (username !== undefined) user.username = username;
        if (email !== undefined) user.email = email;
        if (role !== undefined && ['user', 'admin'].includes(role))
            user.role = role;
        if (isVerified !== undefined) user.isVerified = isVerified;

        await user.save();

        // Return user without sensitive data
        const updatedUser = await User.findById(id).select(
            '-password -resetOTP -otpExpiration -emailVerificationOTP -emailOTPExpiration'
        );

        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.code === 11000) {
            return res
                .status(400)
                .json({ message: 'Username or email already exists' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete user by admin
export const deleteUserByAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent admin from deleting themselves
        if (id === req.user_id) {
            return res
                .status(400)
                .json({ message: 'Cannot delete your own account' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            message: 'User deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create user by admin
export const createUserByAdmin = async (req, res) => {
    try {
        const {
            name,
            username,
            email,
            password,
            role = 'user',
            isVerified = false,
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return res.status(400).json({
                message:
                    existingUser.email === email
                        ? 'Email already exists'
                        : 'Username already exists',
            });
        }

        // Validate role
        if (!['user', 'admin'].includes(role)) {
            return res
                .status(400)
                .json({ message: 'Invalid role. Must be user or admin' });
        }

        // Create new user
        const user = new User({
            name,
            username,
            email,
            password,
            role,
            isVerified,
        });

        await user.save();

        // Return user without password
        const createdUser = await User.findById(user._id).select(
            '-password -resetOTP -otpExpiration -emailVerificationOTP -emailOTPExpiration'
        );

        res.status(201).json({
            message: 'User created successfully',
            user: createdUser,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        if (error.name === 'ValidationError') {
            return res
                .status(400)
                .json({ message: 'Validation error', errors: error.errors });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get system health and monitoring information
export const getSystemHealth = async (req, res) => {
    console.log('getSystemHealth called');
    try {
        // System information
        const systemInfo = {
            platform: os.platform(),
            arch: os.arch(),
            release: os.release(),
            uptime: os.uptime(),
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
            cpus: os.cpus().length,
            loadAverage: os.loadavg(),
        };

        // Database connection status
        const dbState = mongoose.connection.readyState;
        const dbStatus = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting',
        };

        // Application info
        const appInfo = {
            nodeVersion: process.version,
            environment: process.env.NODE_ENV || 'development',
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime(),
        };

        // Recent errors (mock data - in real app, you'd collect from logging system)
        const recentErrors = [
            // This would be populated from your error logging system
        ];

        res.status(200).json({
            success: true,
            data: {
                system: systemInfo,
                database: {
                    status: dbStatus[dbState],
                    name: mongoose.connection.name,
                    host: mongoose.connection.host,
                },
                application: appInfo,
                recentErrors,
                timestamp: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error('Error fetching system health:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Get security logs and activity
export const getSecurityLogs = async (req, res) => {
    try {
        // Recent login attempts (successful and failed)
        const recentLogins = await User.find({})
            .select('name username email lastLogin failedLoginAttempts')
            .sort({ lastLogin: -1 })
            .limit(50);

        // Active sessions (simplified - in real app, you'd track sessions)
        const activeUsers = await User.countDocuments({
            lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
        });

        // Security alerts (mock data - in real app, you'd have security monitoring)
        const securityAlerts = [
            // This would be populated from security monitoring system
        ];

        res.status(200).json({
            success: true,
            data: {
                recentLogins,
                activeUsers,
                securityAlerts,
                timestamp: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error('Error fetching security logs:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Get maintenance information
export const getMaintenanceInfo = async (req, res) => {
    try {
        // Database statistics
        const dbStats = await mongoose.connection.db.stats();

        // User statistics
        const userStats = {
            totalUsers: await User.countDocuments(),
            verifiedUsers: await User.countDocuments({ isVerified: true }),
            adminUsers: await User.countDocuments({ role: 'admin' }),
            recentUsers: await User.countDocuments({
                createdAt: {
                    $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                }, // Last 7 days
            }),
        };

        // Contact message statistics
        const contactStats = {
            totalMessages: await Contact.countDocuments(),
            unreadMessages: await Contact.countDocuments({ isRead: false }),
            recentMessages: await Contact.countDocuments({
                createdAt: {
                    $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                }, // Last 7 days
            }),
        };

        // System maintenance tasks
        const maintenanceTasks = {
            lastBackup: '2024-01-15T10:00:00Z', // Mock data
            cacheStatus: 'healthy',
            logFileSize: '45MB', // Mock data
            diskUsage: '60%', // Mock data
        };

        res.status(200).json({
            success: true,
            data: {
                database: dbStats,
                users: userStats,
                contacts: contactStats,
                maintenance: maintenanceTasks,
                timestamp: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error('Error fetching maintenance info:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Get all posts for admin (including drafts)
export const getAllPosts = async (req, res) => {
    try {
        const { q } = req.query; // search query parameter

        let matchStage = {};

        if (q) {
            matchStage = {
                $or: [
                    { title: { $regex: q, $options: 'i' } },
                    { content: { $regex: q, $options: 'i' } },
                    { tags: { $elemMatch: { $regex: q, $options: 'i' } } },
                ],
            };
        }

        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            {
                $unwind: {
                    path: '$author',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: q
                    ? {
                          ...matchStage,
                          $or: [
                              ...matchStage.$or,
                              { 'author.name': { $regex: q, $options: 'i' } },
                              {
                                  'author.username': {
                                      $regex: q,
                                      $options: 'i',
                                  },
                              },
                          ],
                      }
                    : {},
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    tags: 1,
                    published: 1,
                    isEditorPick: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    likeCount: 1,
                    author: {
                        _id: '$author._id',
                        name: '$author.name',
                        username: '$author.username',
                    },
                },
            },
            {
                $sort: { createdAt: -1 },
            },
        ]);

        res.status(200).json({
            message: 'Posts retrieved successfully',
            posts,
            count: posts.length,
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update post by admin
export const updatePostByAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, tags, published } = req.body;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Update allowed fields
        if (title !== undefined) post.title = title;
        if (content !== undefined) post.content = content;
        if (tags !== undefined) post.tags = tags;
        if (published !== undefined) post.published = published;

        await post.save();

        // Return updated post with author info
        const updatedPost = await Post.findById(id).populate(
            'author',
            'name username'
        );

        res.status(200).json({
            message: 'Post updated successfully',
            post: updatedPost,
        });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete post by admin
export const deletePostByAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await Post.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Post deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const toggleIsEditorPick = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // If the post is not currently an editor pick, check the limit
        if (!post.isEditorPick) {
            const editorPicksCount = await Post.countDocuments({
                isEditorPick: true,
            });
            if (editorPicksCount >= 5) {
                return res.status(400).json({
                    message:
                        "You can only have a maximum of 5 Editor's Picks.",
                });
            }
        }

        post.isEditorPick = !post.isEditorPick;
        await post.save();

        res.status(200).json({
            message: `Post has been ${
                post.isEditorPick ? 'selected as' : 'removed from'
            } an Editor's Pick.`,
            post,
        });
    } catch (error) {
        console.error("Error toggling Editor's Pick:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Clear application cache (maintenance action)
export const clearCache = async (req, res) => {
    try {
        // In a real application, you would clear various caches here
        // For now, we'll simulate cache clearing

        res.status(200).json({
            success: true,
            message: 'Cache cleared successfully',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error clearing cache:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
