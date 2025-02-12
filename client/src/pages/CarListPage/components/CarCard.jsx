import React from "react";
import { useNavigate } from "react-router-dom";
import { CalculateTotalPrice } from "../../../Helpers/CalculateTotalPrice";

function CarCard({
    car,
    pickupDateInput,
    dropoffDateInput,
    hoveredCarID,
    setHoveredCarID,
}) {
    const navigate = useNavigate();
    const totalPrice = CalculateTotalPrice(
        car,
        pickupDateInput,
        dropoffDateInput
    );

    const handleBtnClick = () => {
        navigate(`/booking/${car.carID}`, {
            state: {
                pickupDate: pickupDateInput,
                dropoffDate: dropoffDateInput,
            },
        });
    };

    return (
        <div key={car.carID} className="car-list-card">
            <div className="car-list-card-image">
                <i
                    className="fa-solid fa-tag"
                    onMouseEnter={() => setHoveredCarID(car.carID)}
                    onMouseLeave={() => setHoveredCarID(null)}></i>
                <img src={car.image} alt={`${car.carMake} ${car.carModel}`} />
                {hoveredCarID === car.carID && (
                    <div className="car-list-card-image-overlay">
                        <p>
                            <b>Price for 1 hour: </b>
                            {`${car.pricePer1h} €`}
                        </p>
                        <p>
                            <b>Price for 2 hours: </b>
                            {`${car.pricePer2h} €`}
                        </p>
                        <p>
                            <b>Price for 5 hours: </b>
                            {`${car.pricePer5h} €`}
                        </p>
                        <p>
                            <b>Price for 1 day: </b>
                            {`${car.pricePer24h} €`}
                        </p>
                    </div>
                )}
            </div>
            <div className="car-list-card-details">
                <h2>
                    {car.carMake} {car.carModel}
                </h2>
                <p>
                    <span className="fa-solid fa-car"></span>
                    &nbsp;
                    {car.engine}
                </p>
                <p>
                    <span className="fa-solid fa-gear"></span>
                    &nbsp;
                    {car.transmission}
                </p>
                <p>
                    <span className="fa-solid fa-chair"></span>
                    &nbsp;
                    {car.seats} Seats
                </p>
                <p>
                    <span className="fa-regular fa-calendar"></span>
                    &nbsp;
                    {car.carYear}
                </p>
                <p>
                    <span className="fa-solid fa-gas-pump"></span>
                    &nbsp; {car.fuelType}
                </p>
            </div>
            <div className="car-list-card-button">
                <div className="car-list-card-price-for-1-day">
                    <p>Total price:</p>
                    <h3>{totalPrice} €</h3>
                </div>
                <button onClick={handleBtnClick} className="view-deal-btn">
                    View Deal
                </button>
            </div>
        </div>
    );
}

export default CarCard;
