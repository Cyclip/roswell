import React, { useState, useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loading from "../assets/loading.svg";
import { getFeed } from "../services/feed";
import Post from "./Post";

import "../styles/FeedPostsPane.css";

const SCROLL_THRESHOLD = 50;

const FeedPostsPane = () => {
    const { user } = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [firstPostsLoaded, setFirstPostsLoaded] = useState(false);
    const [reachedEnd, setReachedEnd] = useState(false);
    const navigate = useNavigate();
    const [page, setPage] = useState(0);

    const addPosts = (newPosts) => {
        // dont include old posts
        newPosts = newPosts.filter((newPost) => !posts.some((post) => post._id === newPost._id));

        if (newPosts.length === 0) {
            setReachedEnd(true);
            return;
        }

        // add new posts to the end of the posts array
        setPosts([...posts, ...newPosts]);
    }

    const loadPosts = async () => {
        setIsLoading(true);

        console.log("loading posts on page", page);

        getFeed(page, user.token)
            .then((response) => {
                if (response.success) {
                    addPosts(response.data.posts);
                    setPage(page + 1);
                    toast.success(`Loaded ${response.data.posts.length} posts.`);

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

    // on scroll to bottom, load more posts
    useEffect(() => {
        const onScroll = () => {
            // if reached end, dont load more posts
            if (reachedEnd) return;

            if (
                window.innerHeight + document.documentElement.scrollTop + SCROLL_THRESHOLD >= document.documentElement.offsetHeight
                && !isLoading
            ) {
                loadPosts();
            }
        }

        window.addEventListener("scroll", onScroll);

        return () => window.removeEventListener("scroll", onScroll);
    }, [page]);

    return (
        <div className="feed_posts_pane">
            {
                posts.length > 0 ? posts.map((post) => (
                    <Post key={post._id} post={post} />
                )) : <div className="no_posts">
                    <h1>No posts found</h1>
                </div>
            }

            {
                isLoading ?
                    <div className={
                        posts.length === 0 ? "loading" : "loading loading--small"
                    }>
                        <img src={Loading} alt="Loading..." />
                        {
                            posts.length === 0 ? (
                                <>
                                    <h1>Hang tight..</h1>
                                    <p>
                                        We're preparing your personal feed for you.
                                    </p>
                                </>
                            ) : null
                        }
                    </div>
                    : null
                    
            }

            {
                reachedEnd && (
                    <div className="no_more_posts">
                        <h1>You've reached the end</h1>
                        <p>
                            Congrats! You've reached the end of your feed.
                        </p>
                    </div>
                )
            }
        </div>
    );
}

export default FeedPostsPane;