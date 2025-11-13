import express from 'express';
import {
    getAllUsers,
    updateUserByAdmin,
    deleteUserByAdmin,
    createUserByAdmin,
} from '../controller/adminController.js';
import {
    authMiddleware,
    adminMiddleware,
} from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authMiddleware, adminMiddleware);

// User management routes
router.get('/users', getAllUsers);
router.post('/users', createUserByAdmin);
router.put('/users/:id', updateUserByAdmin);
router.delete('/users/:id', deleteUserByAdmin);

export { router };
