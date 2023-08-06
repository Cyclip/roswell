import React from "react";
import "../styles/User.css"
import { Link } from "react-router-dom";

import {
    MdAdminPanelSettings
} from "react-icons/md";

const DEFAULT_PFP = "/images/pfp.png";

const User = ({ user, displayName }) => {
    return (
        <Link to={`/user/${user.username}`} className="user">
            <div className="user_profile_picture">
                <img src={
                    user.profilePicture ? user.profilePicture : DEFAULT_PFP
                } alt="profile_picture" />
            </div>
            {
                displayName ? (
                    <div className={
                        "user_username" + (user.role === "admin" ? " user_admin" : "")
                    }>
                        {user.username} {
                            user.role === "admin" ? <MdAdminPanelSettings className="user_admin"/> : null
                        }
                    </div>
                ) : null
            }
        </Link>
    );
}

export default User;