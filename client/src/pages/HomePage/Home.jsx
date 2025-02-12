import React, { useState, useEffect, useContext } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import toast from "react-hot-toast";
import { errorMessages } from "../../constants/constants";

function Home() {
    const localDate = new Date();
    const localDateTime = new Date(
        localDate.getTime() - localDate.getTimezoneOffset() * 60000
    );
    const [pickupDate, setPickupDate] = useState(
        new Date(localDateTime.setHours(localDateTime.getHours() + 2))
            .toISOString()
            .slice(0, 16)
    );
    const [dropoffDate, setDropoffDate] = useState(() => {
        const pickupDateObj = new Date(pickupDate);
        pickupDateObj.setHours(pickupDateObj.getHours() + 72);
        return pickupDateObj.toISOString().slice(0, 16);
    });
    const [isSearchBtnAvailable, setIsSearchBtnAvailable] = useState(false);
    const [hasError, setHasError] = useState(false);
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const start = new Date(pickupDate);
        const end = new Date(dropoffDate);

        if (start >= end) {
            toast.error(errorMessages.ERROR_START_TIME);
            setHasError(true);
            return;
        }

        navigate(`/car-list`, {
            state: { pickupDate, dropoffDate },
        });
    };

    useEffect(() => {
        setIsSearchBtnAvailable(pickupDate && dropoffDate);
    }, [pickupDate, dropoffDate]);

    return (
        <section className="home-page">
            {user && <h1 className="welcome-message">Welcome {user?.name}!</h1>}

            <div className="home-page-hero-section">
                <h1>Go Cruise – Search, Compare & Save</h1>

                <div className="home-page-h3-wrapper">
                    <h3>
                        <span className="fa-solid fa-check"></span> Free
                        cancellations on most bookings
                    </h3>
                    <h3>
                        <span className="fa-solid fa-check"></span> 60,000+
                        locations
                    </h3>
                    <h3>
                        <span className="fa-solid fa-check"></span> Customer
                        support in 30+ languages
                    </h3>
                </div>
            </div>

            <form onSubmit={handleFormSubmit}>
                <div className="home-page-dropdown-wrapper">
                    <div className="home-page-dropdown">
                        <div className="home-page-dropdown-date-input">
                            <label>Pick-up date:</label>
                            <input
                                type="datetime-local"
                                value={pickupDate}
                                onChange={(e) => setPickupDate(e.target.value)}
                                required
                                min="2025-01-01T00:00"
                                max="2027-12-31T23:59"
                            />
                        </div>

                        <div className="home-page-dropdown-date-input">
                            <label>Drop-off date:</label>
                            <input
                                step="900"
                                type="datetime-local"
                                value={dropoffDate}
                                onChange={(e) => setDropoffDate(e.target.value)}
                                required
                                max="2027-12-31T23:59"
                            />
                        </div>
                        <div className="search-btn-notification-wrapper">
                            <button
                                type="submit"
                                className="home-page-dropdown-btn"
                                disabled={!isSearchBtnAvailable}>
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <div className="home-page-information">
                <div className="key-features">
                    <p>
                        <span className="fa-solid fa-car"></span>&nbsp;
                        <b>Wide Selection of Vehicles: </b>
                        Choose from economy cars, luxury sedans, SUVs, and more.
                    </p>
                    <p>
                        <span className="fa-solid fa-calendar"></span>&nbsp;
                        <b>Flexible Booking Options: </b>
                        Rent by the hour, day, or week.
                    </p>
                    <p>
                        <span className="fa-solid fa-dollar-sign"></span>&nbsp;
                        <b>Affordable Pricing: </b> Competitive rates with no
                        hidden fees.
                    </p>
                    <p>
                        <span className="fa-solid fa-wrench"></span>&nbsp;
                        <b>24/7 Roadside Assistance: </b> Your safety is our
                        priority.
                    </p>
                </div>
                <div className="customer-testimonials">
                    <div className="testimonial-1">
                        <div className="customer-image">
                            <img
                                src="https://pbs.twimg.com/media/BcINeMVCIAABeWd.jpg:large"
                                alt=""
                            />
                        </div>
                        <h3>Alex, London</h3>
                        <p>
                            "The best car rental experience I've ever had! Quick
                            and easy service."
                        </p>
                    </div>
                    <div className="testimonial-2">
                        <div className="customer-image">
                            <img
                                src="https://images.generated.photos/ZYtOC5xwOtU17-GvKrEJWZpRunetrjzilvoc0rO-GLQ/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/NjAxOTY3LmpwZw.jpg"
                                alt=""
                            />
                        </div>
                        <h3>Maria, Madrid</h3>
                        <p>
                            "Great rates and a fantastic selection of vehicles!"
                        </p>
                    </div>
                </div>
            </div>
            <div className="prices-start-from-wrapper">
                <div className="prices-start-from">
                    <h1>CHEAPER THAN EVER, </h1>
                </div>
                <div className="prices-start-from-2">
                    <h1>
                        RENT A CAR FOR ONLY <span>3€</span>
                    </h1>
                </div>
            </div>
        </section>
    );
}

export default Home;
