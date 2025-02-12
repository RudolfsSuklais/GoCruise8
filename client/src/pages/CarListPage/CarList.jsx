import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import LoadingSpin from "../../components/LoadingSpin";
import CarCard from "./components/CarCard";
import { errorMessages } from "../../constants/constants";
import "./CarList.css";
import { CalculateTotalPrice } from "../../Helpers/CalculateTotalPrice";

function CarList() {
    const { state } = useLocation();
    const { pickupDate, dropoffDate } = state || {};
    const [availableCars, setAvailableCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMake, setSelectedMake] = useState("");
    const [selectedTransmission, setSelectedTransmission] = useState("");
    const [pickupDateInput, setPickupDateInput] = useState(pickupDate || "");
    const [dropoffDateInput, setDropoffDateInput] = useState(dropoffDate || "");
    const [hoveredCarID, setHoveredCarID] = useState(null);
    const [cars, setCars] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [sortByPrice, setSortByPrice] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uniqueMakes, setUniqueMakes] = useState([]);
    const [notification, setNotification] = useState("");

    const getLocalISOString = (date) => {
        const localDate = new Date(date);
        const offset = localDate.getTimezoneOffset();
        localDate.setMinutes(localDate.getMinutes() - offset);
        return localDate.toISOString().slice(0, 16);
    };

    const now = new Date();
    const minPickupDate = getLocalISOString(now);

    useEffect(() => {
        const makes = [...new Set(availableCars.map((car) => car.carMake))];
        setUniqueMakes(makes);
    }, [availableCars]);

    const fetchCars = async () => {
        try {
            const response = await axios.get("/cars");
            setCars(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error(errorMessages.ERROR_GET_CARS, error);
            setIsLoading(false);
        }
    };

    const fetchReservations = async () => {
        try {
            const response = await axios.get("/reservations");
            if (response?.data && Array.isArray(response.data)) {
                setReservations(response.data);
                setIsLoading(false);
            } else {
                throw new Error(errorMessages.ERROR_DATA_FORMAT);
            }
        } catch (error) {
            console.error(errorMessages.ERROR_GET_RESERVATIONS, error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
        fetchReservations();
    }, []);

    useEffect(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        now.setHours(now.getHours() - 2);

        const start = new Date(pickupDateInput);
        const end = new Date(dropoffDateInput);

        if (start < now || start >= end) {
            setAvailableCars([]);
            setFilteredCars([]);
            setNotification("Please select valid pick-up and drop-off dates.");
            return;
        }

        const filtered = cars.filter((car) => {
            const carReservations = reservations.filter(
                (res) => res.carID === car.carID
            );

            return carReservations.every((res) => {
                const resStart = new Date(res.startDate);
                const resEnd = new Date(res.endDate);

                return end <= resStart || start >= resEnd;
            });
        });

        setAvailableCars(filtered);
        setFilteredCars(filtered);
    }, [pickupDateInput, dropoffDateInput, cars, reservations]);

    useEffect(() => {
        let filteredList = availableCars.filter((car) => {
            const matchesSearch =
                car.carMake.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.carModel.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesMake =
                selectedMake === "" || car.carMake === selectedMake;
            const matchesTransmission =
                selectedTransmission === "" ||
                car.transmission === selectedTransmission;

            return matchesSearch && matchesMake && matchesTransmission;
        });

        if (sortByPrice) {
            filteredList = filteredList.sort((a, b) => {
                const priceA = CalculateTotalPrice(
                    a,
                    pickupDateInput,
                    dropoffDateInput
                );
                const priceB = CalculateTotalPrice(
                    b,
                    pickupDateInput,
                    dropoffDateInput
                );
                return sortByPrice === "price-asc"
                    ? priceA - priceB
                    : priceB - priceA;
            });
        }

        setFilteredCars(filteredList);
    }, [
        searchQuery,
        selectedMake,
        selectedTransmission,
        sortByPrice,
        availableCars,
        pickupDateInput,
        dropoffDateInput,
    ]);

    if (isLoading) {
        return <LoadingSpin />;
    }

    if (error) {
        return (
            <div>
                <h1>Error</h1>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="car-list">
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="car-list-dropdown-wrapper">
                    <div className="car-list-dropdown">
                        <div className="car-list-dropdown-date-input">
                            <label>Pick-up date:</label>
                            <input
                                type="datetime-local"
                                value={pickupDateInput}
                                onChange={(e) =>
                                    setPickupDateInput(e.target.value)
                                }
                                required
                                min={minPickupDate}
                                max={dropoffDateInput}
                            />
                        </div>

                        <div className="car-list-dropdown-date-input">
                            <label>Drop-off date:</label>
                            <input
                                type="datetime-local"
                                value={dropoffDateInput}
                                onChange={(e) =>
                                    setDropoffDateInput(e.target.value)
                                }
                                required
                                min={pickupDateInput}
                            />
                        </div>
                    </div>
                </div>
            </form>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search cars..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                    value={selectedMake}
                    onChange={(e) => setSelectedMake(e.target.value)}>
                    <option value="">All Makes</option>
                    {uniqueMakes.map((make) => (
                        <option key={make} value={make}>
                            {make}
                        </option>
                    ))}
                </select>

                <div className="filters-sort-by-price">
                    <select
                        value={sortByPrice}
                        onChange={(e) => setSortByPrice(e.target.value)}>
                        <option value="" disabled hidden>
                            Price
                        </option>
                        <option value="price-asc">Low to High</option>
                        <option value="price-desc">High to Low</option>
                    </select>
                </div>

                <select
                    value={selectedTransmission}
                    onChange={(e) => setSelectedTransmission(e.target.value)}>
                    <option value="">All Transmissions</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                </select>
            </div>

            {filteredCars.length > 0 ? (
                <h3 className="cars-available">
                    {filteredCars.length} cars available
                </h3>
            ) : null}

            {filteredCars.length > 0 ? (
                filteredCars.map((car) => (
                    <CarCard
                        key={car.carID}
                        car={car}
                        pickupDateInput={pickupDateInput}
                        dropoffDateInput={dropoffDateInput}
                        hoveredCarID={hoveredCarID}
                        setHoveredCarID={setHoveredCarID}
                    />
                ))
            ) : (
                <h3 className="cars-available">{notification}</h3>
            )}
        </div>
    );
}

export default CarList;
