import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        published: {
            type: Boolean,
            default: false,
        },
        estimatedReadTime: {
            type: Number, // in minutes
            default: 1,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        likeCount: {
            type: Number,
            default: 0,
        },
        featuredImage: {
            url: String,
            publicId: String,
            alt: String,
        },
        intro: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for better query performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ published: 1, createdAt: -1 });

const Post = mongoose.model('Post', postSchema);

export default Post;
