import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import { errorMessages, successMessages } from "../../constants/constants";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: "",
        lastName: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        postalCode: "",
        birthday: "",
        email: "",
        password: "",
    });

    const registerUser = async (e) => {
        e.preventDefault();

        if (!data.name || !/^[A-Za-zĀ-ž\s]+$/.test(data.name)) {
            toast.error(errorMessages.ERROR_INVALID_NAME);
            return;
        }
        if (!data.lastName || !/^[A-Za-zĀ-ž\s]+$/.test(data.lastName)) {
            toast.error(errorMessages.ERROR_INVALID_LAST_NAME);
            return;
        }
        if (!data.phone || !/^[0-9+]*$/.test(data.phone)) {
            toast.error(errorMessages.ERROR_INVALID_PHONE);
            return;
        }
        if (!data.address) {
            toast.error(errorMessages.ERROR_INVALID_ADDRESS);
            return;
        }
        if (!data.city || !/^[A-Za-zĀ-ž\s]+$/.test(data.city)) {
            toast.error(errorMessages.ERROR_INVALID_CITY);
            return;
        }
        if (!data.country || !/^[A-Za-zĀ-ž\s]+$/.test(data.country)) {
            toast.error(errorMessages.ERROR_INVALID_COUNTRY);
            return;
        }
        if (!data.postalCode || !/^LV-?\d{4}$/.test(data.postalCode)) {
            toast.error(errorMessages.ERROR_INVALID_POSTAL_CODE);
            return;
        }
        if (!data.birthday) {
            toast.error(errorMessages.ERROR_INVALID_BIRTHDAY);
            return;
        }
        if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
            toast.error(errorMessages.ERROR_INVALID_EMAIL);
            return;
        }
        if (!data.password) {
            toast.error(errorMessages.ERROR_INVALID_PASSWORD);
            return;
        }

        const email = data.email.toLowerCase();

        try {
            const emailResponse = await axios.post("/check-email", { email });
            if (emailResponse.data.exists) {
                toast.error(errorMessages.ERROR_EMAIL_EXISTS);
                return;
            }
        } catch (error) {
            console.error(error);
            toast.error(errorMessages.ERROR_CHECKING_EMAIL);
            return;
        }

        const today = new Date();
        const birthDate = new Date(data.birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
        if (
            month < 0 ||
            (month === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        if (age < 18) {
            toast.error(errorMessages.ERROR_AGE_REQUIREMENTS);
            return;
        }
        if (birthDate > today) {
            toast.error(errorMessages.ERROR_BIRTHDAY_FUTURE);
            return;
        }

        const earliestValidDate = new Date("1900-01-01");
        if (birthDate < earliestValidDate) {
            toast.error(errorMessages.ERROR_BIRTHDAY_TOO_OLD);
            return;
        }

        const {
            name,
            lastName,
            phone,
            address,
            city,
            country,
            postalCode,
            birthday,
            password,
        } = data;

        try {
            const response = await axios.post("/register", {
                name,
                lastName,
                phone,
                address,
                city,
                country,
                postalCode,
                birthday,
                email,
                password,
            });

            if (response.data.error) {
                toast.error(response.data.error);
            } else {
                setData({});
                toast.success(successMessages.SUCCESS_REGISTRATION);
                navigate("/login");
            }
        } catch (error) {
            if (
                error.response &&
                error.response.data.message === "Email already exists"
            ) {
                toast.error(errorMessages.ERROR_EMAIL_EXISTS);
            } else {
                console.error(error);
                toast.error("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className="register-page">
            <form onSubmit={registerUser}>
                <h1>Register</h1>

                <div className="form-column-wrapper">
                    <div className="form-column-1">
                        <label className="form-label">
                            <span>*</span>Name:
                        </label>
                        <input
                            required
                            className="form-input"
                            type="text"
                            placeholder="First Name..."
                            value={data.name}
                            maxLength={30}
                            onChange={(e) =>
                                setData({ ...data, name: e.target.value })
                            }
                            onKeyDown={(e) => {
                                if (
                                    !/^[A-Za-zĀ-ž\s]$/.test(e.key) &&
                                    e.key !== "Backspace"
                                ) {
                                    e.preventDefault();
                                }
                            }}
                        />

                        <label className="form-label">
                            <span>*</span>Last Name:
                        </label>
                        <input
                            required
                            className="form-input"
                            type="text"
                            placeholder="Last Name..."
                            value={data.lastName}
                            maxLength={30}
                            onChange={(e) =>
                                setData({ ...data, lastName: e.target.value })
                            }
                            onKeyDown={(e) => {
                                if (
                                    !/^[A-Za-zĀ-ž\s]$/.test(e.key) &&
                                    e.key !== "Backspace"
                                ) {
                                    e.preventDefault();
                                }
                            }}
                        />

                        <label className="form-label">
                            <span>*</span>Phone:
                        </label>
                        <input
                            required
                            className="form-input"
                            type="text"
                            placeholder="Phone..."
                            value={data.phone}
                            maxLength={13}
                            onChange={(e) =>
                                setData({ ...data, phone: e.target.value })
                            }
                            onKeyDown={(e) => {
                                if (
                                    !/^[0-9+]*$/.test(e.key) &&
                                    e.key !== "Backspace"
                                ) {
                                    e.preventDefault();
                                }
                            }}
                        />

                        <label className="form-label">
                            <span>*</span>Address:
                        </label>
                        <input
                            required
                            className="form-input"
                            type="text"
                            placeholder="Address..."
                            value={data.address}
                            onChange={(e) =>
                                setData({ ...data, address: e.target.value })
                            }
                        />

                        <label className="form-label">
                            <span>*</span>City:
                        </label>
                        <input
                            required
                            className="form-input"
                            type="text"
                            placeholder="City..."
                            value={data.city}
                            max={255}
                            onChange={(e) =>
                                setData({ ...data, city: e.target.value })
                            }
                            onKeyDown={(e) => {
                                if (
                                    !/^[A-Za-zĀ-ž\s]$/.test(e.key) &&
                                    e.key !== "Backspace"
                                ) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>
                    <div className="form-column-2">
                        <label className="form-label">
                            <span>*</span>Country:
                        </label>
                        <input
                            required
                            className="form-input"
                            type="text"
                            placeholder="Country..."
                            value={data.country}
                            onChange={(e) =>
                                setData({ ...data, country: e.target.value })
                            }
                            onKeyDown={(e) => {
                                if (
                                    !/^[A-Za-zĀ-ž\s]$/.test(e.key) &&
                                    e.key !== "Backspace"
                                ) {
                                    e.preventDefault();
                                }
                            }}
                        />
                        <label className="form-label">
                            <span>*</span>
                            {`Postal code(LV-3333 or LV3333):`}
                        </label>
                        <input
                            required
                            className="form-input"
                            type="text"
                            placeholder="Postal Code..."
                            value={data.postalCode}
                            maxLength={7}
                            onChange={(e) => {
                                const value = e.target.value;
                                setData({ ...data, postalCode: value });
                            }}
                            style={{
                                borderColor:
                                    /^[lL][vV]-?\d{4}$/.test(data.postalCode) ||
                                    data.postalCode === ""
                                        ? "initial"
                                        : "red",
                            }}
                        />

                        <label className="form-label">
                            <span>*</span>Birthday:
                        </label>
                        <input
                            required
                            className="form-input"
                            type="date"
                            placeholder="Birthday..."
                            value={data.birthday}
                            onChange={(e) =>
                                setData({ ...data, birthday: e.target.value })
                            }
                        />
                        <label className="form-label">
                            <span>*</span>Email:
                        </label>
                        <input
                            required
                            className="form-input"
                            type="email"
                            placeholder="Email..."
                            value={data.email}
                            onChange={(e) =>
                                setData({ ...data, email: e.target.value })
                            }
                        />
                        <label className="form-label">
                            <span>*</span>
                            {`Password (at least 6 characters long)`}
                        </label>
                        <input
                            required
                            className="form-input"
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password..."
                            value={data.password}
                            onChange={(e) =>
                                setData({ ...data, password: e.target.value })
                            }
                        />
                        <div className="show-password">
                            <input
                                type="checkbox"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                            Show Password
                        </div>
                    </div>
                </div>
                <div className="register-page-submit-btn-wrapper">
                    <Link to={"/login"}>I already have an account</Link>
                    <button className="form-button" type="submit">
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
}
