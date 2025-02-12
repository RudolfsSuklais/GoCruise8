const express = require("express");
const router = express.Router();
const {
    addCar,
    getCars,
    getCarById,
    deleteCar,
    updateCar,
} = require("../controllers/carController");

router.post("/add-car", addCar);

router.get("/cars", getCars);

router.get("/car/:carID", getCarById);

router.delete("/cars/:carID", deleteCar);

router.put("/car/:carID", updateCar);

module.exports = router;
