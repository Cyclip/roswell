import React, { useState, useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loading from "../assets/loading.svg";

import "../styles/FeedSidebar.css";

const FeedSidebar = () => {
    const { user } = useContext(UserContext);

    return (
        <div className="feed_sidebar">
            <h1>Feed sidebar</h1>
        </div>
    );
}

export default FeedSidebar;