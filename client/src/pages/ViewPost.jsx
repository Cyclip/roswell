import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import "../styles/ViewPost.css"
import { getPost } from "../services/post";
import User from "../components/User";
import LikePost from "../components/LikePost";

/*
Example post
{
    "id": "64ca23bbcc12e40ac628d2aa",
    "content": {
        "_id": "64ca23bbcc12e40ac628d2a9",
        "type": "Content",
        "title": "awdawd",
        "body": "",
        "image": null,
        "__v": 0
    },
    "interactions": {
        "_id": "64ca23bbcc12e40ac628d2a8",
        "likes": [],
        "saves": [],
        "comments": [],
        "__v": 0
    },
    "author": {
        "_id": "64c9b6ff348d1bc6ef1f0b2a",
        "username": "admin",
        "role": "user",
        "profilePicture": "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg",
        "__v": 0
    }
}
*/

const ViewPost = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const { id } = useParams();
    // get post
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            console.log("fetching post");
            const resp = await getPost(id);
            console.log(resp);
            if (resp.success) {
                setPost(resp.post);
            } else {
                navigate("/feed");
            }
        }
        fetchPost();
    }, [id, navigate]);

    const postContents = (
        <div className="view_post-post_header">
            <User user={post?.author} />

            <div className="view_post-post_header_content">
                <h2>{post?.content.title}</h2>
                <p>{post?.content.body}</p>
            </div>

            <div className="view_post-post_header_image">

            </div>

            <div className="view_post-post_header_interactions">
                <LikePost
                    post={post} 
                    setPostInteractions={(interactions) => {
                        setPost({
                            ...post,
                            interactions
                        });
                    }}
                />
            </div>
        </div>
    );

    return (
        <div className="view_post">
            <div className="view_post_content">
                <div className="view_post-post">
                    <div className="view_post-post_contents">
                        {
                            post && postContents
                        }
                    </div>
                </div>
                <div className="view_post-sidebar">

                </div>
            </div>
        </div>
    );

}

export default ViewPost;