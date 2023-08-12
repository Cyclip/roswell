import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUnreadNotifications } from "../services/notif";
import { UserContext } from "../contexts/UserContext";
import { IoIosNotifications } from "react-icons/io";
import { toast } from "react-hot-toast";

import UnreadNotifs from "../components/UnreadNotifs";

import "../styles/NotificationsPage.css"

const Notifications = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    
    const [tab, setTab] = useState("unread");

    useEffect(() => {
        if (!user.isLoggedIn) {
            navigate("/login");
        }
    }, [user, navigate]);

    return (
        <div className="notifications-page">
            <div className="notifications-container">
                <div className="notifications-header">
                    <h1>Notifications</h1>
                    <div className="notifications-tabs">
                        <button
                            className={tab === "unread" ? "btn-primary" : ""}
                            onClick={() => setTab("unread")}
                        >
                            Unread
                        </button>
                        <button
                            className={tab === "all" ? "btn-primary" : ""}
                            onClick={() => setTab("all")}
                        >
                            All
                        </button>
                    </div>
                </div>

                {
                    tab === "unread" ? <UnreadNotifs /> : null
                }
            </div>
        </div>
    )
};

export default Notifications;