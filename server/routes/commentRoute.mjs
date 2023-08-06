import express from "express";
import { authenticationMiddleware, softAuthenticationMiddleware } from "../middleware/authMiddleware.mjs";
import CommentModel from '../db/models/CommentModel.mjs';
import PostInteractionsModel from '../db/models/PostInteractionsModel.mjs';
import PostModel from '../db/models/PostModel.mjs';
import UserModel from '../db/models/UserModel.mjs';

const router = express.Router();


// ==================== ROUTES ====================
// post comment route
router.post("/create", authenticationMiddleware, async (req, res) => {
    try {
        // get the user ID
        const id = req.user.id;

        // get the user from the database
        const user = await UserModel.findOne({ _id: id });
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'User does not exist'
            });
        }

        // get the body from the request
        const body = req.body;
        const postId = body.postId;
        const comment = body.comment;

        // get the post
        const post = await PostModel.findOne({ _id: postId });
        if (!post) {
            return res.status(400).json({
                success: false,
                error: 'Post does not exist'
            });
        }
        // get the interactions model (foreign key)
        const postInteractionsId = post.interactions;
        const postInteractions = await PostInteractionsModel.findOne({ _id: postInteractionsId });
        if (!postInteractions) {
            return res.status(400).json({
                success: false,
                error: 'Post interactions does not exist'
            });
        }

        // create the comment
        const commentModel = await CommentModel.create({
            post: postId,
            user: id,
            body: comment,
            likes: [],
            replies: []
        });
        // save the comment
        await commentModel.save();

        // add the comment to the post
        postInteractions.comments.push(commentModel._id);
        await postInteractions.save();

        // return the comment
        return res.status(200).json({
            success: true,
            data: commentModel
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: err.message
            });
        }
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// get comments
router.get("/get/:postId", softAuthenticationMiddleware, async (req, res) => {
    const postId = req.params.postId;
    // optional query parameter for pagination
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    // the user may or may not be logged in
    // if the user is logged in, we will return the comments with the user's likes
    const userId = req.user?.id;

    try {
        // Get the post first
        const post = await PostModel.findOne({ _id: postId });
        if (!post) {
            return res.status(400).json({
                success: false,
                error: 'Post does not exist'
            });
        }
        
        // Get the interactions model (foreign key)
        const postInteractionsId = post.interactions;
        const postInteractions = await PostInteractionsModel.findOne({ _id: postInteractionsId });
        if (!postInteractions) {
            return res.status(400).json({
                success: false,
                error: 'Post interactions do not exist'
            });
        }
        
        // Get comments
        const comments = await CommentModel.find({ _id: { $in: postInteractions.comments } })
        .populate('user', 'username profilePicture')
        .populate('likes', 'username')
        .populate('replies', 'user body likes createdAt')
        .exec();

        // Sort comments: User's comments first, then others based on likes
        comments.sort((a, b) => {
            if (userId && a.user._id.toString() === userId) {
                return -1; // User's comment comes first
            } else if (userId && b.user._id.toString() === userId) {
                return 1; // User's comment comes first
            } else {
                return b.likes.length - a.likes.length; // Sort by likes (descending order)
            }
        });
        
        // Return comments
        return res.status(200).json({
          success: true,
          data: comments
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// ==================== EXPORT ====================
export default router;