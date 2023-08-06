import React, { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import { savePost, isSaved } from "../services/post";
import {
    BsBookmark,
    BsBookmarkFill
} from "react-icons/bs";
import "../styles/SavePost.css"
import { toast } from "react-hot-toast";
import { useMediaQuery } from 'react-responsive'

const SavePost = ({ post }) => {
    const { user } = useContext(UserContext);
    const [saves, setSaves] = useState(post.interactions.saves || 0);
    const [saved, setSaved] = useState(false);
    const isMobile = useMediaQuery({ query: '(max-width: 468px)' })

    const updateSaved = async () => {
        if (!user) return;
        isSaved(post.id, user.token).then(resp => {
            if (resp.success) {
                setSaved(resp.saved);
            }
        });
    }

    useEffect(() => {
        if (!user) return;
        if (!post) return;
        updateSaved();
    }, [post, user]);

    const handleSave = async () => {
        if (!user) return;
        const resp = await savePost(post.id, user.token);
        if (resp.success) {
            setSaved(resp.isSaved);
            setSaves(resp.saves);
        } else {
            toast.error("Error saving post");
            console.log(resp);
        }
    }

    return (
        <div
            className={
                "save_post" +
                (saved ? " saved" : "")
            }
            onClick={handleSave}
        >
            {
                saved ?
                    <BsBookmarkFill
                        className="save_post-icon"
                        style={{ color: "var(--text-color-accent2)" }}
                        onClick={handleSave}
                    />
                    :
                    <BsBookmark
                        className="save_post-icon"
                        onClick={handleSave}
                    />
            }
            <div className="save_post-count">
                {saves} {
                    isMobile ? "" : saves === 1 ? " save" : " saves"
                }
            </div>
        </div>
    );
}

export default SavePost;