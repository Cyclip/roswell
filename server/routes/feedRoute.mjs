import express from "express";
import { authenticationMiddleware, softAuthenticationMiddleware } from "../middleware/authMiddleware.mjs";
import { getFeed } from "../utils/feed.mjs";
import PostModel from "../db/models/PostModel.mjs";
import PostContentModel from "../db/models/PostContentModel.mjs";
import PostInteractionsModel from "../db/models/PostInteractionsModel.mjs";
import UserModel from "../db/models/UserModel.mjs";

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

router.get("/recent", async (req, res) => {
    // return the 5 most recent posts
    try {
        const posts = await PostModel.find()
            .sort({ createdAt: -1 }).limit(5)
            .populate({ path: "content", model: PostContentModel })
            .populate({ path: "author", model: UserModel })
            .populate({ path: "interactions", model: PostInteractionsModel });
        res.status(200).send({
            success: true,
            data: posts
        });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

// ==================== EXPORTS ====================
export default router;