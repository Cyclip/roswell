import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import User from "./User";
import { timeDifference } from "../utils/timeUtils";
import LikeComment from "./LikeComment";

import "../styles/Comment.css"
import { isLiked } from "../services/comment";

const Comment = ({ comment }) => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [likes, setLikes] = useState(comment.likes);

    console.log("comment loaded", comment);

    return (
        <div className="comment">
            <div className="comment-header">
                <div className="comment-author">
                    <User user={comment.user} displayName={true} />
                    <p className="comment-date">{timeDifference(comment.createdAt)}</p>
                </div>
                <div className="comment-options">
                    <button className="comment-options-button btn-transparent">...</button>
                </div>
            </div>
            <p className="comment-content">{comment.body}</p>
            <div className="comment-interactions">
                <LikeComment
                    comment={comment}
                    likes={likes}
                    setLikes={setLikes}
                />

            </div>
        </div>
    )
}

export default Comment;