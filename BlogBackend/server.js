import 'dotenv/config'; // First: Load ENV variables
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import './config/passport.js'; // now sees process.env values
import route from './routes/userRoutes.js';
import authRoute from './routes/authRoutes.js';
import { router as postRoute } from './routes/postRoutes.js';
import { router as adminRoutes } from './routes/adminRoutes.js';
import commentRoute from './routes/commentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import cors from 'cors';
import connectDB from './config/db.js';

// Connect to Database
connectDB();
console.log('Database connection initiated');

const app = express();

// Middleware setup
app.use(
    cors({
        origin: [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:5174',
            'https://daily-dig-blog-app.vercel.app/',
        ],
        credentials: true,
    })
);
app.use(express.json());

// Session middleware (must be before passport)
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
        },
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/users', route);
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

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
