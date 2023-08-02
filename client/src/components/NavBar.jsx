import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";

import "../styles/NavBar.css";

import {
    RxHamburgerMenu
} from "react-icons/rx";


const NavBar = () => {
    const { user } = useContext(UserContext);
    const { isLoggedIn, username, profilePicture } = user;
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const location = useLocation();

    return (
        <nav>
            <div className="logo">
                <Link to="/">
                    ROS<span>WELL</span>
                </Link>
            </div>

            <div className="nav_side nav_left">
                <Link to="/" className={
                    location.pathname === "/" ? "active" : ""
                }>Home</Link>
                <Link to="/about" className={
                    location.pathname === "/about" ? "active" : ""
                }>About</Link>
                {isLoggedIn && <Link to="/feed" className={
                    location.pathname === "/feed" ? "active" : ""
                }>Feed</Link>}
            </div>

            <div className="nav_side nav_right">
                {!isLoggedIn && <Link to="/login" className={
                    location.pathname === "/login" ? "active" : ""
                }>Login</Link>}
                {!isLoggedIn && <Link to="/register" className={
                    location.pathname === "/register" ? "active" : ""
                }>Register</Link>}
                {isLoggedIn && <Link to="/newpost" className={
                    location.pathname === "/newpost" ? "active" : ""
                }>New post</Link>}
                {isLoggedIn && <Link to={`/profile/${username}`} className={
                    location.pathname === `/profile/${username}` ? "active" : ""
                }>Profile</Link>}
                {isLoggedIn && <Link to="/logout" className={
                    location.pathname === "/logout" ? "active" : ""
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
                    location.pathname === "/" ? "active" : ""
                }>Home</Link>
                <Link to="/about" className={
                    location.pathname === "/about" ? "active" : ""
                }>About</Link>
                {isLoggedIn && <Link to="/feed" className={
                    location.pathname === "/feed" ? "active" : ""
                }>Feed</Link>}

                {!isLoggedIn && <Link to="/login" className={
                    location.pathname === "/login" ? "active" : ""
                }>Login</Link>}
                {!isLoggedIn && <Link to="/register" className={
                    location.pathname === "/register" ? "active" : ""
                }>Register</Link>}
                {isLoggedIn && <Link to="/newpost" className={
                    location.pathname === "/newpost" ? "active" : ""
                }>New post</Link>}
                {isLoggedIn && <Link to={`/profile/${username}`} className={
                    location.pathname === `/profile/${username}` ? "active" : ""
                }>Profile</Link>}
                {isLoggedIn && <Link to="/logout" className={
                    location.pathname === "/logout" ? "active" : ""
                }>Logout</Link>}
            </div>
        </nav>
    );
}

export default NavBar;