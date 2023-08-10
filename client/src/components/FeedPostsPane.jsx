import React, { useState, useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loading from "../assets/loading.svg";
import { getFeed } from "../services/feed";
import Post from "./Post";

import "../styles/FeedPostsPane.css";

const FeedPostsPane = () => {
    const { user } = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [firstPostsLoaded, setFirstPostsLoaded] = useState(false);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    const addPosts = (newPosts) => {
        console.log("adding", newPosts);
        setPosts(posts.concat(newPosts));
    }

    const loadPosts = async () => {
        setIsLoading(true);

        getFeed(user.token)
            .then((response) => {
                if (response.success) {
                    addPosts(response.data.posts);
                    setPage(page + 1);
                } else {
                    toast.error("Couldn't load posts.");
                    console.log(response);
                }
            })
            .catch((error) => {
                toast.error("Couldn't load posts.");
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        // only call loadPosts once at the start
        if (!firstPostsLoaded) {
            setFirstPostsLoaded(true);
            loadPosts();
        }
    }, [firstPostsLoaded]);

    return (
        <div className="feed_posts_pane">
            {
                isLoading ?
                    <div className="loading">
                        <img src={Loading} alt="Loading..." />
                    </div>
                    :
                    posts.length > 0 ? posts.map((post) => (
                        <Post key={post._id} post={post} />
                    ))
                    :
                    <div className="no_posts">
                        <h1>No posts found</h1>
                    </div>
            }
        </div>
    );
}

export default FeedPostsPane;