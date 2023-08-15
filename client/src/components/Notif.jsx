import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { readNotification } from "../services/notif";
import { UserContext } from "../contexts/UserContext";
import { 
    IoIosNotifications, // default
} from "react-icons/io";
import { IoFootstepsSharp } from "react-icons/io5"; // follow
import {
    GiCharm, // likes
    GiThorHammer, // punishment/penalty
} from "react-icons/gi";
import { TfiComments } from "react-icons/tfi"; // comments
import { toast } from "react-hot-toast";
import { MdOutlineMarkChatRead } from "react-icons/md";
import User from "./User";

import "../styles/Notif.css";
import { parseText } from "../utils/textUtils";

const DEFAULT_ICONS = {
    "likes": <GiCharm size={30} />,
    "follow": <IoFootstepsSharp size={30} />,
    "punishment": <GiThorHammer size={30} />,
    "penalty": <GiThorHammer size={30} />,
    "comment": <TfiComments size={30} />,
    "system": <IoIosNotifications size={30} />,
}

const Notif = ({ notif, delNotif }) => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const showFlare = (
        notif.type === "system" ||
        notif.type === "penalty" ||
        notif.type === "punishment"
    )

    const markRead = (notify) => {
        if (notif.read) return;

        readNotification(notif._id, user.token)
            .then((res) => {
                if (res.success) {
                    if (notify) { toast.success(res.message); }
                    delNotif(notif._id);
                } else {
                    toast.error(res.message);
                }
            })
            .catch((err) => {
                toast.error(err.response.data.message);
            });
    }

    const handleClick = () => {
        if (notif.link !== null) {
            navigate(notif.link);
            markRead(false);
        }
    }

    return (
        <div className={
            "notif" +
            (notif.read ? " read" : "") +
            (notif.link !== null ? " clickable" : "")
        }
            onClick={handleClick}
        >
            <div className="notif_container">
                <div className="notif_image">
                    {
                        notif.source ? (
                            <User user={notif.source} displayName={false}/>
                        ) : (
                            DEFAULT_ICONS[notif.type]
                        )
                    }
                </div>
                <div className="notif_content">
                    <span className="bold notif_title">
                        {notif.title}
                        {
                            showFlare ? (
                                <span className="notif_flare">
                                    {notif.type}
                                </span>
                            ) : null
                        }
                    </span>
                    <span className="notif_content_text">{
                        parseText(notif.content)
                    }</span>
                </div>
            </div>

            {
                !notif.read ? (
                    <div className="notif_mark_read"
                        onClick={() => markRead(true)}
                    >
                        <MdOutlineMarkChatRead size={20} />
                    </div>
                ) : null
            }
        </div>
    );
};

export default Notif;