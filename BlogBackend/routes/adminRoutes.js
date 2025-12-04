import express from 'express';
import {
    getAllUsers,
    updateUserByAdmin,
    deleteUserByAdmin,
    createUserByAdmin,
    getContactMessages,
    getUnreadContactCount,
    markContactAsRead,
    deleteContactMessage,
    getSystemHealth,
    getSecurityLogs,
    getMaintenanceInfo,
    clearCache,
    getAllPosts,
    updatePostByAdmin,
    deletePostByAdmin,
    toggleIsEditorPick,
} from '../controller/adminController.js';
import {
    authMiddleware,
    adminMiddleware,
} from '../middleware/authMiddleware.js';
import { restrictDemoAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require authentication and admin role and demo admin restrictions
router.use(authMiddleware, adminMiddleware, restrictDemoAdmin);

// User management routes
router.get('/users', getAllUsers);
router.post('/users', createUserByAdmin);
router.put('/users/:id', updateUserByAdmin);
router.delete('/users/:id', deleteUserByAdmin);

// Contact management routes
router.get('/contacts', getContactMessages);
router.get('/contacts/unread-count', getUnreadContactCount);
router.put('/contacts/:contactId/read', markContactAsRead);
router.delete('/contacts/:contactId', deleteContactMessage);

// Post management routes
router.get('/posts', getAllPosts);
router.put('/posts/:id', updatePostByAdmin);
router.delete('/posts/:id', deletePostByAdmin);
router.put('/posts/:id/toggle-editor-pick', toggleIsEditorPick);

// Security and Maintenance routes
router.get('/system/health', getSystemHealth);
router.get('/security/logs', getSecurityLogs);
router.get('/maintenance/info', getMaintenanceInfo);
router.post('/maintenance/clear-cache', clearCache);

export { router };
