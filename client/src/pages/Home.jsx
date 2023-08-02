import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../contexts/UserContext";

import "../styles/Home.css";

/*
Logged out buttons:
    Login
    Register

Logged in buttons:
    New post
    Profile
*/

const Home = () => {
    const { user } = useContext(UserContext);
    const { isLoggedIn, username, profilePicture } = user;

    const loggedInButtons = (
        <>
            <p>Welcome back {username}!</p>
            <div className="homepage_buttons">
                <button className="btn-primary">
                    <Link to="/feed">Your feed</Link>
                </button>
                <button className="btn-secondary">
                    <Link to="/new-post">New post</Link>
                </button>
            </div>
        </>
    );

    const loggedOutButtons = (
        <>
            <p>Consider joining the community!</p>
            <div className="homepage_buttons">
                <button className="btn-primary">
                    <Link to="/login">Login</Link>
                </button>
                <button className="btn-secondary">
                    <Link to="/register">Register</Link>
                </button>
            </div>
        </>
    );

    return (
        <div className="homepage">
            <h1 className="homepage_title">ROS<span>WELL</span></h1>
            <h2 className="homepage_subtitle">
                An uncensored, novel platform for <span className="strikethrough">aliens</span> <span className="accent3">humans</span>!
            </h2>

            {isLoggedIn ? loggedInButtons : loggedOutButtons}
        </div>
    );
}

export default Home;