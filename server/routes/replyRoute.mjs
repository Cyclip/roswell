import express from "express";
import { authenticationMiddleware, softAuthenticationMiddleware, banMiddleware } from "../middleware/authMiddleware.mjs";
import CommentModel from '../db/models/CommentModel.mjs';
import PostInteractionsModel from '../db/models/PostInteractionsModel.mjs';
import PostModel from '../db/models/PostModel.mjs';
import UserModel from '../db/models/UserModel.mjs';

const router = express.Router();


// ==================== ROUTES ====================
// reply to a comment route
router.post("/create", [authenticationMiddleware, banMiddleware], async (req, res) => {
    try {
        // get user
        const userId = req.user.id;

        // get the body from the request
        const postId = req.body.postId;
        const parentCommentId = req.body.parentCommentId;
        const reply = req.body.reply;

        // get the parent comment
        // const parentComment = await CommentModel.findOne({ _id: parentCommentId }).select('replies');
        // if (!parentComment) {
        //     return res.status(400).json({
        //         success: false,
        //         error: 'Parent comment does not exist'
        //     });
        // }

        // create the reply
        const replyModel = await CommentModel.create({
            post: postId,
            user: userId,
            body: reply,
            likes: [],
            replies: [],
            parentComment: parentCommentId
        });

        // save all
        await replyModel.save();
        await CommentModel.updateOne({ _id: parentCommentId }, { $push: { replies: replyModel._id } });

        // return the reply
        const populatedComment = await CommentModel.populate(replyModel, { path: 'user' });  
        return res.status(200).json({
            success: true,
            data: populatedComment,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});


// get replies route
router.get("/getReplies/:commentId", softAuthenticationMiddleware, async (req, res) => {
    try {
        // get the comment id
        const commentId = req.params.commentId;

        // get the comment
        const comment = await CommentModel.findOne({ _id: commentId })
            .populate({
                path: "replies",
                populate: [
                    { path: "user" },
                ],
            })
            .populate('user') // Populating the "user" field of the comment
            .populate('likes')
            .select("+replies");

        if (!comment) {
            return res.status(400).json({
                success: false,
                error: 'Comment does not exist'
            });
        }

        // return the replies
        return res.status(200).json({
            success: true,
            data: comment.replies
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});


// ==================== EXPORT ====================
export default router;