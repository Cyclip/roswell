import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { BiSolidUserCircle } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { CgLogOut } from "react-icons/cg";
import "../styles/UserDropdown.css";

const UserDropdownItem = ({ icon, text, link }) => {
    const navigate = useNavigate();

    const nav = () => {
        navigate(link);
    }

    return (
        <div className="user_dropdown_item"
            onClick={nav}
        >
            <div className="user_dropdown_item_icon">
                {icon}
            </div>
            <div className="user_dropdown_item_text">
                {text}
            </div>
        </div>
    );
}

const UserDropdown = () => {
    const { user } = useContext(UserContext);
    const { username } = user;

    return (
        <div className="user_dropdown">
            <UserDropdownItem icon={<BiSolidUserCircle />} text="Profile" link={`/user/${username}`} />
            <UserDropdownItem icon={<FiSettings />} text="Settings" link={`/user/${username}/settings`} />
            <UserDropdownItem icon={<CgLogOut />} text="Logout" link="/logout" />
        </div>
    );
}

export default UserDropdown;