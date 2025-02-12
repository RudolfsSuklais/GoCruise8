import { useFormData } from "herotofu-react";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "./Contact.css";
import toast from "react-hot-toast";
import {
    errorMessages,
    successMessages,
    contactFormKeys,
} from "../../constants/constants";

const ContactForm = () => {
    const { formState, getFormSubmitHandler } = useFormData(
        contactFormKeys.CONTACT_FORM_SITE
    );

    const [captchaValue, setCaptchaValue] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!captchaValue) {
            toast.error(errorMessages.ERROR_CAPTCHA);
            return;
        }

        getFormSubmitHandler()(e);
        e.target.reset();
        setCaptchaValue(null);
        toast.success(successMessages.SUCCESS_MESSAGE_SENT);
    };

    return (
        <div className="contact-page">
            <div className="contact-form-container">
                <h1>Contact GoCruise</h1>
                <form onSubmit={handleSubmit}>
                    <div className="contact-form-input-name">
                        <input
                            type="text"
                            placeholder="Your name"
                            name="name"
                            className="contact-input"
                            required
                        />
                    </div>
                    <div className="contact-form-input-email">
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            className="contact-input"
                            required
                        />
                    </div>
                    <div className="contact-form-input-message">
                        <textarea
                            placeholder="Your message"
                            name="message"
                            className="contact-input"
                            required
                        />
                    </div>

                    <div className="contact-form-input-captcha">
                        <ReCAPTCHA
                            sitekey={contactFormKeys.CAPTCHA_SITE_KEY}
                            onChange={(value) => setCaptchaValue(value)}
                        />
                    </div>

                    <div className="contact-form-input-button-container">
                        <button className="contact-submit-btn" type="submit">
                            Send a message
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactForm;
