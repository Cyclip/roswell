import React, { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import { likePost } from "../services/post";
import { GoHeartFill } from "react-icons/go";
import "../styles/LikePost.css"
import { isLiked } from "../services/post";

const LikePost = ({ post, setPostInteractions }) => {
    const { user } = useContext(UserContext);

    const [liked, setLiked] = useState(
        false
    );

    useEffect(() => {
        if (!user) return;
        // post may not have been loaded yet, so check if it exists
        if (!post) return;
        console.log(isLiked(post, user.id));

        setLiked(isLiked(post, user.id));
    }, [user, post]);

    const handleLike = async () => {
        if (!user) return;
        const resp = await likePost(post.id, user.token);
        if (resp.success) {
            setPostInteractions(resp.postInteractions);
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
                {post.interactions.likes.length} {post.interactions.likes.length === 1 ? " like" : " likes"}
            </div>
        </div>
    );
}

export default LikePost;