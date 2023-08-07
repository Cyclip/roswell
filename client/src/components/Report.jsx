import React, { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import { BsFillFlagFill } from "react-icons/bs";
import "../styles/CommentInteraction.css"
import { toast } from "react-hot-toast";
import { useMediaQuery } from 'react-responsive'

const Report = ({ handleReport }) => {
    const { user } = useContext(UserContext);

    return (
        <div className="comment_interaction report-interaction"
            onClick={handleReport}
        >
            <BsFillFlagFill className="comment_interaction-icon" />
            Report
        </div>
    );
}

export default Report;