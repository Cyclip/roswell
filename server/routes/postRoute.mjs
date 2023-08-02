import express from 'express';
import PostContentModel from '../db/models/PostContentModel.mjs';
import PostInteractionsModel from '../db/models/PostInteractionsModel.mjs';
import PostModel from '../db/models/PostModel.mjs';
import UserModel from '../db/models/UserModel.mjs';

import { authenticationMiddleware } from "../middleware/authMiddleware.mjs";

const router = express.Router();

// Users who are not logged in may not modify posts
// They can only view posts

// ==================== ROUTES ====================
router.post("/create", authenticationMiddleware, async (req, res) => {
    try {
        // Get user from request
        const user = await UserModel.findById(req.user._id);

        // Return error if user does not exist
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'User does not exist'
            });
        }

        // Get body from request
        const body = req.body;
        console.log(body);

        // Create post models
        const postInteractions = new PostInteractionsModel();
        const postContent = new PostContentModel({
            type: body.type,
            title: body.title,
            body: body.body,
            image: body.image
        });
        const post = new PostModel({
            author: user._id,
            interactions: postInteractions._id,
            content: postContent._id
        });

        // Save post models
        await postInteractions.save();
        await postContent.save();
        await post.save();

        // Return post and url
        return res.status(200).json({
            success: true,
            post: post,
            url: `/post/${post._id}`
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

export default router;