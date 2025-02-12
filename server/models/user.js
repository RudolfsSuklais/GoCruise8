const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    userID: String,
    name: String,
    lastName: String,
    phone: String,
    address: String,
    city: String,
    country: String,
    postalCode: String,
    birthday: {
        type: Date,
    },
    email: {
        type: String,
        unique: true,
    },
    password: String,
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
