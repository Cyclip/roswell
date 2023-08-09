import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import "../styles/ViewPost.css"
import { getPost } from "../services/post";
import { submitComment, getComments } from "../services/comment";
import User from "../components/User";
import LikeItem from "../components/LikeItem";
import CommentCount from "../components/CommentCount";
import SaveItem from "../components/SaveItem";
import AddComment from "../components/AddComment";
import Comment from "../components/Comment";
import Loading from "../assets/loading.svg";

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
    const [comments, setComments] = useState(null);

    const loadComments = async () => {
        const resp = await getComments(id, 1, 100);
        if (resp.success) {
            let comments = moveComments(resp.data || [])
            setComments(comments);
        }
    }

    const moveComments = (comments) => {
        if (!user.isLoggedIn) return comments;
        // comments are already sorted by likes
        // we want to move comments that are by the user to the top
        return comments.sort((a, b) => {
            if (a.user.id === user.id) return -1;
            if (b.user.id === user.id) return 1;
            return 0;
        });
    }

    useEffect(() => {
        const fetchPost = async () => {
            const resp = await getPost(id);
            if (resp.success) {
                setPost(resp.post);
            } else {
                navigate("/feed");
            }
        }

        fetchPost();
        loadComments();
    }, [id, navigate]);

    const addComment = (comment) => {
        setComments([
            comment,
            ...comments,
        ]);
    }

    const submitComment_ = (comment) => {
        const resp = submitComment(id, comment, user.token);
        // return promise
        return resp;
    }

    const deleteComment = (commentId) => {
        setComments(comments.filter(comment => comment._id !== commentId));
    }

    const postContents = (
        <div className="view_post-post_header">
            <User user={post?.author} displayName={true} />

            <div className="view_post-post_header_content">
                <h2>{post?.content.title}</h2>
                <p>{post?.content.body}</p>
            </div>

            <div className="view_post-post_header_image">

            </div>

            <div className="view_post-post_header_interactions">
                <LikeItem
                    post={post} 
                    setPostInteractions={(interactions) => {
                        setPost({
                            ...post,
                            interactions
                        });
                    }}
                />

                <CommentCount post={post} />

                <SaveItem post={post} />
            </div>
        </div>
    );

    const commentsLoading = (
        <div className="view_post-post_comments_info">
            <img src={Loading} alt="loading" />
            <p> Loading comments... </p>
        </div>
    );

    const noComments = (
        <div className="view_post-post_comments_info">
            <h2>No comments yet</h2>
            <p>
                Be the first to comment on this post!
            </p>
        </div>
    )

    return (
        <div className="view_post">
            <div className="view_post_content">
                <div className="view_post-post">
                    <div className="view_post-post_contents">
                        {
                            post && postContents
                        }
                    </div>

                    <div className="view_post-post_comments">
                        {
                            post && <AddComment
                                submitCommentProp={submitComment_}
                                addComment={addComment}
                            />
                        }

                        <div className="view_post-post_comments_list">
                            {
                                /*
                                comments is null: loading
                                comments is empty: no comments
                                comments is not empty: comments
                                */
                                comments === null ? commentsLoading : (
                                    comments.length === 0 ? noComments : (
                                        comments.map((comment, idx) => (
                                            <Comment
                                                comment={comment}
                                                key={idx}
                                                deleteId={deleteComment}
                                            />
                                        ))
                                    )
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="view_post-sidebar">

                </div>
            </div>
        </div>
    );

}

export default ViewPost;