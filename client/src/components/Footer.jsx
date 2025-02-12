import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <div className="footer-container">
            <div className="logo-link-wrapper">
                <div className="footer-logo">
                    <Link to="/">
                        <h1>GoCruise</h1>
                    </Link>
                </div>
                <div className="footer-subscribe">
                    <p>Subscribe to our newsletter:</p>
                    <form action="#">
                        <div className="subscribe-input-btn">
                            <input
                                type="email"
                                placeholder="Your email"
                                required
                            />
                            <button type="submit">Subscribe</button>
                        </div>
                    </form>
                </div>
                <div className="footer-information">
                    <p>
                        <i className="fa-solid fa-location-dot"></i> Brīvības
                        iela 68, Centra rajons, Rīga, LV-1011, Latvia
                    </p>
                    <p>
                        <i className="fa-solid fa-phone"></i> +371 2654 9873
                    </p>
                    <p>
                        <i className="fa-solid fa-envelope"></i>{" "}
                        janis.berzins@gocruise.com
                    </p>
                </div>
            </div>
            <div className="copyright">
                <p>© 2025 GoCruise. All rights reserved.</p>
            </div>
        </div>
    );
}

export default Footer;
