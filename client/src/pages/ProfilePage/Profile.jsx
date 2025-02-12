import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./Profile.css";
import { errorMessages, successMessages } from "../../constants/constants";
import LoadingSpin from "../../components/LoadingSpin";

function Profile() {
    const [user, setUser] = useState(null);
    const [isEditDisabled, setIsEditDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const calculateAge = (birthday) => {
        const today = new Date();
        const birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();

        if (
            month < birthDate.getMonth() ||
            (month === birthDate.getMonth() && day < birthDate.getDate())
        ) {
            age--;
        }
        return age;
    };

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get("/profile");
            setIsLoading(false);
            setUser({
                ...data,
                birthday: data.birthday
                    ? new Date(data.birthday).toISOString().split("T")[0]
                    : "",
            });
        } catch (error) {
            console.error(errorMessages.ERROR_GET_PROFILE, error);
            toast.error(errorMessages.ERROR_GET_PROFILE);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const validateBirthday = (birthday) => {
        const today = new Date();
        const birthDate = new Date(birthday);

        if (birthDate > today) {
            toast.error(errorMessages.ERROR_BIRTHDAY_FUTURE);
            return false;
        }

        const age = calculateAge(birthday);
        if (age < 18) {
            toast.error(errorMessages.ERROR_AGE_REQUIREMENTS);
            return false;
        }

        if (age > 120) {
            toast.error("Your age cannot exceed 120 years.");
            return false;
        }

        const maxYear = today.getFullYear() - 18;
        if (birthDate.getFullYear() < maxYear - 120) {
            toast.error("Please enter a valid year of birth.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        if (!validateBirthday(user.birthday)) {
            return;
        }

        try {
            await axios.put(`/users/${user.userID}`, user);
            fetchProfile();
            setIsEditDisabled(true);
            window.location.reload();
            toast.success(successMessages.SUCCESS_UPDATED);
        } catch (error) {
            console.error(errorMessages.ERROR_UPDATING, error);
            toast.error(errorMessages.ERROR_UPDATING);
        }
    };

    function cancelEdit() {
        setIsEditDisabled(!isEditDisabled);
        fetchProfile();
    }

    if (isLoading) return <LoadingSpin />;

    return (
        <div className="profile-page">
            <h1>Profile</h1>

            <div className="profile-card">
                <div className="edit-button-container">
                    <button
                        className={!isEditDisabled ? "disabled" : "edit-button"}
                        onClick={() => setIsEditDisabled(!isEditDisabled)}>
                        <span className="fa-regular fa-pen-to-square"></span>
                        <span className="edit-text">Edit</span>
                    </button>
                    <p className={isEditDisabled ? "disabled" : ""}>
                        Press <b>"Save"</b> to save changes
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="profile-card-name">
                        <label>
                            Name:
                            <input
                                type="text"
                                name="name"
                                value={user.name || ""}
                                onChange={handleInputChange}
                                disabled={isEditDisabled}
                                required
                            />
                        </label>
                    </div>
                    <div className="profile-card-last-name">
                        <label>
                            Last Name:
                            <input
                                type="text"
                                name="lastName"
                                value={user.lastName || ""}
                                onChange={handleInputChange}
                                disabled={isEditDisabled}
                                required
                            />
                        </label>
                    </div>
                    <div className="profile-card-phone">
                        <label>
                            Phone:
                            <input
                                type="text"
                                name="phone"
                                value={user.phone || ""}
                                onChange={handleInputChange}
                                disabled={isEditDisabled}
                                required
                            />
                        </label>
                    </div>
                    <div className="profile-card-address">
                        <label>
                            Address:
                            <input
                                type="text"
                                name="address"
                                value={user.address || ""}
                                onChange={handleInputChange}
                                disabled={isEditDisabled}
                                required
                            />
                        </label>
                    </div>
                    <div className="profile-card-city">
                        <label>
                            City:
                            <input
                                type="text"
                                name="city"
                                value={user.city || ""}
                                onChange={handleInputChange}
                                disabled={isEditDisabled}
                                required
                            />
                        </label>
                    </div>
                    <div className="profile-card-country">
                        <label>
                            Country:
                            <input
                                type="text"
                                name="country"
                                value={user.country || ""}
                                onChange={handleInputChange}
                                disabled={isEditDisabled}
                                required
                            />
                        </label>
                    </div>
                    <div className="profile-card-postal-code">
                        <label>
                            Postal Code:
                            <input
                                type="text"
                                name="postalCode"
                                value={user.postalCode || ""}
                                onChange={handleInputChange}
                                disabled={isEditDisabled}
                                required
                            />
                        </label>
                    </div>
                    <div className="profile-card-birthday">
                        <label>
                            Birthday:
                            <input
                                required
                                type="date"
                                name="birthday"
                                value={user.birthday || ""}
                                onChange={handleInputChange}
                                disabled={isEditDisabled}
                            />
                        </label>
                    </div>
                    <div className="profile-card-email">
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={user.email || ""}
                                onChange={handleInputChange}
                                disabled={isEditDisabled}
                                required
                            />
                        </label>
                    </div>

                    <div className="form-buttons">
                        <button
                            className={
                                isEditDisabled
                                    ? "disabled"
                                    : "edit-cancel-button"
                            }
                            disabled={isEditDisabled}
                            onClick={cancelEdit}
                            type="button">
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className={isEditDisabled ? "disabled" : ""}
                            disabled={isEditDisabled}>
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;
