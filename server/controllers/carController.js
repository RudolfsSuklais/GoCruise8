const Car = require("../models/cars");
const { v4: uuidv4 } = require("uuid");
const {
    errorMessages,
    successMessages,
    errorStatusCode,
    successStatusCode,
} = require("../constants/constant");

const addCar = async (req, res) => {
    try {
        const {
            carMake,
            carModel,
            engine,
            wheelDrive,
            fuelType,
            horsePower,
            carYear,
            color,
            transmission,
            image,
            pricePer1h,
            pricePer2h,
            pricePer5h,
            pricePer24h,
            seats,
        } = req.body;

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
            return res
                .status(errorStatusCode.BAD_REQUEST)
                .json({ error: errorMessages.ERROR_ALL_FIELDS_REQUIRED });
        }

        const newCar = new Car({
            carID: uuidv4(),
            carMake,
            carModel,
            engine,
            wheelDrive,
            fuelType,
            horsePower,
            carYear,
            color,
            transmission,
            image,
            pricePer1h,
            pricePer2h,
            pricePer5h,
            pricePer24h,
            seats,
        });

        await newCar.save();
        return res
            .status(successStatusCode.CREATED)
            .json({ message: successMessages.SUCCESS_CAR_ADDED, car: newCar });
    } catch (error) {
        console.error(error);
        return res
            .status(errorStatusCode.SERVER_ERROR)
            .json({ error: errorMessages.ERROR_ADD_CAR });
    }
};

const getCars = async (req, res) => {
    try {
        const cars = await Car.find();

        return res.json(cars);
    } catch (error) {
        console.error(error);
        return res
            .status(errorStatusCode.SERVER_ERROR)
            .json({ error: errorMessages.ERROR_GET_CARS });
    }
};

const getCarById = async (req, res) => {
    try {
        const car = await Car.findOne({ carID: req.params.carID });

        if (!car) {
            return res
                .status(errorStatusCode.NOT_FOUND)
                .json({ error: errorMessages.CAR_NOT_FOUND });
        }

        return res.json(car);
    } catch (error) {
        console.error(error);
        return res
            .status(errorStatusCode.SERVER_ERROR)
            .json({ error: errorMessages.ERROR_GET_CAR });
    }
};

const deleteCar = async (req, res) => {
    try {
        const { carID } = req.params;
        const deletedCar = await Car.findOneAndDelete({ carID });

        if (!deletedCar) {
            return res
                .status(errorStatusCode.NOT_FOUND)
                .json({ error: errorMessages.ERROR_CAR_NOT_FOUND });
        }

        res.json({ message: successMessages.SUCCESS_DELETE_CAR });
    } catch (error) {
        console.error(error);
        res.status(errorStatusCode.SERVER_ERROR).json({
            error: errorMessages.ERROR_DELETE_CAR,
        });
    }
};

const updateCar = async (req, res) => {
    try {
        const { carID } = req.params;
        const updatedCar = req.body;
        const result = await Car.findOneAndUpdate({ carID }, updatedCar, {
            new: true,
        });

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(errorStatusCode.SERVER_ERROR).json({
            error: errorMessages.ERROR_UPDATE_CAR,
        });
    }
};

module.exports = {
    addCar,
    getCars,
    getCarById,
    deleteCar,
    updateCar,
};
