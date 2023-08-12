import express from "express";
import { authenticationMiddleware, adminMiddleware } from "../middleware/authMiddleware.mjs";
import UserModel from "../db/models/UserModel.mjs";
import NotificationModel from "../db/models/NotificationModel.mjs";
import { sendNotification, readNotification } from "../utils/notif.mjs";

const router = express.Router();

// ==================== ROUTES ====================
// GET all notifications
router.get("/", authenticationMiddleware, async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.user.id })
            .populate({
                path: "notifications",
                populate: {
                    path: "source"
                },
                // sort by createdAt in descending order
                options: { sort: { createdAt: -1 } }
            })
        
            res.status(200).json({
            success: true,
            notifications: user.notifications
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// GET unread notifications
router.get("/unread", authenticationMiddleware, async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.user.id })
            .populate({
                path: "notifications",
                populate: {
                    path: "source"
                },
                // sort by createdAt in descending order
                options: { sort: { createdAt: -1 } }
            })

        const unreadNotifications = user.notifications.filter(notification => !notification.read);

        res.status(200).json({
            success: true,
            notifications: unreadNotifications
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// GET notification by id
router.get("/:id", authenticationMiddleware, async (req, res) => {
    try {
        const notification = await NotificationModel.findOne({ _id: req.params.id })
            .select("+user")
            .populate("source");
        if (!notification) {
            return res.status(400).json({
                success: false,
                message: "Notification does not exist"
            });
        }

        // check if user is the owner of the notification
        if (notification.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // return notification
        return res.status(200).json({
            success: true,
            notification
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// read notification (updates partially)
router.patch("/:id", authenticationMiddleware, async (req, res) => {
    try {
        const notification = await NotificationModel.findOne({ _id: req.params.id })
            .select("+user");
        if (!notification) {
            return res.status(400).json({
                success: false,
                message: "Notification does not exist"
            });
        }

        console.log("reading", notification);

        // check if user is the owner of the notification
        if (notification.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // update notification
        notification.read = true;
        await notification.save();

        // return success
        return res.status(200).json({
            success: true,
            message: "Marked as read",
            notification
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// read all notifications
router.patch("/", authenticationMiddleware, async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.user.id })
            .populate("notifications");
        
        // update notifications
        user.notifications.forEach(notification => {
            notification.read = true;
            notification.save();
        });

        // return success
        return res.status(200).json({
            success: true,
            message: "Marked all as read"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// create notification
router.post("/", [authenticationMiddleware, adminMiddleware], async (req, res) => {
    try {
        const user = req.body.user;
        const type = req.body.type || "system";
        const source = req.body.source;
        const title = req.body.title || "Notification";
        const content = req.body.content || "";
        const link = req.body.link || null;

        // ensure user exists
        const userExists = await UserModel.exists({ _id: user });

        if (!userExists) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }

        // send notification
        sendNotification(user, type, source, title, content, link);

        // return success
        return res.status(200).json({
            success: true,
            message: "Notification sent"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


// ==================== EXPORTS ====================
export default router;