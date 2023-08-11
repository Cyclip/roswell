import React, { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../contexts/UserContext";
import { FaCommentDots } from "react-icons/fa";
import "../styles/AddComment.css"
import { useNavigate } from "react-router-dom";
import User from "./User";
import Textarea from 'react-expanding-textarea'
import { useMediaQuery } from 'react-responsive'
import { toast } from 'react-hot-toast';

const AddComment = ({ submitCommentProp, addComment, canCancel, onCancel, placeholder }) => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [comment, setComment] = useState("");
    const textareaRef = useRef(null);
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
    const [isPosting, setIsPosting] = useState(false);

    canCancel = canCancel || false;
    placeholder = placeholder || "Add a comment...";

    const submitComment = () => {
        if (isPosting) return;

        if (comment.length < 3) {
            toast.error("Comment must be at least 3 characters long");
            return;
        };

        setIsPosting(true);

        submitCommentProp(comment).then((resp) => {
            // if comment was successfully submitted
            if (resp.success) {
                setComment("");
                toast.success("Comment posted!");
                addComment(resp.data);
            } else {
                toast.error("Failed to post comment");
                console.log(resp);
            }
            setIsPosting(false);
        }).catch((err) => {
            // check if there is a valid message
            if (err.response.data.message && err.response.data.message.length > 0) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Failed to post comment");
            }
            console.log(err);
            setIsPosting(false);
        });
    }

    const updateComment = (value) => {
        // if longer than 1k char or is submitting
        if (value.length > 1000 || isPosting) return;

        setComment(value);
    }

    const notLoggedIn = (
        <div className="add-comment-not-logged-in">
            <FaCommentDots className="add-comment-not-logged-in-icon" />
            <div className="add-comment-not-logged-in-text">
                <p> Log in to comment </p>
                <button className="btn-primary" onClick={() => navigate("/login")}> Log in </button>
            </div>
        </div>
    );

    return (
        <div className="add-comment">
            <div className="add-comment-container">
                {
                    !isMobile && (
                        <div className="add-comment-user">
                            <User user={user} displayName={false} />
                        </div>
                    )
                }
                <div className="add-comment-text">
                    <Textarea
                        className="add-comment-textarea"
                        placeholder={placeholder}
                        value={comment}
                        onChange={(e) => updateComment(e.target.value)}
                        ref={textareaRef}
                        maxLength={1000}
                        disabled={isPosting}
                    />
                    <div className="add-comment-options">
                        <div className="add-comment-options-left">
                            
                        </div>

                        <div className="add-comment-options-right">
                            {
                                canCancel && (
                                    <button
                                        className="add-comment-cancel btn-transparent"
                                        onClick={onCancel}
                                    > Cancel </button>
                                )
                            }

                            <button
                                className="add-comment-post btn-primary"
                                onClick={submitComment}
                                disabled={comment.length < 3 || isPosting}
                            > Post </button>
                        </div>
                    </div>
                </div>
            </div>

            {
                // if user is not logged in, show not logged in component
                !user.isLoggedIn ? notLoggedIn : null
            }
        </div>
    );
}

export default AddComment;