import express from "express";
import { authenticationMiddleware, softAuthenticationMiddleware } from "../middleware/authMiddleware.mjs";
import CommentModel from '../db/models/CommentModel.mjs';
import PostInteractionsModel from '../db/models/PostInteractionsModel.mjs';
import PostModel from '../db/models/PostModel.mjs';
import UserModel from '../db/models/UserModel.mjs';

const router = express.Router();


// ==================== ROUTES ====================
// get a comment
router.get("/getComment/:id", softAuthenticationMiddleware, async (req, res) => {
    const commentId = req.params.id;

    try {
        // get the comment
        const comment = CommentModel.findOne({ _id: commentId })
            .populate('replies')
            .populate('user') // Populating the "user" field of the comment
            .populate('likes')
            .select("+replies");
        if (!comment) {
            return res.status(400).json({
                success: false,
                error: 'Comment does not exist'
            });
        }

        // Return comment
        return res.status(200).json({
            success: true,
            data: comment,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

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

        const commentModel = await CommentModel.create({
            post: postId,
            user: id,
            body: comment,
            likes: [],
            replies: [],
        });
        
        // Now populate the 'user' field using the populated method
        const populatedComment = await CommentModel.populate(commentModel, { path: 'user' });        

        // save the comment
        await commentModel.save();

        // add the comment to the post
        postInteractions.comments.push(commentModel._id);
        await postInteractions.save();

        return res.status(200).json({
            success: true,
            data: populatedComment
        });
    } catch (err) {
        console.log(err)
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

        // get comments sorted by the number of likes from PostInteractionsModel
        // (likes is an array of user ids)
        const commentsIds = postInteractions.comments;
        const commentsQuery = CommentModel.find({ _id: { $in: commentsIds } })
            .sort({ likes: -1 })
            .skip(skip)
            .limit(limit)
            // include user, user profile, and likes
            .populate('user', 'username profilePicture')
            .populate('likes', 'username')
            .select('replies');

        // Execute the comments query
        const comments = await commentsQuery.exec();
        
        // Return comments
        return res.status(200).json({
          success: true,
          data: comments,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});


// toggle a comment
router.post("/like/:id", authenticationMiddleware, async (req, res) => {
    const commentId = req.params.id;

    try {
        // get user (guaranteed to exist due to middleware)
        // + im lazy
        const userId = req.user.id;
        const userModel = await UserModel.findOne({ _id: userId });
        const element = { userId, username: userModel.username };
        console.log("toggling", element);

        await CommentModel.updateOne(
            { _id: commentId },
            [
                {
                    $set: {
                        likes: {
                            $cond: [
                                {
                                    $in: [element, "$likes"]
                                },
                                {
                                    $setDifference: ["$likes", [element]]
                                },
                                {
                                    $concatArrays: ["$likes", [element]]
                                }
                            ]
                        }
                    }
                }
            ]
        )

        const commentModel = await CommentModel.findOne({ _id: commentId });
        const likes = commentModel.likes;

        // Return likes
        return res.status(200).json({
            success: true,
            likes,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
})


// if post is liked by user
// like a comment
router.get("/isLiked/:id", authenticationMiddleware, async (req, res) => {
    const commentId = req.params.id;

    try {
        // get user (guaranteed to exist due to middleware)
        // + im lazy
        const userId = req.user.id;

        const commentModel = await CommentModel.findOne({ _id: commentId });
        const isLiked = commentModel.likes.includes(userId)

        // Return new number of likes
        return res.status(200).json({
            success: true,
            isLiked: isLiked,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
})


// delete a comment
router.delete("/delete/:id", authenticationMiddleware, async (req, res) => {
    const commentId = req.params.id;
    const userId = req.user.id;

    try {
        // get the comment
        const comment = await CommentModel.findOne({ _id: commentId })
            .populate('user')
            .select("+user");
        // check if the comment exists
        if (!comment) {
            return res.status(400).json({
                success: false,
                error: 'Comment does not exist'
            });
        }

        // delete the comment from the post
        const post = await PostModel.findOne({ _id: comment.post });
        if (!post) {
            return res.status(400).json({
                success: false,
                error: 'Post does not exist'
            });
        }

        await PostInteractionsModel.updateOne(
            { _id: post.interactions },
            { $pull: { comments: commentId } }
        );

        // check if the user is the owner of the comment
        if (comment.user._id != userId) {
            return res.status(401).json({
                success: false,
                error: 'User is not the owner of the comment'
            });
        }

        // we need to delete all the replies, subreplies, etc.
        // we will use a recursive function to do this
        const deleteReplies = async (id) => {
            const comment = await CommentModel.findOne({ _id: id })
                .populate('replies')
                .select("+replies");

            if (comment) {
                // delete all the replies
                for (const replyId of comment.replies) {
                    await deleteReplies(replyId);
                }
                // delete the comment
                await CommentModel.deleteOne({ _id: id });
            }
        }

        // delete the comment
        await deleteReplies(commentId);

        // Return success
        return res.status(200).json({
            success: true,
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