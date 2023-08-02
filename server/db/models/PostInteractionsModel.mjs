import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PostInteractionsSchema = new Schema({
    // All likes
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    // All saves
    saves: [{
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
});

export default mongoose.model('PostInteractions', PostInteractionsSchema);