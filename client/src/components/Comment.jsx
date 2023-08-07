import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import User from "./User";
import { timeDifference } from "../utils/timeUtils";
import LikeComment from "./LikeComment";
import Reply from "./Reply";
import Report from "./Report";
import AddComment from "./AddComment";
import { replyToComment } from "../services/reply";

import "../styles/Comment.css"

const Comment = ({ comment, depth }) => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [likes, setLikes] = useState(comment.likes);
    const [isReplying, setIsReplying] = useState(false);

    // default depth to 0
    depth = depth || 0;

    const handleReply = () => {
        if (!user.isLoggedIn) {
            navigate("/login");
        } else {
            setIsReplying(!isReplying);
        }
    }

    const handleReport = () => {}

    const submitReply = (reply) => {
        // reply to the comment and return a promise
        return replyToComment(
            comment.post,
            comment._id,
            reply,
            user.token
        );
    }

    const addReply = (reply) => {}

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

                    <div style={{
                        color: isReplying ? "var(--accent-blue)" : "inherit"
                    }}>
                        <Reply
                            handleReply={handleReply}
                        />
                    </div>
                </div>

                <Report
                    handleReport={handleReport}
                />

            </div>

            <div className="comment-reply-to">
                {
                    isReplying && (
                        <AddComment
                            submitCommentProp={submitReply}
                            addComment={addReply}
                            canCancel={true}
                            onCancel={handleReply}
                            placeholder={`Reply to ${comment.user.username}`}
                        />
                    )
                }
            </div>
        </div>
    )
}

export default Comment;