import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";
import {
    AiOutlineEdit
} from "react-icons/ai";
import { IoWarningOutline } from "react-icons/io5";
import { MdAdminPanelSettings } from "react-icons/md";
import { GiPartyHat } from "react-icons/gi";
import DefaultPfp from "../assets/pfp.png";
import { getProfile } from "../services/profile";
import Loading from "../assets/loading.svg";
import { toast } from "react-hot-toast";

import "../styles/Profile.css";

const DateString = (date) => {
    return new Date(date).toLocaleDateString(
        "en-GB",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        }
    );
}

const DateIsToday = (date) => {
    const today = new Date();
    // only day month and year
    return date.getDate() === today.getDate()
        && date.getMonth() === today.getMonth()
        && date.getFullYear() === today.getFullYear();
}

const ProfileStat = ({ number, text }) => {
    return (
        <div className="profile_userstats_stat">
            <h3 className="profile_userstats_number">
                {number || 0}
            </h3>
            <span className="profile_userstats_text">
                {text}
            </span>
        </div>
    );
}

const Profile = () => {
    const { user } = useContext(UserContext);
    const [isSelf, setIsSelf] = useState(false);
    const [profile, setProfile] = useState(null);

    const { username } = useParams();

    console.log(username);

    useEffect(() => {
        // get profile data
        getProfile(username)
            .then((res) => {
                console.log(res);
                if (res.success) {
                    setProfile(res.user);
                } else {
                    toast.error(res.response.data.message);
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error("Something went wrong when loading this profile.");
            });
    }, [username]);

    // when user changes, check if it's the same as the profile
    useEffect(() => {
        setIsSelf(user?.username === username);
    }, [user, username]);

    const loading = (
        <div className="loading">
            <img src={Loading} alt="loading" />
        </div>
    );

    return (
        <div className="profilePage">
            <div className="profile">
                <div className="profile_header">
                    {
                        profile === null ? loading : (
                            <>
                            <div className="profile_userinfo">
                                <div className="profile_userinfo_picture">
                                    <img src={profile.profilePicture} alt="profile_picture"
                                        // fall back to default pfp if no profile picture
                                        onError={(e) => {
                                            e.target.src = DefaultPfp;
                                        }}
                                    />
                                    {
                                        isSelf && <AiOutlineEdit className="profile_userinfo_picture_edit" />
                                    }
                                    {
                                        DateIsToday(new Date(profile.birthday)) &&
                                        <GiPartyHat className="profile_userinfo_picture_birthday" />
                                    }
                                </div>
                                <div className="profile_userinfo_details">
                                    <div className={
                                        "profile_userinfo_details_username"
                                        + (profile.role === "admin" ? " admin" : "")
                                    }>
                                        <span>{profile.username}</span>
                                        {
                                            profile.role === "admin" &&
                                            <MdAdminPanelSettings className="profile_userinfo_details_username_admin" />
            
                                        }
                                    </div>
                                    <div className="profile_userinfo_details_bio">
                                        {
                                            profile.bio ? profile.bio
                                            : <span className="italic fade">No bio yet</span>
                                        }
                                        <br />
                                        <span className="fade">
                                            Joined at {DateString(profile.createdAt)}
                                        </span>
                                        <br />
                                        {
                                            profile.birthday && <>
                                                <span className="bold">Birthday: </span>
                                                <span>{DateString(profile.birthday)}</span>
                                            </>
                                        }
                                    </div>
                                </div>
                            </div>

                            {
                                profile.punishment && (
                                    <span className="profile_banmsg">
                                        <IoWarningOutline className="profile_banmsg_icon" />
                                        <span className="profile_banmsg_text">
                                            User is banned {
                                                profile.punishment.expiresAt ? "until " + DateString(profile.punishment.expiresAt)
                                                : "permanently"

                                            }
                                        </span>
                                    </span>
                                )
                            }

                            <div className="profile_userstats">
                                <ProfileStat number={profile.posts.length} text="posts" />
                                <ProfileStat number={profile.followers.length} text="followers" />
                                <ProfileStat number={profile.following.length} text="following" />
                            </div>
                            </>
                        )
                    }
                </div>
                <div className="profile_userposts">

                </div>
            </div>
        </div>
    );
};

export default Profile;