import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import User from "./User";
import UserDropdown from "./UserDropdown";
import Notifications from "./Notifications";
import { AiFillCaretDown } from "react-icons/ai";
import { UserContext } from "../contexts/UserContext";
import { useMediaQuery } from "react-responsive";

import "../styles/NavBar.css";

import {
    RxHamburgerMenu
} from "react-icons/rx";


const NavBar = () => {
    const { user } = useContext(UserContext);
    const { isLoggedIn, username, profilePicture } = user;
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const location = useLocation();

    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

    const handleOutsideClick = (event) => {
        // Check if the click is outside the profile container and not on the user dropdown container
        if (
            isUserDropdownOpen &&
            !event.target.closest('.nav_user_container') &&
            !event.target.closest('.hamburger_menu_user_container')
        ) {
            setIsUserDropdownOpen(false);
        }
    };

    useEffect(() => {
        if (isUserDropdownOpen || isHamburgerOpen) {
            // Attach the event listener when profile or hamburger menu is open
            document.addEventListener('click', handleOutsideClick);
        } else {
            // Remove the event listener when both menus are closed
            document.removeEventListener('click', handleOutsideClick);
        }

        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [isUserDropdownOpen, isHamburgerOpen]);

    return (
        <nav>
            {
                (
                    isLoggedIn && isUserDropdownOpen
                ) ? <UserDropdown /> : null
            }

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
                {
                    isLoggedIn ? (
                        <>
                        <Notifications />
                        <div className="nav_user_container"
                            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                        >
                            <User user={user} displayName={true} link={false}/>
                            <AiFillCaretDown className="nav_user_caret" />
                        </div>
                        </>
                    ) : null
                }
            </div>

            {
                isMobile ? (
                    <>
                        <div className="hamburger" onClick={
                            () => setIsHamburgerOpen(!isHamburgerOpen)
                        }>
                            <Notifications />
                            <RxHamburgerMenu />
                        </div>
            
                        <div 
                            className={`hamburger_menu ${isHamburgerOpen ? "open" : ""}`}
                            onClick={() => setIsHamburgerOpen(false)}
                        >
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

                            {
                                isLoggedIn ? (
                                    <div className="hamburger_menu_user_container">
                                        <p className="hamburger_menu_user_title">Logged in as</p>
                                        <User user={user} displayName={true} link={false}/>
                                    </div>
                                ) : null
                            }
                        </div>
                    </>
                ) : null
            }
        </nav>
    );
}

export default NavBar;