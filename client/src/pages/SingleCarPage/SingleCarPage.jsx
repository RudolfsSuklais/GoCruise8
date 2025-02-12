import React from "react";
import SingleCar from "./components/SingleCar";
import "./SingleCarPage.css";
import { useNavigate } from "react-router-dom";

function SingleCarPage() {
    const navigate = useNavigate();

    return (
        <div className="single-car-page">
            <SingleCar />
            <div className="single-car-page-back-btn-wrapper">
                <button onClick={() => navigate("/all-cars")}>
                    <span className="fa-solid fa-arrow-left"></span> Back
                </button>
            </div>
        </div>
    );
}

export default SingleCarPage;
