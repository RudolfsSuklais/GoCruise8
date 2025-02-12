const Reservation = require("../models/reservations");
const {
    errorMessages,
    successMessages,
    errorStatusCode,
    successStatusCode,
} = require("../constants/constant");

const addReservations = async (req, res) => {
    try {
        const newReservation = new Reservation(req.body);

        await newReservation.save();
        res.status(successStatusCode.CREATED).json(newReservation);
    } catch (error) {
        console.error(error);
        res.status(errorStatusCode.SERVER_ERROR).json({
            error: errorMessages.ERROR_ADD_RESERVATION,
        });
    }
};

const getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();

        res.json(reservations);
    } catch (error) {
        console.error(error);
        res.status(errorStatusCode.SERVER_ERROR).json({
            error: errorMessages.ERROR_GET_RESERVATIONS,
        });
    }
};

const getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findOne({
            reservationID: req.params.reservationID,
        });

        if (!reservation) {
            return res
                .status(errorStatusCode.NOT_FOUND)
                .json({ error: errorMessages.ERROR_RESERVATION_NOT_FOUND });
        }
        res.json(reservation);
    } catch (error) {
        console.error(error);
        res.status(errorStatusCode.SERVER_ERROR).json({
            error: errorMessages.ERROR_GET_RESERVATION,
        });
    }
};

const deleteReservation = async (req, res) => {
    try {
        const { reservationID } = req.params;

        const deletedReservation = await Reservation.findOneAndDelete({
            reservationID,
        });

        if (!deletedReservation) {
            return res
                .status(errorStatusCode.NOT_FOUND)
                .json({ error: errorMessages.ERROR_RESERVATION_NOT_FOUND });
        }

        res.json({ message: successMessages.SUCCESS_RESERVATION_DELETED });
    } catch (error) {
        console.error(error);
        res.status(errorStatusCode.SERVER_ERROR).json({
            error: errorMessages.ERROR_DELETE_RESERVATION,
        });
    }
};

module.exports = {
    addReservations,
    getReservations,
    getReservationById,
    deleteReservation,
};
