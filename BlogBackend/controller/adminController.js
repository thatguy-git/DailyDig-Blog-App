import User from '../model/userModel.js';
import bcrypt from 'bcrypt';

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
