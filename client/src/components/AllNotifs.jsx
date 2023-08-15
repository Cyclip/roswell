import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getNotifications, readNotification } from "../services/notif";
import { UserContext } from "../contexts/UserContext";
import { IoIosNotifications } from "react-icons/io";
import { toast } from "react-hot-toast";
import Loading from "../assets/loading.svg";
import { MdOutlineMarkChatRead } from "react-icons/md";
import Notif from "./Notif";

import "../styles/UnreadNotifs.css";

const AllNotifs = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [notifs, setNotifs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // load notifications
        if (user.isLoggedIn) {
            getNotifications(user.token)
                .then((res) => {
                    setNotifs(res.notifications);
                    setIsLoading(false);
                })
                .catch((err) => {
                    toast.error(err.response.data.message);
                    setIsLoading(false);
                });
        } else {
            toast.error("You must be logged in to view notifications");
            navigate("/login");
        }
    }, [user]);

    const delNotif = (id) => {
        setNotifs(notifs.filter((notif) => notif._id !== id));
    }

    const markAllRead = () => {
        readNotification("", user.token)
            .then((res) => {
                if (res.success) {
                    toast.success(res.message);
                } else {
                    toast.error(res.message);
                }
            })
            .catch((err) => {
                toast.error(err.response.data.message);
            });
    }

    return (
        <div className="unread-notifs">
            {
                isLoading ? (
                    <div className="loading-container">
                        <img src={Loading} alt="loading" />
                    </div>
                ) : null
            }
            {
                !isLoading && notifs.length === 0 ? (
                    <div className="no-notifs">
                        <h2>You have no notifications right now.</h2>
                    </div>
                ) : null
            }

            <div className="notifs-container">
                {
                    notifs.length > 0 ? (
                        <div className="notifs-mark-all"
                            onClick={markAllRead}
                        >
                            <MdOutlineMarkChatRead size={15} />
                            Mark all as read
                        </div>
                    ) : null
                }
                {
                    notifs.map((notif) => (
                        <Notif notif={notif} key={notif._id} delNotif={delNotif}/>
                    ))
                }
            </div>
        </div>
    );
};

export default AllNotifs;