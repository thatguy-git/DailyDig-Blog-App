import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: function () {
                // Only required if not using social login
                return !this.googleId && !this.twitterId;
            },
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationOTP: {
            type: String,
        },
        emailOTPExpiration: {
            type: Date,
        },
        resetOTP: {
            type: String,
        },
        otpExpiration: {
            type: Date,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        profileImage: {
            url: String,
            publicId: String,
        },
        googleId: { type: String, unique: true, sparse: true },
        twitterId: { type: String, unique: true, sparse: true },
        facebookId: { type: String, unique: true, sparse: true },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', userSchema);

export default User;
