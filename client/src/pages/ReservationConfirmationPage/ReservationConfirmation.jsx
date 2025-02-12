import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ReservationConfirmation.css";
import { Link } from "react-router-dom";
import LoadingSpin from "../../components/LoadingSpin";
import { errorMessages, successMessages } from "../../constants/constants";

function ReservationConfirmation() {
    const { reservationID } = useParams();
    const [reservation, setReservation] = useState(null);
    const [chosenCar, setChosenCar] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiBaseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

    useEffect(() => {
        const fetchReservation = async () => {
            try {
                setIsLoading(true);

                const response = await axios.get(`${apiBaseURL}/reservations`);

                if (!response.data || !Array.isArray(response.data)) {
                    throw new Error(errorMessages.ERROR_DATA_FORMAT);
                }

                const reservations = response.data;

                const foundReservation = reservations.find(
                    (res) =>
                        res.reservationID?.toString() ===
                        reservationID?.toString()
                );

                if (!foundReservation) {
                    throw new Error(errorMessages.ERROR_NOT_FOUND);
                }

                setReservation(foundReservation);

                const carResponse = await axios.get(
                    `${apiBaseURL}/car/${foundReservation.carID}`
                );

                if (!carResponse.data) {
                    throw new Error(errorMessages.ERROR_CAR_DATA);
                }

                setChosenCar(carResponse.data);
            } catch (err) {
                console.error(err);
                setError(err.message || errorMessages.ERROR_FAILED_FETCH);
            } finally {
                setIsLoading(false);
            }
        };

        if (reservationID) {
            fetchReservation();
        }
    }, [reservationID]);

    if (isLoading) {
        return <LoadingSpin />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!reservation) {
        return (
            <div className="reservation-confirmation-container">
                <h1>Reservation Not Found</h1>
                <p>We couldn't find the reservation you're looking for.</p>
            </div>
        );
    }

    if (!chosenCar) {
        return (
            <div className="reservation-confirmation-container">
                <h1>Car Not Found</h1>
                <p>
                    We couldn't find the car associated with this reservation.
                </p>
            </div>
        );
    }

    return (
        <div className="reservation-confirmation-container">
            <h1>Reservation Confirmed!</h1>
            <div className="reservation-confirmation-card">
                <p>
                    <b>Pick-up date/time:</b>{" "}
                    {new Date(reservation.startDate).toLocaleString()}
                </p>
                <p>
                    <b>Drop-off date/time:</b>{" "}
                    {new Date(reservation.endDate).toLocaleString()}
                </p>
                <p>
                    <b>Total price to pay: </b>
                    {reservation.totalPrice} EUR
                </p>
                <h2>
                    {chosenCar.carMake} {chosenCar.carModel}
                </h2>
                <img src={chosenCar.image} alt="Car" />
            </div>
            <h1>Thank You For Choosing Us!</h1>
            <Link to={"/"}>
                <button className="back-to-home">
                    <span className="fa-solid fa-arrow-left"></span> Back to
                    Home
                </button>
            </Link>
        </div>
    );
}

export default ReservationConfirmation;
