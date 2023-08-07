import React, { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import { BsReplyFill } from "react-icons/bs";
import "../styles/CommentInteraction.css"
import { toast } from "react-hot-toast";
import { useMediaQuery } from 'react-responsive'

const Reply = ({ handleReply }) => {
    const { user } = useContext(UserContext);

    return (
        <div className="comment_interaction"
            onClick={handleReply}
        >
            <BsReplyFill className="comment_interaction-icon" />
            Reply
        </div>
    );
}

export default Reply;