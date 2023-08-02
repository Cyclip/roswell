import React from "react";

import "../styles/NotFound.css";

const NotFound = () => {
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
                <a href="/">Click here to go back home.</a>
                <br />
                <p>
                    Or you can just stay here and admire the stars.
                </p>
            </h3>
        </div>
    );
}

export default NotFound;