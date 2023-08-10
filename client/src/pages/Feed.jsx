import React, { useState, useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loading from "../assets/loading.svg";

import FeedPostsPane from "../components/FeedPostsPane";
import FeedSidebar from "../components/FeedSidebar";

import "../styles/Feed.css";

const Feed = () => {
    const { user } = useContext(UserContext);

    return (
        <div className="feed">
            <FeedPostsPane />
            <FeedSidebar />
        </div>
    );
};

export default Feed;