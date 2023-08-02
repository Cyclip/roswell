import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PostInteractionsSchema = new Schema({
    // All likes
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    // All saves
    saves: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    // All comments
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
});

export default mongoose.model('PostInteractions', PostInteractionsSchema);