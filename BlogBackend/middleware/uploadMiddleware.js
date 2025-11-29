import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Configure multer storage for profile images
const profileImageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blog-app/profile-images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 500, height: 500, crop: 'fill', gravity: 'face' },
            { quality: 'auto' },
        ],
        public_id: (req, file) => `profile-${req.user_id}-${Date.now()}`,
    },
});

// Configure multer storage for post images
const postImageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blog-app/post-images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 1200, height: 800, crop: 'fill' },
            { quality: 'auto' },
        ],
        public_id: (req, file) => `post-${req.user_id}-${Date.now()}`,
    },
});

// File filter function
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'
            ),
            false
        );
    }
};

// Create multer upload instances
export const uploadProfileImage = multer({
    storage: profileImageStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 5MB limit
    },
});

export const uploadPostImage = multer({
    storage: postImageStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit for post images
    },
});
