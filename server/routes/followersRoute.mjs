import express from "express";
import UserModel from "../db/models/UserModel.mjs";
import { authenticationMiddleware, banMiddleware, softAuthenticationMiddleware } from "../middleware/authMiddleware.mjs";

const router = express.Router();

// ==================== ROUTES ====================
// GET /api/followers/following/:id? (get following of user with id)
router.get('/following/:id?', softAuthenticationMiddleware, async (req, res) => {
    try {
        let userId = req.params.id || req.user.id; // Use the provided ID or the authenticated user's ID
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'No user ID provided'
            });
        }
        const user = await UserModel.findOne({ _id: userId }).populate('following');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const following = user.following;

        return res.status(200).json({
            success: true,
            following: following
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});


// GET /api/followers/:id? (get followers of user with id)
router.get('/:id?', softAuthenticationMiddleware, async (req, res) => {
    try {
        let userId = req.params.id || req.user.id; // Use the provided ID or the authenticated user's ID
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'No user ID provided'
            });
        }
        
        const user = await UserModel.findOne({ _id: userId }).populate('followers');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // get followers
        const followers = user.followers;

        // return followers
        return res.status(200).json({
            success: true,
            followers: followers
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});


// POST /api/followers/:id (follow user with id)
router.post('/follow/:id', authenticationMiddleware, banMiddleware, async (req, res) => {
    try {
        // update user (add to set)
        await UserModel.updateOne({ _id: req.params.id }, { $addToSet: { followers: req.user.id } });

        // update current user (add to set)
        await UserModel.updateOne({ _id: req.user.id }, { $addToSet: { following: req.params.id } });

        // return success
        return res.status(200).json({
            success: true,
            message: 'Successfully followed user'
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// DELETE /api/followers/:id (unfollow user with id)
router.delete('/unfollow/:id', authenticationMiddleware, banMiddleware, async (req, res) => {
    try {
        // update user (remove from set)
        await UserModel.updateOne({ _id: req.params.id }, { $pull: { followers: req.user.id } });

        // update current user (remove from set)
        await UserModel.updateOne({ _id: req.user.id }, { $pull: { following: req.params.id } });

        return res.status(200).json({
            success: true,
            message: 'Successfully unfollowed user'
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// ==================== EXPORT ====================
export default router;