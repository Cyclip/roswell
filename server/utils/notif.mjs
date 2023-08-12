import NotificationModel from "../db/models/NotificationModel.mjs";
import UserModel from "../db/models/UserModel.mjs";

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