import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import User from "./User";
import { timeDifference } from "../utils/timeUtils";
import LikeComment from "./LikeComment";
import Reply from "./Reply";
import Report from "./Report";

import "../styles/Comment.css"
import { isLiked } from "../services/comment";

const Comment = ({ comment }) => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [likes, setLikes] = useState(comment.likes);

    const handleReply = () => {
        if (!user.isLoggedIn) {
            navigate("/login");
        } else {
            navigate(`/post/${comment.postId}?replyTo=${comment._id}`);
        }
    }

    const handleReport = () => {

    }

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
                <div className="left">
                    <LikeComment
                        comment={comment}
                        likes={likes}
                        setLikes={setLikes}
                    />

                    <Reply
                        handleReply={handleReply}
                    />
                </div>

                <Report
                    handleReport={handleReport}
                />

            </div>
        </div>
    )
}

export default Comment;