import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PostInteractionsSchema = new Schema({
    // All likes
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    // All comments
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: []
    }],
    // Number of saves
    saves: {
        type: Number,
        default: 0
    },
    // last likes milestone
    lastLikesMilestone: {
        type: Number,
        default: 0
    },
});

export default mongoose.model('PostInteractions', PostInteractionsSchema);