import React, {
    useState,
    useContext,
    useReducer,
    useEffect
} from "react";

import UserContext from "../contexts/UserContext";
import { createPost } from "../services/post";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

import Loading from "../assets/loading.svg";

import "../styles/NewPost.css";


const RULES = [
    [
        "No spamming or misuse",
        "Spamming the feed with posts makes it harder for other users to find good content. Please refrain from doing so."
    ],
    [
        "No NSFW content",
        "Uncensored means no censorship, except for NSFW content. Gore and sexual content is disallowed."
    ],
    [
        "No hate speech",
        "Opinions are allowed, but hate speech is not."
    ],
    [
        "No personal attacks",
        "Respect should be given to everyone, even if you disagree with them."
    ],
    [
        "No illegal content",
        "Illegal content is not allowed. This includes piracy, doxxing, etc."
    ],
    [
        "Have fun!",
        "Roswell is a place for you to share your thoughts and ideas. Have fun!"
    ]
];


const TypeTab = ({ type, setType, selected }) => {
    return (
        <div
            className={`type-tab ${selected ? "selected" : ""}`}
            onClick={() => setType(type)}
        >
            {type}
        </div>
    );
}


const NewPost = () => {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("Content");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [_, forceUpdate] = useReducer(x => x + 1, 0);

    const { user } = useContext(UserContext);

    // check if user is logged in
    useEffect(() => {
        if (localStorage.getItem("user")) {
            // check if user is logged in
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user.isLoggedIn) {
                window.location.href = "/login";
            }
        }
    })

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        // disable media for now
        if (type === "Media") {
            toast.error("Media posts are unsupported at the moment");
            return;
        }

        setIsSubmitting(true);
        forceUpdate();

        // remove either content or image from the request body
        const reqTitle = title;
        const reqContent = type === "Content" ? content : null;
        const reqImage = type === "Media" ? image : null;

        // const resp = await createPost(type, reqTitle, reqContent, reqImage, user.token);

        // console.log("resp", resp);

        // if (resp.success) {
        //     toast.success("Post created successfully");
        //     // navigate to resp.url
        //     navigate(resp.url);
        // } else {
        //     toast.error(resp.message);
        // }

        // setIsSubmitting(false);
        // forceUpdate();

        createPost(type, reqTitle, reqContent, reqImage, user.token)
            .then(resp => {
                if (resp.success) {
                    toast.success("Post created successfully");
                    // navigate to resp.url
                    navigate(resp.url);
                } else {
                    console.log(resp);
                    toast.error(resp.response.data.message);
                }
            }
        ).catch(err => {
            console.log(err);
            toast.error(err.response.data.message);
        }).finally(() => {
            setIsSubmitting(false);
            forceUpdate();
        });
    }

    return (
        <div className="new-post">
            <div className="np-container">
                <div className="form-container">
                    <h1 className="np-title">Create a new post</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="np-form-group">
                            <input
                                type="text"
                                name="title"
                                id="title"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="type-tabs">
                            <TypeTab
                                type="Content"
                                setType={setType}
                                selected={type === "Content"}
                            />
                            <TypeTab
                                type="Media"
                                setType={setType}
                                selected={type === "Media"}
                            />
                        </div>

                        {type === "Content" ? (
                            <div className="np-form-group">
                                <textarea
                                    name="content"
                                    id="content"
                                    placeholder="Content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                />
                            </div>
                        ) : (
                            <div className="np-form-group">
                                <input
                                    type="file"
                                    name="image"
                                    id="image"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    required
                                />
                            </div>
                        )}

                        <br />

                        <div className="np-form-group">
                            <button
                                type="submit"
                                className="np-submit-btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <img src={Loading} alt="loading" />
                                ) : (
                                    "Create Post"
                                )}
                            </button>
                            
                        </div>
                    </form>
                </div>
                <div className="rules">
                    {
                        RULES.map((rule, index) => (
                            <div className="rule" key={index}>
                                <span className="rule__index">{index + 1}</span>
                                <div className="rule_text_cont">
                                    <span className="rule__text">{rule[0]}</span>
                                    <span className="rule__subtext">{rule[1]}</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default NewPost;