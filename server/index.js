const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log("Database not connected", err));

const PORT = process.env.REACT_APP_PORT;

app.use(
    cors({
        credentials: true,
        origin: [
            "http://localhost:5173", // For local development
            "https://go-cruise8-4srbgrq4r-rudolfs-projects-a463d814.vercel.app", // First Vercel frontend URL
            "https://go-cruise8-c5i4qp9f7-rudolfs-projects-a463d814.vercel.app",
        ],
    })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const carRoutes = require("./routes/carRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

app.use("/", carRoutes);
app.use("/", reservationRoutes);
app.use("/", require("./routes/authRoutes"));

const portServer = process.env.REACT_SERVER_PORT;
app.listen(portServer, () =>
    console.log(`Server is running on port: ${portServer}`)
);
