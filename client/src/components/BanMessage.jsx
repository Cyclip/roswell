import React, { useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import { timeUntil } from "../utils/timeUtils";
import { getPunishment } from "../services/auth";

import "../styles/BanMessage.css";

const BanMessage = () => {
    const { user } = useContext(UserContext);
    const [punishment, setPunishment] = React.useState(null);

    // check every 10 seconds
    useEffect(() => {
        const interval = setInterval(async() => {
            if (user.isLoggedIn) {
                // get punishment
                const punishment = await getPunishment(user.token);
                if (punishment.success) {
                    setPunishment(punishment.punishment);
                } else {
                    setPunishment(null);
                }
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [user]);
    
    const isBanned = () => {
        if (punishment === null || user === undefined) {
            return false;
        }
        if (punishment?.expiresAt === null) {
            return true;
        }

        const now = new Date();
        const expiration = new Date(punishment?.expiresAt);

        return now < expiration;
    }

    return (
        <>
        {
            isBanned() && (
                <div className="ban_message">
                    <h1 className="ban_message_title">Your account is currently banned.</h1>
                    <p className="ban_message_reason">
                        Reason: {punishment.reason}
                    </p>
                    <p className="ban_message_expiration">
                        {
                            punishment.expiration === null ? (
                                "Your ban is permanent."
                            ) : (
                                `Your ban expires ${timeUntil(new Date(punishment.expiresAt))}.`
                            )
                        }
                    </p>
                </div>
            )
        }
        </>
    )
};

export default BanMessage;