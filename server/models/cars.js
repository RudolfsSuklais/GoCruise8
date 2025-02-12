const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    carID: {
        type: String,
        unique: true,
        required: true,
    },
    carMake: String,
    carModel: String,
    engine: String,
    wheelDrive: String,
    fuelType: String,
    horsePower: Number,
    carYear: Number,
    color: String,
    transmission: String,
    image: String,
    pricePer1h: Number,
    pricePer2h: Number,
    pricePer5h: Number,
    pricePer24h: Number,
    seats: Number,
});

module.exports = mongoose.model("Car", carSchema);
