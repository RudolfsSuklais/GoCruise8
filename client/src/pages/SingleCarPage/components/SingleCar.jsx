import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SingleCar.css";
import toast from "react-hot-toast";
import { errorMessages, successMessages } from "../../../constants/constants";
import LoadingSpin from "../../../components/LoadingSpin";

function SingleCar() {
    const { carID } = useParams();
    const [countdown, setCountdown] = useState(5);
    const [carMake, setCarMake] = useState("");
    const navigate = useNavigate();
    const [carModel, setCarModel] = useState("");
    const [car, setCar] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInputDisabled, setIsInputDisabled] = useState(true);
    const [wheelDrive, setWheelDrive] = useState("");
    const [color, setColor] = useState("");
    const [seats, setSeats] = useState("");
    const [transmission, setTransmission] = useState("");
    const [fuelType, setFuelType] = useState("");

    const apiBaseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

    const transmissionOptions = ["Automatic", "Manual"];
    const fuelTypeOptions = ["Petrol", "Diesel", "Electric", "Hybrid"];
    const wheelDriveOptions = [
        "Front Wheel Drive",
        "Rear Wheel Drive",
        "All Wheel Drive",
    ];
    const colorOptions = [
        "Red",
        "Blue",
        "Green",
        "Black",
        "White",
        "Brown",
        "Gray",
        "Beige",
        "Silver",
    ];
    const seatsOptions = [2, 3, 4, 5, 6, 7, 8];

    const fetchCar = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(`${apiBaseURL}/car/${carID}`);

            if (!response.data || typeof response.data !== "object") {
                throw new Error(errorMessages.ERROR_GET_CARS);
            }

            const {
                wheelDrive,
                color,
                seats,
                transmission,
                fuelType,
                carMake,
                carModel,
            } = response.data;

            setCar(response.data);
            setCarMake(carMake || "Unknown");
            setCarModel(carModel || "Unknown");
            setWheelDrive(wheelDrive || "Unknown");
            setColor(color || "Unknown");
            setSeats(seats || "Unknown");
            setTransmission(transmission || "Unknown");
            setFuelType(fuelType || "Unknown");
        } catch (err) {
            console.error(err);
            setError(err.message || ERROR_GET_CARS);
            setTimeout(() => {
                navigate("/all-cars");
            }, 5000);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCar();
    }, [carID]);

    useEffect(() => {
        if (error) {
            if (countdown === 0) {
                navigate("/all-cars");
            } else {
                const timer = setInterval(() => {
                    setCountdown((prev) => prev - 1);
                }, 1000);

                return () => clearInterval(timer);
            }
        }
    }, [countdown, error, navigate]);

    if (isLoading) {
        return <LoadingSpin />;
    }

    if (error) {
        return (
            <div className="single-car-container">
                <h1>We couldn't find the car you were looking for!</h1>
                <p>You will be redirected to All Cars in {countdown}...</p>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="single-car-container">
                <h1>Car Not Found</h1>
                <p>We couldn't find the car you're looking for.</p>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentYear = new Date().getFullYear();

        const {
            carMake,
            carModel,
            carEngine,
            wheelDrive,
            fuelType,
            horsePower,
            carYear,
            color,
            transmission,
            seats,
            image,
            pricePer1h,
            pricePer2h,
            pricePer5h,
            pricePer24h,
        } = e.target;

        const carYearValue = parseInt(carYear.value);
        const horsePowerValue = parseInt(horsePower.value);
        const seatsValue = parseInt(seats.value);

        if (
            !carMake.value ||
            !carModel.value ||
            !carEngine.value ||
            !carYear.value
        ) {
            toast.error("Please fill in all required fields.");
            setIsInputDisabled(!isInputDisabled);
            return;
        }

        if (
            isNaN(carYearValue) ||
            carYearValue < 1850 ||
            carYearValue > currentYear
        ) {
            toast.error(`Car year must be between 1850 and ${currentYear}.`);
            setIsInputDisabled(!isInputDisabled);
            return;
        }

        if (
            pricePer1h.value < 1 ||
            pricePer2h.value < 1 ||
            pricePer5h.value < 1 ||
            pricePer24h.value < 1
        ) {
            toast.error("Price must be greater than or equal to 1.");
            setIsInputDisabled(!isInputDisabled);
            return;
        }

        if (isNaN(horsePowerValue) || horsePowerValue < 20) {
            toast.error("Horse power must be more than 20.");
            setIsInputDisabled(!isInputDisabled);
            return;
        }

        if (horsePowerValue > 10000) {
            toast.error("Horse power must be less than 10000.");
            setIsInputDisabled(!isInputDisabled);
            return;
        }

        if (isNaN(seatsValue) || seatsValue <= 0) {
            toast.error("Seats must be a positive number.");
            setIsInputDisabled(!isInputDisabled);
            return;
        }

        const priceRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
        if (
            !priceRegex.test(pricePer1h.value) ||
            !priceRegex.test(pricePer2h.value) ||
            !priceRegex.test(pricePer5h.value) ||
            !priceRegex.test(pricePer24h.value)
        ) {
            toast.error("Please enter a valid price.");
            setIsInputDisabled(!isInputDisabled);
            return;
        }

        const nonNumericRegex = /^[a-zA-Z\s]+$/;
        if (!nonNumericRegex.test(carMake.value)) {
            toast.error("Car make must only contain letters.");
            setIsInputDisabled(!isInputDisabled);
            return;
        }

        const updatedCar = {
            carMake: carMake.value,
            carModel: carModel.value,
            engine: carEngine.value,
            wheelDrive: wheelDrive.value,
            fuelType: fuelType.value,
            horsePower: horsePower.value,
            carYear: carYear.value,
            color: color.value,
            transmission: transmission.value,
            seats: seats.value,
            image: image.value,
            pricePer1h: pricePer1h.value,
            pricePer2h: pricePer2h.value,
            pricePer5h: pricePer5h.value,
            pricePer24h: pricePer24h.value,
        };

        setCarMake(carMake.value);
        setCarModel(carModel.value);

        try {
            await axios.put(`${apiBaseURL}/car/${carID}`, updatedCar);
            toast.success(successMessages.SUCCESS_CAR_UPDATED);
            setIsLoading(false);
        } catch (err) {
            setError(errorMessages.ERROR_UPDATING_CAR);
            setIsLoading(false);
        }
    };

    function cancelEdit() {
        setIsInputDisabled(true);
        fetchCar();
    }

    const handleKeyPress = (e, type) => {
        if (type === "text" && /[^a-zA-Z\s]/.test(e.key)) {
            e.preventDefault();
        }
        if (type === "number" && /[^0-9]/.test(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <div className="single-car-container">
            <div className="single-car-image-heading">
                <h1>
                    {carMake} {carModel}
                </h1>
                <div className="single-car-image">
                    <img
                        src={car.image}
                        alt={`${car.carMake} ${car.carModel}`}
                    />
                </div>
            </div>
            <div className="single-car-details">
                <div
                    className="edit-button"
                    style={{ display: isInputDisabled ? "" : "none" }}>
                    <button
                        onClick={() => setIsInputDisabled(!isInputDisabled)}>
                        <span className="fa-regular fa-pen-to-square"></span>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="single-car-inputs">
                        <div className={isInputDisabled ? "not-editing" : ""}>
                            <label>
                                Make:
                                <input
                                    autoFocus
                                    type="text"
                                    defaultValue={car.carMake}
                                    disabled={isInputDisabled}
                                    name="carMake"
                                    onKeyPress={(e) =>
                                        handleKeyPress(e, "text")
                                    }
                                    maxLength={25}
                                />
                            </label>
                        </div>
                        <div className={isInputDisabled ? "not-editing" : ""}>
                            <label>
                                Model:
                                <input
                                    type="text"
                                    defaultValue={car.carModel}
                                    disabled={isInputDisabled}
                                    name="carModel"
                                    onKeyPress={(e) =>
                                        handleKeyPress(e, "text")
                                    }
                                    maxLength={25}
                                />
                            </label>
                        </div>
                        <div className={isInputDisabled ? "not-editing" : ""}>
                            <label>
                                Engine:
                                <input
                                    type="text"
                                    defaultValue={car.engine}
                                    disabled={isInputDisabled}
                                    name="carEngine"
                                    maxLength={25}
                                />
                            </label>
                        </div>
                        <div className={isInputDisabled ? "not-editing" : ""}>
                            <label>
                                Wheel Drive:
                                <select
                                    required
                                    value={wheelDrive}
                                    onChange={(e) =>
                                        setWheelDrive(e.target.value)
                                    }
                                    disabled={isInputDisabled}
                                    name="wheelDrive">
                                    <option disabled hidden value="">
                                        Select wheel drive
                                    </option>
                                    {wheelDriveOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className={isInputDisabled ? "not-editing" : ""}>
                            <label>
                                Fuel Type:
                                <select
                                    required
                                    value={fuelType}
                                    onChange={(e) =>
                                        setFuelType(e.target.value)
                                    }
                                    disabled={isInputDisabled}
                                    name="fuelType">
                                    <option disabled hidden value="">
                                        Select fuel type
                                    </option>
                                    {fuelTypeOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className={isInputDisabled ? "not-editing" : ""}>
                            <label>
                                Horse Power:
                                <input
                                    type="text"
                                    defaultValue={car.horsePower}
                                    disabled={isInputDisabled}
                                    name="horsePower"
                                    onKeyPress={(e) =>
                                        handleKeyPress(e, "number")
                                    }
                                />
                            </label>
                        </div>
                        <div className={isInputDisabled ? "not-editing" : ""}>
                            <label>
                                Year:
                                <input
                                    type="text"
                                    defaultValue={car.carYear}
                                    disabled={isInputDisabled}
                                    name="carYear"
                                    onKeyPress={(e) =>
                                        handleKeyPress(e, "number")
                                    }
                                />
                            </label>
                        </div>
                        <div className={isInputDisabled ? "not-editing" : ""}>
                            <label>
                                Color:
                                <select
                                    required
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    disabled={isInputDisabled}
                                    name="color">
                                    <option disabled hidden value="">
                                        Select color
                                    </option>
                                    {colorOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className={isInputDisabled ? "not-editing" : ""}>
                            <label>
                                Transmission:
                                <select
                                    required
                                    value={transmission}
                                    onChange={(e) =>
                                        setTransmission(e.target.value)
                                    }
                                    disabled={isInputDisabled}
                                    name="transmission">
                                    <option disabled hidden value="">
                                        Select transmission
                                    </option>
                                    {transmissionOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className={isInputDisabled ? "not-editing" : ""}>
                            <label>
                                Seats:
                                <select
                                    required
                                    value={seats}
                                    onChange={(e) => setSeats(e.target.value)}
                                    disabled={isInputDisabled}
                                    name="seats">
                                    <option disabled hidden value="">
                                        Select seats
                                    </option>
                                    {seatsOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className={isInputDisabled ? "not-editing" : ""}>
                            <label>
                                Image:
                                <input
                                    type="url"
                                    defaultValue={car.image}
                                    disabled={isInputDisabled}
                                    name="image"
                                />
                            </label>
                        </div>
                        <div className={isInputDisabled ? "not-editing" : ""}>
                            <label>
                                Price per 1h:
                                <input
                                    type="text"
                                    defaultValue={car.pricePer1h}
                                    disabled={isInputDisabled}
                                    name="pricePer1h"
                                    onKeyPress={(e) =>
                                        handleKeyPress(e, "number")
                                    }
                                    maxLength={5}
                                />
                            </label>
                        </div>
                        <div className={isInputDisabled ? "not-editing" : ""}>
                            <label>
                                Price per 2h:
                                <input
                                    type="text"
                                    defaultValue={car.pricePer2h}
                                    disabled={isInputDisabled}
                                    name="pricePer2h"
                                    onKeyPress={(e) =>
                                        handleKeyPress(e, "number")
                                    }
                                    maxLength={5}
                                />
                            </label>
                        </div>
                        <div className={isInputDisabled ? "not-editing" : ""}>
                            <label>
                                Price per 5h:
                                <input
                                    type="text"
                                    defaultValue={car.pricePer5h}
                                    disabled={isInputDisabled}
                                    name="pricePer5h"
                                    onKeyPress={(e) =>
                                        handleKeyPress(e, "number")
                                    }
                                    maxLength={5}
                                />
                            </label>
                        </div>
                        <div className={isInputDisabled ? "not-editing" : ""}>
                            <label>
                                Price per 24h:
                                <input
                                    type="text"
                                    defaultValue={car.pricePer24h}
                                    disabled={isInputDisabled}
                                    name="pricePer24h"
                                    onKeyPress={(e) =>
                                        handleKeyPress(e, "number")
                                    }
                                    maxLength={6}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="form-buttons">
                        <button
                            className={
                                isInputDisabled
                                    ? "disabled"
                                    : "edit-cancel-button"
                            }
                            disabled={isInputDisabled}
                            onClick={cancelEdit}
                            type="button">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={
                                isInputDisabled
                                    ? "disabled"
                                    : "edit-save-button"
                            }
                            onClick={() => setIsInputDisabled(true)}>
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SingleCar;
