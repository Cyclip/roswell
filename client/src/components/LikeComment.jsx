import React, { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import { GoHeartFill } from "react-icons/go";
import "../styles/CommentInteraction.css"
import { toast } from "react-hot-toast";
import { useMediaQuery } from 'react-responsive'
import { likeComment, unlikeComment, isLiked } from "../services/comment";

const LikeComment = ({ comment, likes, setLikes }) => {
    const { user } = useContext(UserContext);
    const isMobile = useMediaQuery({ query: '(max-width: 468px)' })

    const handleLike = async() => {
        if (!user.isLoggedIn) return;
        const resp = await likeComment(comment._id, user.token);

        if (resp.success) {
            setLikes(resp.likes || []);
        } else {
            toast.error("Error while liking comment");
        }
    }

    const isLiked = () => {
        if (!user.isLoggedIn) return false;
        try {
            return likes.findIndex((i) => i.userId === user.id) >= 0;
        } catch(err) {
            console.log("error checking if liked", err);
        }
    }

    return (
        <div
            className={
                "like_comment" +
                (isLiked() ? " liked" : "")
            }
            onClick={handleLike}
        >
            <GoHeartFill
                className="like_comment-icon"
            />
            <div className="like_comment-count">
                {likes?.length} {
                    isMobile ? "" : likes?.length === 1 ? " like" : " likes"
                }
            </div>
        </div>
    );
}

export default LikeComment;