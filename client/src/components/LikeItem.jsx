import React, { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import { likePost } from "../services/post";
import { GoHeartFill } from "react-icons/go";
import "../styles/LikePost.css"
import { isLiked } from "../services/post";
import { toast } from "react-hot-toast";
import { useMediaQuery } from 'react-responsive'

const LikeItem = ({ post, setPostInteractions }) => {
    const { user } = useContext(UserContext);
    const isMobile = useMediaQuery({ query: '(max-width: 468px)' })

    const [liked, setLiked] = useState(
        false
    );

    useEffect(() => {
        // post may not have been loaded yet, so check if it exists
        if (!post) return;
        setLiked(isLiked(post, user.id));
    }, [user, post]);

    const handleLike = async () => {
        if (!user.isLoggedIn) return;

        const resp = await likePost(post.id, user.token);
        if (resp.success) {
            setPostInteractions(resp.postInteractions);
        } else {
            console.log(resp.message);
            toast.error("Error liking post");
        }
    }

    return (
        <div
            className={
                "like_post" +
                (liked ? " liked" : "")
            }
            onClick={handleLike}
        >
            <GoHeartFill
                className="like_post-icon"
                onClick={handleLike}
            />
            <div className="like_post-count">
                {post.interactions.likes.length} {
                    isMobile ? "" : post.interactions.likes.length === 1 ? " like" : " likes"
                }
            </div>
        </div>
    );
}

export default LikeItem;