const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const {
    errorMessages,
    successMessages,
    errorStatusCode,
    successStatusCode,
} = require("../constants/constant");

const test = (req, res) => {
    res.json("test is working");
};

const registerUser = async (req, res) => {
    try {
        const {
            name,
            lastName,
            phone,
            address,
            city,
            country,
            postalCode,
            birthday,
            email,
            password,
        } = req.body;

        if (!name) {
            return res
                .status(errorStatusCode.BAD_REQUEST)
                .json({ error: errorMessages.NAME_REQUIRED });
        }

        if (!password || password.length < 6) {
            return res
                .status(errorStatusCode.BAD_REQUEST)
                .json({ error: errorMessages.PASSWORD_LENGTH });
        }

        const exists = await User.findOne({ email });

        if (exists) {
            return res
                .status(errorStatusCode.BAD_REQUEST)
                .json({ error: errorMessages.EMAIL_TAKEN });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            userID: uuidv4(),
            name,
            lastName,
            phone,
            address,
            city,
            country,
            postalCode,
            birthday,
            email,
            isAdmin: false,
            password: hashedPassword,
        });

        return res.status(successStatusCode.CREATED).json(user);
    } catch (error) {
        console.error(error);
        return res
            .status(errorStatusCode.SERVER_ERROR)
            .json({ error: errorMessages.WENT_WRONG });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(errorStatusCode.NOT_FOUND)
                .json({ error: errorMessages.USER_NOT_FOUND });
        }

        const match = await comparePassword(password, user.password);

        if (!match) {
            return res
                .status(errorStatusCode.BAD_REQUEST)
                .json({ error: errorMessages.ERROR_INCORRECT_PASSWORD });
        }

        jwt.sign(
            {
                email: user.email,
                userID: user.userID,
                name: user.name,
                lastName: user.lastName,
                phone: user.phone,
                address: user.address,
                city: user.city,
                country: user.country,
                postalCode: user.postalCode,
                birthday: user.birthday,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" },
            (err, token) => {
                if (err) {
                    console.error(err);
                    return res
                        .status(errorStatusCode.SERVER_ERROR)
                        .json({ error: errorMessages.WENT_WRONG });
                }
                res.cookie("token", token, {
                    httpOnly: true,
                    sameSite: "None", // Ensure cross-origin requests work
                    secure: true, // Always true for HTTPS
                });
            }
        );
    } catch (error) {
        console.error(error);
        return res
            .status(errorStatusCode.SERVER_ERROR)
            .json({ error: errorMessages.WENT_WRONG });
    }
};

const getProfile = async (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res
            .status(errorStatusCode.UNAUTHORIZED)
            .json({ error: errorMessages.NO_TOKEN });
    }

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
        if (err) {
            return res
                .status(errorStatusCode.UNAUTHORIZED)
                .json({ error: errorMessages.UNAUTHORIZED });
        }
        try {
            const user = await User.findOne({ userID: decoded.userID });

            if (!user) {
                return res
                    .status(errorStatusCode.NOT_FOUND)
                    .json({ error: errorMessages.USER_NOT_FOUND });
            }
            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(errorStatusCode.NOT_FOUND).json({
                error: errorMessages.FETCH_PROFILE,
            });
        }
    });
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(successStatusCode.SUCCESS).json(users);
    } catch (error) {
        console.error(error);
        res.status(errorStatusCode.SERVER_ERROR).json({
            error: errorMessages.WENT_WRONG,
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userID } = req.params;
        const user = await User.findOneAndDelete({ userID });

        if (!user) {
            return res
                .status(errorStatusCode.NOT_FOUND)
                .json({ error: errorMessages.USER_NOT_FOUND });
        }

        return res
            .status(successStatusCode.SUCCESS)
            .json({ message: successMessages.USER_DELETED });
    } catch (error) {
        console.error(error);
        return res
            .status(errorStatusCode.SERVER_ERROR)
            .json({ error: errorMessages.WENT_WRONG });
    }
};

const logout = (req, res) => {
    res.cookie("token", "", { httpOnly: true })
        .status(successStatusCode.SUCCESS)
        .json({ message: "Logged out" });
};

const updateProfile = async (req, res) => {
    try {
        const {
            name,
            lastName,
            phone,
            address,
            city,
            country,
            postalCode,
            birthday,
            email,
        } = req.body;

        const { id } = req.params;

        const user = await User.findOne({ userID: id });

        if (!user) {
            return res
                .status(errorStatusCode.NOT_FOUND)
                .json({ error: errorMessages.USER_NOT_FOUND });
        }

        Object.assign(user, {
            name,
            lastName,
            phone,
            address,
            city,
            country,
            postalCode,
            birthday,
            email,
        });

        await user.save();
        res.status(successStatusCode.SUCCESS).json(user);
    } catch (error) {
        console.error(error);
        res.status(errorStatusCode.SERVER_ERROR).json({
            error: errorMessages.PROFILE_UPDATE,
        });
    }
};

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    getUsers,
    logout,
    deleteUser,
    updateProfile,
};
