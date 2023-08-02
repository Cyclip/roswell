import mongoose from "mongoose";
const Schema = mongoose.Schema;

/*
This is the overall Post model, linking
to various other Post models
*/
const PostSchema = new Schema({
    // User who created the post
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Content of the post
    content: {
        type: Schema.Types.ObjectId,
        ref: 'PostContent',
        required: true
    },
    // Interactions of the post
    interactions: {
        type: Schema.Types.ObjectId,
        ref: 'PostInteractions',
        required: true,
        // default
        default: {
            likes: [],
            saves: [],
            comments: []
        }
    },
    // Date the post was created
    createdAt: {
        type: Date,
        default: Date.now
    },
})

export default mongoose.model('Post', PostSchema);