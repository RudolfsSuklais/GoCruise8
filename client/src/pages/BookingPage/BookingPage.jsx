import React from "react";
import Booking from "./components/Booking";
import "./BookingPage.css";
import { useNavigate } from "react-router-dom";

function BookingPage() {
    const navigate = useNavigate();
    return (
        <div className="booking-page">
            <button onClick={() => navigate(-1)}>
                <span class="fa-solid fa-arrow-left"></span> Back
            </button>
            <Booking />
        </div>
    );
}

export default BookingPage;
