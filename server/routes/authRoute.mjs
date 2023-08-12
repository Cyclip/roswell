import express from "express";
import User from "../db/models/UserModel.mjs";
import { isEmail, isPassword, isUsername, hashPassword } from "../utils/auth.mjs";
import { authenticationMiddleware } from "../middleware/authMiddleware.mjs";
import UserModel from "../db/models/UserModel.mjs";

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

        // Check if user exists
        const user = await User.findOne({ username })
            .populate("punishment")
            .select("+password")
            .select("+punishment");
        if (user) {
            // Check if password is correct
            const isMatch = await user.matchPassword(password);
            if (isMatch) {
                // Sign JWT and return
                const token = user.getToken();
                return res.status(200).json({
                    success: true,
                    message: 'User logged in successfully',
                    token,
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        profilePicture: user.profilePicture,
                        role: user.role,
                        punishment: user.punishment
                    }
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

// checkToken route
router.post("/checkToken", async (req, res) => {
    try {
        // Get username and token from request body
        const { username, token } = req.body;

        // Check if user exists
        const user = await User.findOne({ username: username })
            .populate("punishment")
            .select("+punishment");

        if (user) {
            // Check if token is valid
            const isValid = user.checkToken(token);

            if (isValid) {
                return res.status(200).json({
                    success: true,
                    message: 'Token is valid',
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        profilePicture: user.profilePicture,
                        role: user.role,
                        punishment: user.punishment
                    }
                });
            }
        }

        return res.status(400).json({
            success: false,
            error: 'Token is invalid'
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});


// get current user punishment
router.post("/punishment", authenticationMiddleware, async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.user.id })
            .select("punishment")
            .populate("punishment");

        return res.status(200).json({
            success: true,
            punishment: user.punishment
        });
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