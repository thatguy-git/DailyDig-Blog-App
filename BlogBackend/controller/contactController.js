import Contact from '../model/contactModel.js';

// Submit a contact form message
export const submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Basic validation
        if (name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Name must be at least 2 characters',
            });
        }

        if (subject.trim().length < 5) {
            return res.status(400).json({
                success: false,
                message: 'Subject must be at least 5 characters',
            });
        }

        if (message.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Message must be at least 10 characters',
            });
        }

        const contact = new Contact({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim(),
        });

        const savedContact = await contact.save();

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: {
                id: savedContact._id,
                createdAt: savedContact.createdAt,
            },
        });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Get all contact messages (admin only)
export const getContacts = async (req, res) => {
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
        console.error('Error fetching contacts:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Get unread contact messages count (for notifications)
export const getUnreadCount = async (req, res) => {
    try {
        const unreadCount = await Contact.countDocuments({ isRead: false });

        res.status(200).json({
            success: true,
            data: { unreadCount },
        });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Mark contact message as read (admin only)
export const markAsRead = async (req, res) => {
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
        console.error('Error marking message as read:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Delete contact message (admin only)
export const deleteContact = async (req, res) => {
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
