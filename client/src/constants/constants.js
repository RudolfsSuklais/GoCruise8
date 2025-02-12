export const errorMessages = {
    // Add Car Errors
    ERROR_FILL_OUT_FIELDS: "Please fill out all fields.",
    ERROR_ADDING_CAR:
        "Failed to add car. Please check your input and try again.",

    // Fetch Cars Errors
    ERROR_DATA_FORMAT: "Invalid data format received.",
    ERROR_GET_CARS: "Error fetching cars.",
    ERROR_DELETING_CAR: "Error deleting car.",
    ERROR_UPDATING_CAR: "Error updating car details.",

    // Reservations Errors
    ERROR_GET_RESERVATIONS: "Failed to fetch reservations.",
    ERROR_DELETE_RESERVATION: "Failed to delete reservation.",
    ERROR_NOT_FOUND: "Reservation not found.",
    ERROR_CAR_DATA: "Invalid car data.",
    ERROR_FAILED_FETCH: "Failed to fetch reservation or car data.",
    ERROR_NOT_AVAILABLE: "Car is not available.",
    ERROR_DURATION: "Duration must be at least 1 hour.",
    ERROR_START_TIME:
        "The start date/time must be earlier than the end date/time.",
    ERROR_MAKING_RESERVATION: "Error making reservation.",
    ERROR_FAILED_CANCEL: "Failed to cancel reservation.",

    // User Errors
    ERROR_GET_USERS: "Failed to fetch users.",
    ERROR_DELETE_USER: "Failed to delete user.",
    ERROR_NOT_LOGGED_IN: "User not logged in.",
    ERROR_GET_PROFILE: "Error fetching profile.",
    ERROR_AGE_REQUIREMENTS: "You must be at least 18 years old.",
    ERROR_UPDATING: "Error updating profile.",
    ERROR_WRONG: "Something went wrong.",

    // Authentication & Registration Errors
    ERROR_CAPTCHA: "Please complete the reCAPTCHA.",

    // Home Errors
    ERROR_LOAD_DATA: "Failed to load data.",

    // Contact Errors
    ERROR_CAPTCHA: "Please complete the reCAPTCHA.",

    ERROR_INVALID_NAME: "Invalid name",

    ERROR_INVALID_LAST_NAME: "Invalid last name",

    ERROR_INVALID_PHONE: "Invalid phone number",

    ERROR_INVALID_ADDRESS: "Invalid address",

    ERROR_INVALID_CITY: "Invalid city",

    ERROR_INVALID_COUNTRY: "Invalid country",

    ERROR_INVALID_POSTAL_CODE: "Invalid postal code",

    ERROR_INVALID_BIRTHDAY: "Invalid birthday",

    ERROR_INVALID_EMAIL: "Invalid email address",

    ERROR_INVALID_PASSWORD: "Invalid password",

    ERROR_EMAIL_EXISTS: "Email already taken",

    ERROR_CHECKING_EMAIL: "Error while checking email",

    ERROR_BIRTHDAY_FUTURE: "Birthday cannot be in the future",

    ERROR_BIRTHDAY_TOO_OLD: "Invalid birthday date, must be after 01/01/1900",

    ERROR_START_TIME: "The pickup time cannot be later than the drop-off time.",

    ERROR_DURATION: "The rental duration must be at least 1 hour.",

    ERROR_PICKUP_PAST: "The pickup time cannot be in the past.",
};

export const successMessages = {
    // Car Success Messages
    SUCCESS_CAR_ADDED: "Car added successfully!",
    SUCCESS_CAR_UPDATED: "Car updated successfully!",

    // Reservation Success Messages
    SUCCESS_RESERVATION_MADE: "Reservation made successfully!",
    SUCCESS_CANCELED: "Reservation cancelled successfully!",

    // User Success Messages
    SUCCESS_UPDATED: "Profile updated successfully!",

    // Authentication & Registration Success Messages
    SUCCESS_REGISTRATION: "Registration successful. Welcome!",
    SUCCESS_LOGIN: "Logged in successfully!",

    // Contact Success Messages
    SUCCESS_MESSAGE_SENT:
        "Message sent, we will get back to you as soon as possible!",

    // Car Deletion
    SUCCESS_DELETE_CAR: "Car deleted successfully!",
};

export const contactFormKeys = {
    CONTACT_FORM_SITE:
        "https://public.herotofu.com/v1/b65d68e0-dc89-11ef-be95-ad6085502b45",
    CAPTCHA_SITE_KEY: "6LdDpMgqAAAAAL31OKv1BgukIdfGqJc3Zoh3wjEp",
};
