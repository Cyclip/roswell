// Mongoose schema for User collection
import mongoose from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { isEmail, isUsername, isPassword } from "../../utils/auth.mjs";

const DEFAULT_PFP = '';

const UserSchema = new Schema({
    // Unique username of the user
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        unique: [true, 'Username already exists'],
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [20, 'Username must be less than 20 characters long'],
    },
    // User's primary email (must be verified)
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: [true, 'Email already exists'],
        trim: true,
        validate: [isEmail, 'Please enter a valid email'],
        select: false // Don't return email when fetching user
    },
    // Password of the user (hashed using bcrypt)
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        maxlength: [20, 'Password must be less than 20 characters long'],
        select: false
    },
    // Current active reset pw token
    resetPasswordToken: String,
    // Expiry date of the reset pw token
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
        select: false,
    },
    // User's role (admin or user)
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        select: true,
    },
    // User's profile picture
    profilePicture: {
        type: String,
        default: DEFAULT_PFP,
    },
    // User's bio
    bio: {
        type: String,
        default: '',
        maxlength: [100, 'Bio must be less than 100 characters long'],
        select: false,
    },
    // User's birthday
    birthday: {
        type: Date,
        default: null,
        select: false,
    },
    // fields for favourited posts and comments
    saved: {
        posts: [{
            type: Schema.Types.ObjectId,
            ref: 'Post',
            select: false,
        }],
        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment',
            select: false,
        }]
    },
    // fields for user's followers and following
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        select: false,
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        select: false,
    }],
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post',
        select: false,
        default: [],
    }],
    // User's notifications
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: 'Notification',
        select: false,
    }],
    // penalty points
    penaltyPoints: {
        type: Number,
        default: 0,
        select: false,
    },
    // most recent punishment
    punishment: {
        type: Schema.Types.ObjectId,
        ref: 'Punishment',
        select: false,
        default: null,
    },
});

// Hash password before saving to database
// This will run before every save() call
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
// JWT is used for authentication, specifically for protected routes
UserSchema.methods.getToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
}

// Check token
UserSchema.methods.checkToken = function(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    console.log(enteredPassword, this.password);
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
}

// // Verify email token (ensure its not expired)
// UserSchema.methods.getVerifyEmailToken = function() {
//     // Generate token
//     const verifyToken = uuidv4();

//     // Hash token and set to resetPasswordToken field
//     this.verifyEmailToken = crypto.createHash('sha256').update(verifyToken).digest('hex');

//     // Set expire
//     this.verifyEmailExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

//     return verifyToken;
// }

// // Send email to user with reset password token
// UserSchema.methods.sendResetPasswordEmail = async function() {
//     const resetUrl = `${process.env.CLIENT_URL}/resetpassword/${this.getResetPasswordToken()}`;

//     const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

//     try {
//         await sendEmail({
//             email: this.email,
//             subject: 'Password reset token',
//             message
//         });
//     } catch (err) {
//         console.log(err);
//     }
// }

// Send email to user with verify email token
// todo

export default mongoose.model('User', UserSchema);