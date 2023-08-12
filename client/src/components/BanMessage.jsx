import React, { useContext } from "react";
import UserContext from "../contexts/UserContext";
import { timeUntil } from "../utils/timeUtils";

import "../styles/BanMessage.css";

const BanMessage = () => {
    const { user } = useContext(UserContext);
    
    const isBanned = () => {
        if (user.punishment === null || user.punishment === undefined) {
            return false;
        }
        if (user.punishment?.expiresAt === null) {
            return true;
        }

        const now = new Date();
        const expiration = new Date(user.punishment?.expiresAt);

        return now < expiration;
    }

    return (
        <>
        {
            isBanned() && (
                <div className="ban_message">
                    <h1 className="ban_message_title">Your account is currently banned.</h1>
                    <p className="ban_message_reason">
                        Reason: {user.punishment.reason}
                    </p>
                    <p className="ban_message_expiration">
                        {
                            user.punishment.expiration === null ? (
                                "Your ban is permanent."
                            ) : (
                                `Your ban expires ${timeUntil(new Date(user.punishment.expiresAt))}.`
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