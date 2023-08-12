import React, { useState, useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loading from "../assets/loading.svg";
import { getRecentPosts } from "../services/feed";
import Post from "./Post";
import { PiClockCountdownBold } from "react-icons/pi";

import "../styles/FeedSidebar.css";

const FeedSidebar = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getRecentPosts(user.token)
            .then((res) => {
                setPosts(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                toast.error("Couldn't load recent posts");
                setIsLoading(false);
            });
    }, [user.token]);

    return (
        <div className="feed_sidebar">
            <div className="feed_sidebar_title">
                <PiClockCountdownBold className="feed_sidebar_title_icon" />
                <span>Recent posts</span>
            </div>
            {
                isLoading && <img src={Loading} alt="Loading" className="loading" />
            }

            {
                !isLoading && posts.length === 0 && <div className="feed_sidebar_no_posts">No posts yet</div>
            }

            {
                !isLoading && posts.length > 0 && posts.map((post) => (
                    <Post key={post.id} post={post} />
                ))
            }
        </div>
    );
}

export default FeedSidebar;