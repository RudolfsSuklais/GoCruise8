const errorMessages = {
    SERVER_ERROR: "Failed to process request.",

    // Reservation Errors
    ERROR_RESERVATION_NOT_FOUND: "Reservation not found.",
    ERROR_ADD_RESERVATION: "Failed to add reservation.",
    ERROR_GET_RESERVATIONS: "Failed to retrieve reservations.",
    ERROR_GET_RESERVATION: "Failed to retrieve reservation.",
    ERROR_DELETE_RESERVATION: "Failed to delete reservation.",

    // Car Errors
    ERROR_ALL_FIELDS_REQUIRED: "All fields are required.",
    ERROR_ADD_CAR: "Failed to add car.",
    ERROR_GET_CARS: "Failed to retrieve cars.",
    ERROR_CAR_NOT_FOUND: "Car not found.",
    ERROR_GET_CAR: "Failed to retrieve car.",
    ERROR_DELETE_CAR: "Failed to delete car.",
    ERROR_UPDATE_CAR: "Failed to update car.",

    // User Errors
    ERROR_NAME_REQUIRED: "Name is required.",
    ERROR_PASSWORD_LENGTH: "Password must be at least 6 characters long.",
    ERROR_EMAIL_TAKEN: "Email is already taken.",
    ERROR_USER_NOT_FOUND: "User not found.",
    ERROR_INCORRECT_PASSWORD: "Incorrect password.",
    ERROR_WENT_WRONG: "Something went wrong.",
    ERROR_UNAUTHORIZED: "Unauthorized access.",
    ERROR_FETCH_PROFILE: "Failed to fetch profile.",
    ERROR_NO_TOKEN: "No token provided.",
    ERROR_PROFILE_UPDATE: "Failed to update profile.",
    EMAIL_TAKEN: "Email already taken",
};

const successMessages = {
    // Reservation Success
    SUCCESS_RESERVATION_DELETED: "Reservation deleted successfully.",
    SUCCESS_RESERVATION_CREATED: "Reservation created successfully.",
    SUCCESS_RESERVATIONS_GET: "Reservations retrieved successfully.",

    // Car Success
    SUCCESS_CAR_ADDED: "Car added successfully.",
    SUCCESS_DELETE_CAR: "Car deleted successfully.",
    SUCCESS_UPDATE_CAR: "Car updated successfully.",
};

const errorStatusCode = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
};

const successStatusCode = {
    SUCCESS: 200,
    CREATED: 201,
};

module.exports = {
    errorMessages,
    successMessages,
    errorStatusCode,
    successStatusCode,
};
