import express from "express";
import cors from "cors";
import User from "../db/models/UserModel.mjs";
import { isEmail, isPassword, isUsername, hashPassword } from "../utils/auth.mjs";

const router = express.Router();

// ==================== ROUTES ====================

// register route
router.post("/register", async (req, res) => {
    try {
        // Get username, email, and password from request body
        const { username, email, password } = req.body;

        // Validate username
        const [validUsername, usernameError] = isUsername(username);
        if (!validUsername) {
            return res.status(400).json({
                success: false,
                error: usernameError
            });
        }

        // Validate email
        if (!isEmail(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email'
            });
        }

        // Validate password
        const [validPassword, passwordError] = isPassword(password);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                error: passwordError
            });
        }

        // Return error if username or email already exists
        const userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            // username or email already exists?
            if (userExists.username === username) {
                return res.status(400).json({
                    success: false,
                    error: 'Username already exists'
                });
            } else {
                return res.status(400).json({
                    success: false,
                    error: 'Email already exists'
                });
            }
        }

        // Create new user
        const newUser = new User({
            username,
            email,
            password
        });

        // Save user to database
        await newUser.save();

        // Return success message
        return res.status(200).json({
            success: true,
            message: 'User registered successfully'
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// login route
router.post("/login", async (req, res) => {
    try {
        // Get username and password from request body
        const { username, password } = req.body;

        // Validate password
        const [validPassword, passwordError] = isPassword(password);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                error: passwordError
            });
        }

        // hash password
        const hashedPassword = await hashPassword(password);

        // Check if user exists
        const user = await User.findOne({ username });
        if (user) {
            // Check if password is correct
            const isMatch = await user.matchPassword(hashedPassword);
            if (isMatch) {
                // Sign JWT and return
                const token = user.getToken();
                return res.status(200).json({
                    success: true,
                    message: 'User logged in successfully',
                    token
                });

            } else {
                return res.status(400).json({
                    success: false,
                    error: 'Incorrect password'
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                error: 'User does not exist'
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// ==================== EXPORT ====================

export default router;