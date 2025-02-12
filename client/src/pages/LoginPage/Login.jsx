import { useContext, useState } from "react";
import { UserContext } from "../../../context/userContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./Login.css";
import { errorMessages, successMessages } from "../../constants/constants";

export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [showPassword, setShowPassword] = useState(false);

    const [data, setData] = useState({
        email: "",
        password: "",
    });

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const { data: response } = await axios.post("/login", data, {
                withCredentials: true,
            });
            if (response.error) {
                toast.error(response.error);
            } else {
                setData({});
                const profileResponse = await axios.get("/profile");
                setUser(profileResponse.data);

                const redirectedFromRent =
                    localStorage.getItem("redirectedFromRent");

                if (redirectedFromRent) {
                    localStorage.removeItem("redirectedFromRent");
                    navigate(-1);
                } else {
                    navigate("/");
                }

                toast.success(successMessages.SUCCESS_LOGIN);
            }
        } catch (error) {
            toast.error(errorMessages.ERROR_WRONG);
        }
    };

    return (
        <div className="login-page">
            <form onSubmit={loginUser}>
                <h1>Login</h1>
                <label>
                    <span>*</span>Email:
                </label>
                <input
                    required
                    type="email"
                    placeholder="Email..."
                    value={data.email}
                    onChange={(e) =>
                        setData({ ...data, email: e.target.value })
                    }
                />
                <label>
                    <span>*</span>Password:
                </label>
                <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Password..."
                    id="password"
                    value={data.password}
                    onChange={(e) =>
                        setData({ ...data, password: e.target.value })
                    }
                />
                <div className="show-password">
                    <input
                        type="checkbox"
                        onClick={() => setShowPassword(!showPassword)}
                    />
                    Show Password
                </div>
                <Link to={"/register"}>Create an account</Link>
                <div className="login-page-submit-btn-wrapper">
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    );
}
