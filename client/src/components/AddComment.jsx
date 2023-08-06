import React, { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import { FaCommentDots } from "react-icons/fa";
import "../styles/AddComment.css"
import { useNavigate } from "react-router-dom";
import User from "./User";

const AddComment = ({ post, setPostInteractions }) => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [comment, setComment] = useState("");

    return (
        <div className="add-comment">
            <div className="add-comments-container">
                <User user={user} displayName={false} />
            </div>
        </div>
    );
}

export default AddComment;