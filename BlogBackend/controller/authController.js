import bcrypt from "bcrypt";
import User from "../model/userModel.js";
import { generateToken, generateTempToken } from "../utils/jwt.js";
import { generateOTP } from "../utils/otp.js";
import { transporter } from "../config/mailer.js";




// User Registration
export const createUser = async (req, res) => {
    try {
        console.log('Request body:', req.body); // Debug log
        const { email, password, ...rest } = req.body;
        // checking if email already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists." });
        }
        // creating a user in db
        const trimmedPassword = password.trim();
        const userData = new User({ email, password: trimmedPassword, isVerified: true, ...rest }); // Set verified to true for testing
        const user = await userData.save();
        console.log('User saved:', user); // Debug log

        // Generate token immediately since email verification is bypassed
        const token = generateToken(user._id);

        return res.status(201).json({
            message: "User registered successfully",
            data: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified
            },
            token
        });
    } catch (error) {
        console.error('Detailed error:', error); // Debug log
        return res.status(500).json({
            message: "Sign up error.",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};




// User Login
export const loginUser = async(req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if (user) {
            if (!user.isVerified) {
                return res.status(400).json({message: "Please verify your email before logging in."});
            }
            console.log('youre a user'); // Debug log
            const trimmedPassword = password.trim();
            const passwordMatch = await bcrypt.compare(trimmedPassword, user.password);
            console.log('Password match result:', passwordMatch); // Debug log
            console.log(trimmedPassword, user.password); // Debug log
            if (passwordMatch) {
                console.log('Password matched'); // Debug log
                const token = generateToken(user._id);
                return res.status(201).json({
                    user: {
                        message: "User Logged in successfully",
                        id: user._id,
                        email: user.email
                    },
                    token,
                });
            } else{
                return res.status(400).json({message: "Invalid password"});
            }
        } else{
                return res.status(400).json({message: "No user with this email"});
            }
    } catch (error) {
        return res.status(500).json({ message: "Log in error." });
    }
}




// Send OTP for password reset
export const sendOTP = async(req, res) => {
    const { email } = req.body;
    console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Set" : "Not set");
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Not set");
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({message: "No user found with this email."})
        }
        const otp = generateOTP();
        const expirationTime = Date.now() + 600000; //10 mins from generation time
        user.resetOTP = otp;
        user.otpExpiration = expirationTime;
        await user.save();
        console.log("Generated OTP for", user.email, ":", otp);
        
        try {
            const mailDetails = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: "Password Reset OTP",
                text: `Your Password reset OTP is: ${otp}. It expires in 10 mins`
            
            };
            await transporter.sendMail(mailDetails);
            console.log("Email sent successfully to:", user.email);
            return res.status(200).json({ message: "OTP sent to email successfully." });
        } catch (error) {
            console.error("Error sending email lol:", error);
            return res.status(500).json({ message: "Failed to send OTP email." });
        }
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send OTP email." });
    }
};





// Reset Password
export const resetPassword = async (req, res) => {
    const user_id = req.user_id;
    const { newPassword } = req.body;
    if (!newPassword) {
        return res.status(400).json({ message: "New password is required" });
    }
    try {
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const trimmedPassword = newPassword.trim();
        user.password = trimmedPassword;
        user.resetOTP = undefined;
        user.otpExpiration = undefined;
        await user.save();
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};





// Verify OTP
export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }
    const trimmedOtp = otp.trim();
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found for email:", email);
            return res.status(400).json({ message: "User not found" });

        }
        if (!user.resetOTP) {
            return res.status(400).json({ message: "No OTP set for this user" });
        }
        console.log("Stored OTP:", user.resetOTP, "Type:", typeof user.resetOTP);
        console.log("Input OTP:", trimmedOtp, "Type:", typeof trimmedOtp);
        if (user.resetOTP !== trimmedOtp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (Date.now() > user.otpExpiration) {
            user.resetOTP = undefined;
            user.otpExpiration = undefined;
            await user.save();
            return res.status(400).json({ message: "OTP has expired" });
        }
        user.resetOTP = undefined;
        user.otpExpiration = undefined;
        await user.save();
        const tempToken = generateTempToken(user._id);

        res.status(200).json({
            message: "OTP verified successfully",
            tempToken: tempToken
        });
    } catch (error) {
        console.log("OTP verification error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Verify Email OTP
export const verifyEmailOTP = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }
    const trimmedOtp = otp.trim();
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (!user.emailVerificationOTP) {
            return res.status(400).json({ message: "No email verification OTP set for this user" });
        }
        if (user.emailVerificationOTP !== trimmedOtp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (Date.now() > user.emailOTPExpiration) {
            user.emailVerificationOTP = undefined;
            user.emailOTPExpiration = undefined;
            await user.save();
            return res.status(400).json({ message: "OTP has expired" });
        }
        user.isVerified = true;
        user.emailVerificationOTP = undefined;
        user.emailOTPExpiration = undefined;
        await user.save();
        const token = generateToken(user._id);
        res.status(200).json({
            message: "Email verified successfully",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.log("Email OTP verification error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


