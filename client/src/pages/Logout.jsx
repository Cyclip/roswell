import React, {
    useContext,
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import UserContext from "../contexts/UserContext";
import "../styles/Logout.css"

const Logout = () => {
    const {
        user,
        setUser
    } = useContext(UserContext);
    const [username, setUsername] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("user")) {
            // check if user is logged in
            const user = JSON.parse(localStorage.getItem("user"));
            if (user.isLoggedIn) {
                setUsername(user.username);
            }
        }
        
        setUser((prevUser) => {
            return {
                ...prevUser,
                isLoggedIn: false,
                username: null,
                token: null,
                id: null,
                profilePicture: null,
            }
        });
        // delete user from localStorage
        localStorage.removeItem("user");
        // redirect to home page
        navigate("/");
    });

    return (
        <div className="logout_page">
            {
                username ? (
                    <h1 className="logout_page_title">
                        Goodbye, <span>{username}</span>!
                    </h1>
                ) : (
                    <h1 className="logout_page_title">
                        Goodbye!
                    </h1>
                )
            }

            <p className="logout_page_subtitle">
                You have been logged out successfully.
            </p>
        </div>
    )
}

export default Logout;