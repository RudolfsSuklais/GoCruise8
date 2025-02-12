const express = require("express");
const router = express.Router();
const {
    addReservations,
    getReservations,
    getReservationById,
    deleteReservation,
} = require("../controllers/reservationController");

router.post("/add-reservation", addReservations);
router.get("/reservations", getReservations);
router.get("/reservations/:reservationID", getReservationById);
router.delete("/reservations/:reservationID", deleteReservation);

module.exports = router;
