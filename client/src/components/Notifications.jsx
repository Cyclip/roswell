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
    
    const fetchNotifications = async () => {
        const response = await getUnreadNotifications(user.token);
        if (response.success) {
            setNotifications(response.notifications);
        } else {
            console.log(response.message);
            toast.error("Failed to fetch notifications");
        }
    };
    
    useEffect(() => {
        fetchNotifications();
    }, []);

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