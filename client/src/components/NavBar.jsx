import React, { useContext } from "react";
import "./NavBar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

function NavBar() {
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="nav-bar">
            <nav>
                <div className="nav-bar-logo">
                    <NavLink to="/">
                        <h1>GoCruise</h1>
                    </NavLink>
                </div>
                <div className="nav-bar-menu">
                    <ul>
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    isActive ? "active" : ""
                                }>
                                Home
                            </NavLink>
                        </li>

                        {user && user.isAdmin && (
                            <>
                                <li>
                                    <NavLink
                                        to="/add-car"
                                        className={({ isActive }) =>
                                            isActive ? "active" : ""
                                        }>
                                        Add car
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/all-reservations"
                                        className={({ isActive }) =>
                                            isActive ? "active" : ""
                                        }>
                                        Reservations
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/all-cars"
                                        className={({ isActive }) =>
                                            isActive ? "active" : ""
                                        }>
                                        All Cars
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/all-users"
                                        className={({ isActive }) =>
                                            isActive ? "active" : ""
                                        }>
                                        Users
                                    </NavLink>
                                </li>
                            </>
                        )}

                        {user && !user.isAdmin && (
                            <>
                                <li>
                                    <NavLink
                                        to="/about"
                                        className={({ isActive }) =>
                                            isActive ? "active" : ""
                                        }>
                                        About
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/contact"
                                        className={({ isActive }) =>
                                            isActive ? "active" : ""
                                        }>
                                        Contact
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/my-reservations"
                                        className={({ isActive }) =>
                                            isActive ? "active" : ""
                                        }>
                                        My Reservations
                                    </NavLink>
                                </li>
                                <li className="nav-bar-profile">
                                    <NavLink
                                        to="/profile"
                                        className={({ isActive }) =>
                                            isActive ? "active" : ""
                                        }>
                                        <i className="fa-regular fa-user"></i>{" "}
                                        {user.name} {user.lastName}
                                    </NavLink>
                                </li>
                            </>
                        )}

                        {!user && (
                            <>
                                <li>
                                    <NavLink
                                        to="/about"
                                        className={({ isActive }) =>
                                            isActive ? "active" : ""
                                        }>
                                        About
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/contact"
                                        className={({ isActive }) =>
                                            isActive ? "active" : ""
                                        }>
                                        Contact
                                    </NavLink>
                                </li>

                                <li className="nav-bar-register">
                                    <NavLink
                                        to="/register"
                                        className={({ isActive }) =>
                                            isActive ? "active" : ""
                                        }>
                                        Register
                                    </NavLink>
                                </li>
                                <li className="nav-bar-login">
                                    <NavLink
                                        to="/login"
                                        className={({ isActive }) =>
                                            isActive ? "active" : ""
                                        }>
                                        Login
                                    </NavLink>
                                </li>
                            </>
                        )}

                        {user && (
                            <li className="nav-bar-logout">
                                <button
                                    onClick={handleLogout}
                                    className="nav-bar-logout">
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default NavBar;
