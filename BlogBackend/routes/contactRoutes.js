import express from 'express';
import {
    submitContact,
    getContacts,
    getUnreadCount,
    markAsRead,
    deleteContact,
} from '../controller/contactController.js';
import {
    authMiddleware,
    adminMiddleware,
} from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for submitting contact form
router.post('/submit', submitContact);

// Admin-only routes
router.get('/', authMiddleware, adminMiddleware, getContacts);
router.get('/unread-count', authMiddleware, adminMiddleware, getUnreadCount);
router.put('/:contactId/read', authMiddleware, adminMiddleware, markAsRead);
router.delete('/:contactId', authMiddleware, adminMiddleware, deleteContact);

export default router;
