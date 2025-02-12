const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
    test,
    registerUser,
    loginUser,
    getProfile,
    getUsers,
    logout,
    deleteUser,
    updateProfile,
} = require("../controllers/authController");
const User = require("../models/user");

const PORT = process.env.REACT_APP_PORT;

router.use(
    cors({
        credentials: true,
        origin: `http://localhost:${PORT}`,
    })
);

router.get("/", test);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.get("/users", getUsers);
router.post("/logout", logout);
router.delete("/users/:userID", deleteUser);
router.put("/users/:id", updateProfile);

router.post("/check-email", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user) {
            return res.status(200).json({ exists: true });
        }

        return res.status(200).json({ exists: false });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "Something went wrong while checking the email." });
    }
});

module.exports = router;
