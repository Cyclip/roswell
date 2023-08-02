import React, { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import { FaCommentDots } from "react-icons/fa";
import "../styles/CommentCount.css"
import { useNavigate } from "react-router-dom";

const CommentCount = ({ post }) => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const handleOnClick = () => {
        navigate(`/post/${post.id}`);
    }

    return (
        <div className="comment_count" onClick={handleOnClick}>
            <FaCommentDots className="comment_count-icon" />
            <div className="comment_count-count">
                {post.interactions.comments.length} {post.interactions.comments.length === 1 ? " comment" : " comments"}
            </div>
        </div>
    );
}

export default CommentCount;