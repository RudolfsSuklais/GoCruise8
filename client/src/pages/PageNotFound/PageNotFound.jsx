import React from "react";
import "./PageNotFound.css";
import { Link } from "react-router-dom";

function PageNotFound() {
    return (
        <div className="page-not-found">
            <h1>Ups... Page Not Found!</h1>
            <Link to="/">Go to Home</Link>
        </div>
    );
}

export default PageNotFound;
