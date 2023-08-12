import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import User from "./User";
import { timeDifference } from "../utils/timeUtils";
import LikeComment from "./LikeComment";
import Reply from "./Reply";
import Report from "./Report";
import Delete from "./Delete";
import AddComment from "./AddComment";
import { replyToComment, getReplies } from "../services/reply";
import { likeComment, deleteComment } from "../services/comment";
import { toast } from "react-hot-toast";

import "../styles/Comment.css"

// **NEW** comment component
const Comment = ({ comment, depth, deleteId }) => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
   // number of likes
    const [likes, setLikes] = useState(comment.likes);
    // all replies
    const [replies, setReplies] = useState(comment.replies || []);
    // are the replies shown?
    const [showReplies, setShowReplies] = useState(false);
    // is the reply box shown?
    const [showReplyBox, setShowReplyBox] = useState(false);
    // have the replies been loaded?
    const [repliesLoaded, setRepliesLoaded] = useState(false);
    // options dropdown open?
    const [optionsOpen, setOptionsOpen] = useState(false);

    const userOwnsComment = user.isLoggedIn && user.id === comment.user._id;
    // default depth to 0
    depth = depth || 0;

    // load replies
    const loadReplies = async () => {
        const resp = await getReplies(comment._id);
        if (resp.success) {
            setReplies(resp.data || []);
        }
    }
    
    useEffect(() => {
        // load replies if they haven't been loaded yet
        if (!repliesLoaded) {
            loadReplies();
            setRepliesLoaded(true);
        }
    }, []);

    // reply to comment
    const reply = async (content) => {
        try {
            return replyToComment(
                comment.post,
                comment._id,
                content,
                user.token
            );
        } catch (error) {
            console.log(error);
        }
    }

    // add reply to replies to top
    const addReply = (reply) => {
        setReplies([reply, ...replies]);
        setShowReplyBox(false);
        // force replies to be shown
        if (!showReplies) {
            toggleReplies();
        }
    }

    // toggle reply box
    const toggleReplyBox = () => {
        if (!user.isLoggedIn) {
            navigate("/login");
        } else {
            setShowReplyBox(!showReplyBox);
        }
    }

    // toggle replies
    const toggleReplies = async () => {
        // if replies haven't been loaded yet, load them
        if (!repliesLoaded) {
            // load replies for each of the comments
            await loadReplies();
            setRepliesLoaded(true);
        }

        setShowReplies(!showReplies);
    }
    
    // like comment (toggles)
    const like = async() => {
        if (!user.isLoggedIn) {
            navigate("/login");
        } else {
            const resp = await likeComment(comment._id, user.token);
            if (resp.success) {
                // update likes
                setLikes(resp.likes);
            } else {
                toast.error("Error liking comment");
                console.log(resp);
            }
        }
    }

    const handleReport = () => {}
    const handleDelete = () => {
        // does user own comment?
        if (userOwnsComment || user.role === "admin") {
            // promise toast
            toast.promise(
                deleteComment(comment._id, user.token),
                {
                    loading: "Deleting comment...",
                    success: "Comment deleted",
                    error: "Couldn't delete your comment",
                }
            ).then((resp) => {
                if (resp.success) {
                    // delete this comment from the parent's replies
                    deleteId(comment._id);
                }
            });

        } else {
            toast.error("You can't delete this comment");
        }
    }

    const deleteReply = (replyId) => {
        // delete reply from replies
        setReplies(replies.filter((reply) => reply._id !== replyId));
    }

    const optionsDropdown = (
        <div className="comment-options-dropdown">
            {
                (userOwnsComment || user.role === "admin") && (
                    <Delete handleDelete={handleDelete} />
                )
            }
            <Report handleReport={handleReport} />
        </div>
    );

    const closeOptions = (e) => {
        if (e.target.className !== "comment-options-button btn-transparent") {
            setOptionsOpen(false);
        }
    }

    return (
        <div className="comment"
            onClick={closeOptions}
        >
            { optionsOpen && optionsDropdown }
            
            <div className="comment-header">
                <div className="comment-author">
                    <User user={comment.user} displayName={true} />
                    <p className="comment-date">{timeDifference(comment.createdAt)}</p>
                </div>

                <div className="comment-options">
                    <button className="comment-options-button btn-transparent"
                        onClick={() => setOptionsOpen(!optionsOpen)}
                    >...</button>
                </div>
            </div>

            <p className="comment-content">{comment.body}</p>

            <div className="comment-interactions">
                <div className="left">
                    <LikeComment likes={likes} like={like} />

                    <div style={{
                        color: showReplyBox ? "var(--accent-blue" : "inherit"
                    }}>
                        <Reply
                            handleReply={toggleReplyBox}
                        />
                    </div>
                </div>
            </div>

            <div className="comment-reply-to">
                {
                    showReplyBox && (
                        <AddComment
                            submitCommentProp={reply}
                            addComment={addReply}
                            canCancel={true}
                            onCancel={toggleReplyBox}
                            placeholder={"Reply to " + comment.user.username}
                        />
                    )
                }
            </div>

            <div className="comment-replies">
                {
                    replies.length > 0 && (
                        <button
                            className="comment-replies-button btn-transparent"
                            onClick={toggleReplies}
                        >
                            {showReplies ? "Hide" : "View"} {replies?.length} {replies.length === 1 ? "reply" : "replies"}
                        </button>
                    )
                }

                {
                    replies.length > 0 && showReplies && (
                        replies.map((reply) => (
                            <Comment
                                comment={reply}
                                key={reply._id}
                                depth={depth + 1}
                                deleteId={deleteReply}
                            />
                        ))
                    )
                }
            </div>
        </div>
    )
}

export default Comment;