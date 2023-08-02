import mongoose from "mongoose";
const Schema = mongoose.Schema;

/*
Contains information on the content of a post
*/

const PostContentSchema = new Schema({
    // Type of post (text or image)
    type: {
        type: String,
        enum: ['text', 'image'],
        required: [true, 'Please enter a type']
    },
    // Title of the post
    title: {
        type: String,
        required: [true, 'Please enter a title'],
        trim: true,
        maxlength: [100, 'Title must be less than 100 characters long']
    },
    // Body of the post
    body: {
        type: String,
        default: '',
        maxlength: [1000, 'Body must be less than 1000 characters long']
    },
    // Image URL of the post
    image: {
        type: String,
        default: ''
    },
})

export default mongoose.model('PostContent', PostContentSchema);