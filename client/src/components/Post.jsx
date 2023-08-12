import React, { useState, useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { BsFlagFill } from "react-icons/bs";
import toast from "react-hot-toast";
import { BsClock } from "react-icons/bs";
import User from "./User";
import { timeDifference } from "../utils/timeUtils";
import LikeItem from "./LikeItem";
import CommentCount from "./CommentCount";
import SaveItem from "./SaveItem";
import "../styles/Post.css";
import DefaultPfp from "../assets/pfp.png";

const Post = ({ post, following }) => {
    const { user } = useContext(UserContext);
    const [postData, setPostData] = useState(post);

    const navigate = useNavigate();

    // get followings who have also liked this post
    const followingsLikedPost = following?.filter((following) => postData.interactions.likes.includes(following._id)) || [];

    const report = () => {
        
    }

    const followingBanner = (
        <div className="post_following_banner">
            <div className="post_following_banner_pfps">
                {/* display up to 3 different profile pictures */}
                {
                    followingsLikedPost.slice(0, 3).map((following, index) => (
                        <img key={index} className="post_following_banner_pfp" src={following.profilePicture} alt="profile picture" 
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DefaultPfp;
                            }}
                        />
                    ))
                }
            </div>
            <div className="post_following_banner_text">
                {/*  */}

                <ul className="post_following_banner_text_list">
                    {
                        followingsLikedPost.slice(0, 3).map((following, index) => (
                            <li key={index} className="post_following_banner_text_list_item">
                                <span className="post_following_banner_text_list_item_username">{following.username}</span>
                            </li>
                        ))
                    }
                </ul>

                {
                    followingsLikedPost.length > 3 ? (
                        <span> and {followingsLikedPost.length - 3} others</span>
                    ) : followingsLikedPost.length === 1 ? (
                        <span> liked this</span>
                    ) : (
                        <span> liked this</span>
                    )
                }
            </div>
        </div>
    );

    // get followings who have also liked this post
    useEffect(() => {
        if (user) {}
    }, [following]);

    return (
        <div className="post">
            {
                followingsLikedPost.length > 0 &&
                followingBanner
            }
            <div className="post_contents">
                <BsFlagFill className="post_report_icon" 
                    onClick={report}
                />
                <div className="post_clickable"
                    onClick={() => {
                        navigate(`/post/${post._id}`);
                    }}
                >
                    <div className="post_header">
                        <User 
                            user={post.author}
                            displayName={true}
                            link={true}
                            subtitle={
                                <div className="post_subtitle">
                                    <BsClock className="post_subtitle_icon" />
                                    <div className="post_subtitle_text">
                                        Posted {timeDifference(post.createdAt)}
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
                </div>

                <div className="post_interactions">
                    <LikeItem post={postData} setPostInteractions={
                        // update postData.interactions
                        (newInteractions) => {
                            setPostData({
                                ...postData,
                                interactions: newInteractions
                            });
                        }
                    }/>

                    <CommentCount post={post} />

                    <SaveItem post={post} />
                </div>
            </div>


        </div>
    );
};

export default Post;