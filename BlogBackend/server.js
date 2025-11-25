import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import route from './routes/userRoutes.js';
import { router as authRoute } from './routes/authRoutes.js';
import { router as postRoute } from './routes/postRoutes.js';
import { router as adminRoutes } from './routes/adminRoutes.js';
import commentRoute from './routes/commentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import cors from 'cors';
import connectDB from './config/db.js';

// Connect to Database
connectDB();
console.log('Database connection initiated'); // Debug log

const app = express();

// Middleware setup
app.use(
    cors({
        origin: [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5000',
        ],
        credentials: true,
    })
);
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('Request Body:', req.body);
    next();
});

// Routes
app.use('/api/user', route);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/comments', commentRoute);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
