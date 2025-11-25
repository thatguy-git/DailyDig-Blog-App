import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const mongoURI =
            process.env.MONGO_URI ||
            'mongodb+srv://davidkiing1400_db_user:3K3Cc2DFbwE9oHLq@blogcluster1.qflay7b.mongodb.net/blog-db?appName=BlogCluster1';
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
