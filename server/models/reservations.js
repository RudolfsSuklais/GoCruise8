const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
    reservationID: String,
    userID: String,
    carID: String,
    carMake: String,
    carModel: String,
    carYear: Number,
    carImage: String,
    startDate: Date,
    endDate: Date,
    totalPrice: Number,
    name: String,
    lastName: String,
    email: String,
    address: String,
    phone: String,
    city: String,
    country: String,
    postalCode: String,
    birthday: Date,
});

module.exports = mongoose.model("reservations", reservationSchema);
