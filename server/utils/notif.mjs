import NotificationModel from "../db/models/NotificationModel.mjs";
import UserModel from "../db/models/UserModel.mjs";

const LIKES_MILESTEONES = [1, 5, 10, 25, 50, 100, 250, 500, 1000];

// send a notification to a user
// params:
// - user: user to send notification to
// - type: type of notification
// - source: who triggered the notification
// - title: title of notification
// - content: content of notification
export const sendNotification = async (user, type, source, title, content, link) => {
    const notification = new NotificationModel({
        user: user,
        type: type,
        source: source,
        title: title,
        content: content,
        link: link
    });
    await notification.save();

    // add notification to user's notifications
    await UserModel.updateOne({ _id: user }, { $push: { notifications: notification } });

    return notification;
}

// read a notification
// params:
// - id: id of notification to read
export const readNotification = async (id) => {
    const notification = NotificationModel.findOne({ _id: id });
    notification.read = true;
    await notification.save();

    return notification;
}

// handle likes milestones
// params:
// - author: author of post
// - postInteractions: interactions of post
export const handleLikesMilestones = async (post, postInteractions) => {
    const author = post.author;
    const likes = postInteractions.likes.length;
    const lastLikesMilestone = postInteractions.lastLikesMilestone;

    // check if next likes milestone has been reached
    if (LIKES_MILESTEONES.includes(likes) && likes > lastLikesMilestone) {
        // send notification to author
        await sendNotification(author, "likes", null, `${likes} likes`, `Your post has reached ${likes} ${
            likes === 1 ? "like" : "likes"
        }!`, `/post/${post._id}`);

        // update last likes milestone
        postInteractions.lastLikesMilestone = likes;
        await postInteractions.save();
    }
}