import mongoose from "mongoose";
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        select: false
    },
    type: {
        type: String,
        enum: ["comment", "likes", "follow", "penalty", "punishment", "system"],
        required: true
    },
    // who triggered the notification
    source: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: false
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    link: {
        type: String,
        required: false,
        default: null,
    }
});

export default mongoose.model('Notification', NotificationSchema);