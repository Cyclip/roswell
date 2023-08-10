import React, { useState, useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BsClock } from "react-icons/bs";
import User from "./User";
import { timeDifference } from "../utils/timeUtils";
import LikeItem from "./LikeItem";
import Comment from "./Comment";
import SaveItem from "./SaveItem";
import "../styles/Post.css";

const Post = ({ post }) => {
    const { user } = useContext(UserContext);
    const [postData, setPostData] = useState(post);

    return (
        <div className="post">
            <div className="post_header">
                <User 
                    user={post.author}
                    displayName={true}
                    link={true}
                    subtitle={
                        <div className="post_subtitle">
                            <BsClock className="post_subtitle_icon" />
                            <div className="post_subtitle_text">
                                {timeDifference(post.createdAt)}
                            </div>
                        </div>
                    }
                />
            </div>

            <div className="post_content">
                <h2 className="post_title">{post.content.title}</h2>
                <p className="post_body">{post.content.body}</p>
                <div className="post_fadeout"></div>
            </div>

            <div className="post_interactions">
                <LikeItem post={post} setPostInteractions={
                    (newPost) => {
                        setPostData(newPost);
                    }
                }/>
                {/* <Comment post={post} />
                <SaveItem post={post} /> */}
            </div>
        </div>
    );
};

export default Post;