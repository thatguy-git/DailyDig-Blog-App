import dotenv from "dotenv";
dotenv.config();
import express from "express";
import route from "./routes/userRoutes.js";
import { router as authRoute } from "./routes/authRoutes.js";
import { router as postRoute } from "./routes/postRoutes.js";
import commentRoute from "./routes/commentRoutes.js";
import cors from 'cors';
import connectDB from "./config/db.js";

// Connect to Database
connectDB();
console.log('Database connection initiated'); // Debug log

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('Request Body:', req.body);
    next();
});

// Routes
app.use("/api/user", route);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
