import React, { useState } from "react";
import "./AddCar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { errorMessages, successMessages } from "../../../constants/constants";

function AddCar() {
    const [carMake, setCarMake] = useState("");
    const [carModel, setCarModel] = useState("");
    const [engine, setEngine] = useState("");
    const [color, setColor] = useState("");
    const [carYear, setCarYear] = useState(null);
    const [pricePer1h, setPricePer1h] = useState(null);
    const [wheelDrive, setWheelDrive] = useState("");
    const [fuelType, setFuelType] = useState("");
    const [horsePower, setHorsePower] = useState(null);
    const [transmission, setTransmission] = useState("");
    const [image, setImage] = useState("");
    const [pricePer2h, setPricePer2h] = useState(null);
    const [pricePer5h, setPricePer5h] = useState(null);
    const [pricePer24h, setPricePer24h] = useState(null);
    const [seats, setSeats] = useState("");

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

    const apiBaseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !carMake ||
            !carModel ||
            !engine ||
            !wheelDrive ||
            !fuelType ||
            !horsePower ||
            !carYear ||
            !color ||
            !transmission ||
            !image ||
            !pricePer1h ||
            !pricePer2h ||
            !pricePer5h ||
            !pricePer24h ||
            !seats
        ) {
            toast.error(errorMessages.ERROR_FILL_OUT_FIELDS);
            return;
        }

        const currentYear = new Date().getFullYear();

        if (carYear < 1850 || carYear > currentYear) {
            toast.error(`Car year must be between 1850 and ${currentYear}.`);
            return;
        }

        if (
            pricePer1h < 1 ||
            pricePer2h < 1 ||
            pricePer5h < 1 ||
            pricePer24h < 1
        ) {
            toast.error("Price must be greater than or equal to 1.");
            return;
        }

        if (horsePower < 20) {
            toast.error("Horse power must be more than 20.");
            return;
        }

        if (horsePower > 10000) {
            toast.error("Horse power must be less than 10000.");
            return;
        }

        if (seats <= 0) {
            toast.error("Seats must be a positive number.");
            return;
        }

        const newCar = {
            carMake: carMake.trim(),
            carModel: carModel.trim(),
            engine: engine.trim(),
            wheelDrive: wheelDrive.trim(),
            fuelType: fuelType.trim(),
            horsePower: Number(horsePower),
            carYear: Number(carYear),
            color: color.trim(),
            transmission: transmission.trim(),
            image: image.trim(),
            pricePer1h: Number(pricePer1h),
            pricePer2h: Number(pricePer2h),
            pricePer5h: Number(pricePer5h),
            pricePer24h: Number(pricePer24h),
            seats: Number(seats),
        };

        try {
            const response = await axios.post(`${apiBaseURL}/add-car`, newCar, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            toast.success(successMessages.SUCCESS_CAR_ADDED);

            if (response.data && response.data.car && response.data.car.carID) {
                navigate(`/car/${response.data.car.carID}`);
            }
        } catch (error) {
            console.error(
                errorMessages.ERROR_ADDING_CAR,
                error.response?.data || error.message
            );
            toast.error(errorMessages.ERROR_ADDING_CAR);
        }
    };

    return (
        <div className="add-car-container">
            <h2>Add New Car</h2>
            <form onSubmit={handleSubmit}>
                <div className="add-car-form-input-wrapper">
                    <div className="add-car-form-wrapper">
                        <input
                            required
                            type="text"
                            value={carMake}
                            onChange={(e) => setCarMake(e.target.value)}
                            placeholder="Enter car make"
                            maxLength={25}
                            onKeyDown={(e) => {
                                if (
                                    !/^[A-Za-zĀ-ž\s]$/.test(e.key) &&
                                    e.key !== "Backspace"
                                ) {
                                    e.preventDefault();
                                }
                            }}
                        />
                        <input
                            required
                            type="text"
                            value={carModel}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^[a-zA-Z0-9]*$/.test(value)) {
                                    setCarModel(value);
                                }
                            }}
                            placeholder="Enter car model"
                            maxLength={25}
                        />

                        <input
                            required
                            type="text"
                            value={engine}
                            placeholder="Enter car engine"
                            maxLength={25}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^[a-zA-Z0-9]*$/.test(value)) {
                                    setEngine(value);
                                }
                            }}
                        />

                        <select
                            required
                            value={wheelDrive}
                            onChange={(e) => setWheelDrive(e.target.value)}
                            placeholder="Enter car wheel drive">
                            <option disabled hidden value="">
                                Select wheel drive
                            </option>
                            {wheelDriveOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <select
                            required
                            value={fuelType}
                            onChange={(e) => setFuelType(e.target.value)}
                            placeholder="Enter car fuel type">
                            <option disabled hidden value="">
                                Select fuel type
                            </option>
                            {fuelTypeOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="add-car-form-wrapper">
                        <input
                            required
                            type="number"
                            value={horsePower ?? ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,5}$/.test(value)) {
                                    setHorsePower(value);
                                }
                            }}
                            placeholder="Enter car horse power"
                            min={1}
                            max={4000}
                        />
                        <input
                            required
                            type="text"
                            value={carYear ?? ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,4}$/.test(value)) {
                                    setCarYear(value);
                                }
                            }}
                            placeholder="Enter car year"
                            maxLength={4}
                        />

                        <select
                            required
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            placeholder="Enter car color">
                            <option disabled hidden value="">
                                Select color
                            </option>
                            {colorOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <select
                            required
                            value={transmission}
                            onChange={(e) => setTransmission(e.target.value)}
                            placeholder="Enter car transmission type">
                            <option disabled hidden value="">
                                Select transmission
                            </option>
                            {transmissionOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <input
                            required
                            type="URL"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="Enter car image URL"
                        />
                    </div>
                    <div className="add-car-form-wrapper">
                        <input
                            required
                            type="number"
                            value={pricePer1h ?? ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,5}$/.test(value)) {
                                    setPricePer1h(value);
                                }
                            }}
                            placeholder="Enter car price per 1 hour"
                            maxLength={5}
                        />
                        <input
                            required
                            type="number"
                            value={pricePer2h ?? ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,5}$/.test(value)) {
                                    setPricePer2h(value);
                                }
                            }}
                            placeholder="Enter car price per 2 hour"
                            maxLength={5}
                        />

                        <input
                            required
                            type="number"
                            value={pricePer5h ?? ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,5}$/.test(value)) {
                                    setPricePer5h(value);
                                }
                            }}
                            placeholder="Enter car price per 5 hour"
                            min={1}
                            maxLength={5}
                        />
                        <input
                            required
                            type="number"
                            value={pricePer24h ?? ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,5}$/.test(value)) {
                                    setPricePer24h(value);
                                }
                            }}
                            placeholder="Enter car price per 24 hour"
                            min={1}
                            maxLength={5}
                        />
                        <select
                            required
                            value={seats}
                            onChange={(e) => setSeats(e.target.value)}
                            placeholder="Enter car seat number">
                            <option disabled hidden value="">
                                Select seat number
                            </option>
                            {seatsOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default AddCar;
