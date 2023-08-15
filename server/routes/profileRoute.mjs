import express from "express";
import { authenticationMiddleware, softAuthenticationMiddleware, banMiddleware } from "../middleware/authMiddleware.mjs";
import UserModel from "../db/models/UserModel.mjs";

const router = express.Router();

// ==================== ROUTES ====================
// @route   GET /profile
// @desc    Get user profile
// @access  Public
router.get('/:username', async (req, res) => {
    // Get username from URL
    const { username } = req.params;

    try {
        // get user from db
        const user = await UserModel.findOne({ username })
            // select only these fields
            .select("username createdAt posts role profilePicture bio birthday followers following punishment")
            // populate followers, following, and punishments
            .populate({
                path: "followers",
                select: "username profilePicture",
            })
            .populate({
                path: "following",
                select: "username profilePicture",
            })
            .populate({
                path: "punishment",
                match: { expiresAt: { $gt: Date.now() } },
                // select only these fields
                select: "expiresAt -reason",
            })
            // execute query
            .exec();
        
        // if user not found
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        };

        // if user found
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "Server error" });
    };
});


// ==================== EXPORT ====================
export default router;