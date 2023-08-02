import React from "react";
import { Link } from "react-router-dom";

import "../styles/NotFound.css";

const NotFound = () => {
    // redirect to home page if user tries to access a page that doesn't exist

    return (
        <div className="not_found">
            {/* cute error message */}
            <h1>
                Oops, looks like you're lost in space.
            </h1>
            <h2>
                We couldn't find the page you were looking for.
            </h2>
            <h3>
                <Link to="/">
                    Click here to go back to the home page.
                </Link>
                <br />
                <p>
                    Or you can just stay here and admire the stars.
                </p>
            </h3>
        </div>
    );
}

export default NotFound;