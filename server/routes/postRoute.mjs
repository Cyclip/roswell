import express from 'express';
import PostContentModel from '../db/models/PostContentModel.mjs';
import PostInteractionsModel from '../db/models/PostInteractionsModel.mjs';
import PostModel from '../db/models/PostModel.mjs';
import UserModel from '../db/models/UserModel.mjs';

import { authenticationMiddleware, banMiddleware } from "../middleware/authMiddleware.mjs";
import { handleLikesMilestones } from '../utils/notif.mjs';

const router = express.Router();

// Users who are not logged in may not modify posts
// They can only view posts

// ==================== ROUTES ====================
router.post("/create", [authenticationMiddleware, banMiddleware], async (req, res) => {
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

        await UserModel.updateOne({ _id: id }, { $push: { posts: post._id } });

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

// toggle like on a post
router.post("/like/:id", [authenticationMiddleware, banMiddleware], async (req, res) => {
    // Get post id from request
    const id = req.params.id;

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

        // Get user from database
        const user = await UserModel.findById(req.user.id);

        // Return error if user does not exist
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'User does not exist'
            });
        }

        // Get post interactions from database
        const postInteractions = await PostInteractionsModel.findById(post.interactions);

        // Return error if post interactions do not exist
        if (!postInteractions) {
            return res.status(400).json({
                success: false,
                error: 'Post interactions do not exist'
            });
        }

        // Check if user has already liked post
        const liked = postInteractions.likes.includes(user._id);

        // Toggle like
        if (liked) {
            // Remove like
            postInteractions.likes.pull(user._id);
        } else {
            // Add like
            postInteractions.likes.push(user._id);
        }

        // Save post interactions
        await postInteractions.save();

        // handle likes milestone
        handleLikesMilestones(
            post,
            postInteractions,
        );

        // Return post interactions
        return res.status(200).json({
            success: true,
            postInteractions: postInteractions
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// toggle save
router.post("/save/:id", [authenticationMiddleware, banMiddleware], async (req, res) => {
    // Get post id from request
    const id = req.params.id;

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
        const postInteractions = await PostInteractionsModel.findById(post.interactions);

        // Find the user by ID
        const user = await UserModel.findById(req.user.id).select('+saved.posts');

        if (!user) {
        console.log('User not found');
        return;
        }

        const savedPostsArray = user.saved.posts;

        // Check if the post ID is already in the array
        const postIndex = savedPostsArray.indexOf(post._id);
        let isSaved = false;

        // Toggle the post ID based on its presence in the array
        if (postIndex === -1) {
            // Post ID is not in the array, so add it
            savedPostsArray.push(post._id);
            postInteractions.saves++;
            isSaved = true;
        } else {
            // Post ID is in the array, so remove it
            savedPostsArray.splice(postIndex, 1);
            postInteractions.saves--;
        }

        // Save the updated user document
        await user.save();
        await postInteractions.save();

        return res.status(200).json({
            success: true,
            isSaved: isSaved,
            saves: postInteractions.saves
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// is post saved?
router.post("/isSaved/:id", authenticationMiddleware, async (req, res) => {
    // Get post id from request
    const id = req.params.id;

    try {
        // Get user from database
        const user = await UserModel.findById(req.user.id).select('+saved.posts');

        // Return error if user does not exist
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'User does not exist'
            });
        }

        // Check if user has already saved post
        const saved = user.saved.posts.includes(id);

        // Return saved
        return res.status(200).json({
            success: true,
            saved: saved
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