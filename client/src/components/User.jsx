import React from "react";
import "../styles/User.css"
import { Link } from "react-router-dom";
import DefaultPfp from "../assets/pfp.png";
import {
    MdAdminPanelSettings
} from "react-icons/md";

const User = ({ user, displayName }) => {
    return (
        <Link to={`/user/${user.username}`} className="user">
            <div className="user_profile_picture">
                <img src={user.profilePicture} alt="profile_picture"
                    // fall back to default pfp if no profile picture
                    onError={(e) => {
                        e.target.src = DefaultPfp;
                    }}
                />
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