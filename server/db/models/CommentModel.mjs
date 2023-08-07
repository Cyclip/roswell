import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    // Post the comment is on
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    // User who created the comment
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Body of the comment
    body: {
        type: String,
        required: [true, 'Please enter a body'],
        maxlength: [1000, 'Body must be less than 1000 characters long']
    },
    // All likes
    likes: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            username: String
        }
    ],
    // All replies
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        select: false,
    }],
    // the parent comment, null if it is a top level comment
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
        select: false,
    },
    // Date the comment was created
    createdAt: {
        type: Date,
        default: Date.now
    },
});

export default mongoose.model('Comment', CommentSchema);