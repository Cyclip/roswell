import React, { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import { GoHeartFill } from "react-icons/go";
import "../styles/CommentInteraction.css"
import { toast } from "react-hot-toast";
import { useMediaQuery } from 'react-responsive'

const LikeComment = ({ likes, like }) => {
    const { user } = useContext(UserContext);
    const isMobile = useMediaQuery({ query: '(max-width: 468px)' })

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
                "comment_interaction" +
                (isLiked() ? " liked" : "")
            }
            onClick={like}
        >
            <GoHeartFill
                className="comment_interaction-icon"
            />
            <div className="comment_interaction-count">
                {likes?.length} {
                    isMobile ? "" : likes?.length === 1 ? " like" : " likes"
                }
            </div>
        </div>
    );
}

export default LikeComment;