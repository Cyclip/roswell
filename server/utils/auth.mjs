import User from "../db/models/UserModel.mjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Utility functions for authentication
// Note: Token generation is handled by the User model

// ==================== AUTHENTICATION ====================
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

// hash
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// ==================== VALIDATION ====================

// Email validator
export const isEmail = (email) => {
    // false if email is empty/null
    if (!email) {
        return false;
    }
    return validator.isEmail(email);
};

// Password validator
// Requirements:
// - At least 6 characters long
// - At most 20 characters long
// - Must contain at least 1 uppercase letter
// - Must contain at least 1 lowercase letter
// - Must contain at least 1 number
// Return value:
// (bool, string) - (true, '') if password is valid
// (false, 'error message') if password is invalid
export const isPassword = (password) => {
    if (password === null || password === undefined) {
        return [false, 'Password cannot be empty'];
    }
    if (password.length < 6 || password.length > 20) {
        return [false, 'Password must be between 6 and 20 characters long'];
    }
    if (!/[A-Z]/.test(password)) {
        return [false, 'Password must contain at least 1 uppercase letter'];
    }
    if (!/[a-z]/.test(password)) {
        return [false, 'Password must contain at least 1 lowercase letter'];
    }
    if (!/[0-9]/.test(password)) {
        return [false, 'Password must contain at least 1 number'];
    }
    return [true, ''];
};

// Username validator
// Requirements:
// - At least 3 characters long
// - At most 20 characters long
// - Alphanumeric (no spaces), or underscores
// Return value:
// (bool, string) - (true, '') if username is valid
// (false, 'error message') if username is invalid
export const isUsername = (username) => {
    if (username === null || username === undefined) {
        return [false, 'Username cannot be empty'];
    }
    if (username.length < 3 || username.length > 20) {
        return [false, 'Username must be between 3 and 20 characters long'];
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return [false, 'Username must be alphanumeric'];
    }
    return [true, ''];
};