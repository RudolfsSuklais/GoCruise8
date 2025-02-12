import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, message, Input } from "antd";
import "./AllCars.css";
import LoadingSpin from "../../components/LoadingSpin";
import { errorMessages } from "../../constants/constants";

function AllCars() {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCarID, setSelectedCarID] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("A-Z");
    const apiBaseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/cars`);
                if (response?.data && Array.isArray(response.data)) {
                    setCars(response.data);
                    setFilteredCars(response.data);
                    setIsLoading(false);
                } else {
                    throw new Error(errorMessages.ERROR_DATA_FORMAT);
                }
            } catch (error) {
                console.error(errorMessages.ERROR_GET_CARS, error);
                setIsLoading(false);
            }
        };
        fetchCars();
    }, []);

    useEffect(() => {
        const filtered = cars.filter(
            (car) =>
                car.carMake.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.carModel
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                (
                    car.carMake.toLowerCase() +
                    " " +
                    car.carModel.toLowerCase()
                ).includes(searchQuery.toLowerCase())
        );
        setFilteredCars(filtered);
    }, [searchQuery]);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    useEffect(() => {
        if (sortOption === "A-Z") {
            setFilteredCars((prevCars) =>
                [...prevCars].sort((a, b) => a.carMake.localeCompare(b.carMake))
            );
        } else if (sortOption === "Z-A") {
            setFilteredCars((prevCars) =>
                [...prevCars].sort((a, b) => b.carMake.localeCompare(a.carMake))
            );
        }
    }, [sortOption]);

    const showModal = (carID) => {
        setSelectedCarID(carID);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedCarID(null);
    };

    const handleDelete = async () => {
        if (!selectedCarID) return;

        try {
            console.log("Deleting car with ID:", selectedCarID);
            await axios.delete(`${apiBaseURL}/cars/${selectedCarID}`);

            setCars((prevCars) =>
                prevCars.filter((car) => car.carID !== selectedCarID)
            );
            setIsModalVisible(false);
            message.success("Car deleted successfully!");
            window.location.reload();
        } catch (error) {
            console.error(errorMessages.ERROR_DELETING_CAR, error);
            message.error("Failed to delete the car.");
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    if (isLoading) {
        return <LoadingSpin />;
    }

    return (
        <div className="all-cars">
            <div className="search-sort-container">
                <label>Search car by make: </label>
                <Input
                    placeholder="Search by make or model..."
                    value={searchQuery}
                    onChange={handleSearch}
                    style={{ width: 300, marginRight: 10 }}
                />
                <div className="sort-container">
                    <label>Sort by: </label>
                    <select value={sortOption} onChange={handleSortChange}>
                        <option value="A-Z">A-Z</option>
                        <option value="Z-A">Z-A</option>
                    </select>
                </div>
                <p className="cars-available">
                    {filteredCars.length} car
                    {filteredCars.length > 1 ? "s" : ""} available
                </p>
            </div>
            <div className="all-cars-page">
                {filteredCars.map((car, index) => (
                    <div key={index} className="all-cars-card-container">
                        <div className="all-cars-card-image-container">
                            <img
                                src={car.image}
                                alt={`${car.carMake} ${car.carModel}`}
                            />
                        </div>
                        <div className="all-cars-card-text-container">
                            <h3>
                                {car.carMake} {car.carModel}
                            </h3>
                            <p>
                                <i>{car.carYear}</i>
                            </p>
                        </div>
                        <div className="all-cars-card-btn-container">
                            <div className="all-car-card-see-more-btn-container">
                                <button
                                    onClick={() =>
                                        (window.location.href = `/car/${car.carID}`)
                                    }>
                                    See More
                                </button>
                            </div>
                            <button onClick={() => showModal(car.carID)}>
                                <span className="fa-solid fa-trash"></span>
                            </button>
                        </div>
                    </div>
                ))}

                <Modal
                    title="Confirm Delete"
                    open={isModalVisible}
                    onOk={handleDelete}
                    onCancel={handleCancel}
                    okText="Delete"
                    cancelText="Cancel">
                    <p>Are you sure you want to delete this car?</p>
                </Modal>
            </div>
        </div>
    );
}

export default AllCars;
