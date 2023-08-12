import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUnreadNotifications } from "../services/notif";
import { UserContext } from "../contexts/UserContext";
import { IoIosNotifications } from "react-icons/io";
import { toast } from "react-hot-toast";

import "../styles/Notifications.css"

const Notifications = () => {
    const { user } = useContext(UserContext);
    const [notifications, setNotifications] = useState([]);
    const [newImportantNotif, setNewImportantNotif] = useState(0);

    const fetchNotifications = async () => {
        const response = await getUnreadNotifications(user.token);
        if (response.success) {
            setNotifications(response.notifications);
            checkImportantNotifications(notifications);
        } else {
            console.log(response.message);
            toast.error("Failed to fetch notifications");
        }
    };

    const isImportant = (notif) => {
        return (
            notif.type === "system" ||
            notif.type === "penalty" ||
            notif.type === "punishment"
        )
    }

    const checkImportantNotifications = (notifications) => {
        // get number of new important notifications
        const importantNotifications = notifications.filter((notif) => isImportant(notif) && !notif.read);
        if (importantNotifications.length > newImportantNotif) {
            setNewImportantNotif(importantNotifications.length);
            // continue
        } else {
            setNewImportantNotif(importantNotifications.length);
            return;
        }

        if (importantNotifications.length > 0) {
            toast(
                (t) => (
                    <div className="important-notif">
                        <h3>
                            {importantNotifications.length} important {
                                importantNotifications.length === 1 ? "notification" : "notifications"
                            }
                        </h3>
                        <p>
                            Please review them in the <Link to="/notifications">notifications page</Link>
                        </p>
                    </div>
                ),
                {
                    duration: 15000,
                    icon: "⚠️",
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                    iconTheme: {
                        primary: "#fff",
                        secondary: "#333",
                    },
                }
            )
        }
    };

    useEffect(() => {
        // Fetch notifications when the component first mounts
        fetchNotifications();

        // Set up a periodic interval to update notifications
        const interval = setInterval(() => {
            fetchNotifications();
        }, 10000);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(interval);
        };
    }, [notifications]);

    return (
        <div className="notifications_container">
            <Link to="/notifications">
                <IoIosNotifications className="notifications_icon" />
            </Link>
            {
                notifications.length > 0 ? (
                    <div className="notifications_badge">
                        {notifications.length}
                    </div>
                ) : null
            }
        </div>
    );
};

export default Notifications;
