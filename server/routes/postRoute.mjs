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
        const id = req.user.id;

        // Get user from database
        const user = await UserModel.findOne({ _id: id });

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
        return res.status(201).json({
            success: true,
            post: post,
            url: `/post/${post._id}`
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: err.message
            });
        }

        console.log(err);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

router.get("/get/:id", async (req, res) => {
    // Get post id from request
    const id = req.params.id;
    // client can supply a list of information to get
    // if no list is supplied, get all information
    const info = req.query.info || ['content', 'interactions', 'author'];

    try {
        // Get post from database
        const post = await PostModel.findById(id);

        // Return error if post does not exist
        if (!post) {
            return res.status(400).json({
                success: false,
                error: 'Post does not exist'
            });
        }

        // Get post information
        const postInfo = {
            id: post._id
        };
        if (info.includes('content')) {
            const content = await PostContentModel.findById(post.content);
            postInfo.content = content;
        }
        if (info.includes('interactions')) {
            const interactions = await PostInteractionsModel.findById(post.interactions);
            postInfo.interactions = interactions;
        }
        if (info.includes('author')) {
            const author = await UserModel.findById(post.author);
            postInfo.author = author;
        }

        // Return post information
        return res.status(200).json({
            success: true,
            post: postInfo
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