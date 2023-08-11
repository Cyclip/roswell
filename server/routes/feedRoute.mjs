import express from "express";
import { authenticationMiddleware, softAuthenticationMiddleware } from "../middleware/authMiddleware.mjs";
import { getFeed } from "../utils/feed.mjs";

const router = express.Router();

// ==================== ROUTES ====================
router.get('/', softAuthenticationMiddleware, async (req, res) => {
    // get id
    const userId = req.user ? req.user._id : null;
    const page = req.query.page || 0;
    const limit = req.query.limit || 10;
    
    try {
        const feed = await getFeed(userId, page, limit);
        res.status(200).send({
            success: true,
            data: feed
        });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

// ==================== EXPORTS ====================
export default router;