import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        subject: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for admin queries (unread first)
contactSchema.index({ isRead: 1, createdAt: -1 });

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
