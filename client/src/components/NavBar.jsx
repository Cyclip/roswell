import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";

import "../styles/NavBar.css";

import {
    RxHamburgerMenu
} from "react-icons/rx";

/*
Logged out buttons ==
Left:
    Home
    About
Right:
    Login
    Register

Logged in buttons ==
Left:
    Home
    About
    Feed
Right:
    New post
    Profile
    Logout
*/

const NavBar = () => {
    const { user } = useContext(UserContext);
    const { isLoggedIn, username, profilePicture } = user;

    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

    return (
        <nav>
            <div className="logo">
                <Link to="/">
                    ROS<span>WELL</span>
                </Link>
            </div>

            <div className="nav_side nav_left">
                <Link to="/" className={
                    window.location.pathname === "/" ? "active" : ""
                }>Home</Link>
                <Link to="/about" className={
                    window.location.pathname === "/about" ? "active" : ""
                }>About</Link>
                {isLoggedIn && <Link to="/feed" className={
                    window.location.pathname === "/feed" ? "active" : ""
                }>Feed</Link>}
            </div>

            <div className="nav_side nav_right">
                {!isLoggedIn && <Link to="/login" className={
                    window.location.pathname === "/login" ? "active" : ""
                }>Login</Link>}
                {!isLoggedIn && <Link to="/register" className={
                    window.location.pathname === "/register" ? "active" : ""
                }>Register</Link>}
                {isLoggedIn && <Link to="/new-post" className={
                    window.location.pathname === "/new-post" ? "active" : ""
                }>New post</Link>}
                {isLoggedIn && <Link to={`/profile/${username}`} className={
                    window.location.pathname === `/profile/${username}` ? "active" : ""
                }>Profile</Link>}
                {isLoggedIn && <Link to="/logout" className={
                    window.location.pathname === "/logout" ? "active" : ""
                }>Logout</Link>}
            </div>

            {/* hamburger for smaller displays */}
            <div className="hamburger" onClick={
                () => setIsHamburgerOpen(!isHamburgerOpen)
            }>
                <RxHamburgerMenu />
            </div>

            <div className={`hamburger_menu ${isHamburgerOpen ? "open" : ""}`}>
                <Link to="/" className={
                    window.location.pathname === "/" ? "active" : ""
                }>Home</Link>
                <Link to="/about" className={
                    window.location.pathname === "/about" ? "active" : ""
                }>About</Link>
                {isLoggedIn && <Link to="/feed" className={
                    window.location.pathname === "/feed" ? "active" : ""
                }>Feed</Link>}

                {!isLoggedIn && <Link to="/login" className={
                    window.location.pathname === "/login" ? "active" : ""
                }>Login</Link>}
                {!isLoggedIn && <Link to="/register" className={
                    window.location.pathname === "/register" ? "active" : ""
                }>Register</Link>}
                {isLoggedIn && <Link to="/new-post" className={
                    window.location.pathname === "/new-post" ? "active" : ""
                }>New post</Link>}
                {isLoggedIn && <Link to={`/profile/${username}`} className={
                    window.location.pathname === `/profile/${username}` ? "active" : ""
                }>Profile</Link>}
                {isLoggedIn && <Link to="/logout" className={
                    window.location.pathname === "/logout" ? "active" : ""
                }>Logout</Link>}
            </div>
        </nav>
    );
}

export default NavBar;