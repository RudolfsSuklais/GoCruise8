import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const { data } = await axios.get(
                    "https://gocruise.onrender.com/profile",
                    { withCredentials: true }
                );

                setUser(data);
            } catch (error) {
                console.log("Error fetching user profile: ", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const logout = () => {
        setUser(null);
        toast.success("Logged out successfully!");
        axios.post("/logout").catch((err) => {
            console.log("Logout error: ", err);
        });
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout, isLoading }}>
            {children}
        </UserContext.Provider>
    );
}
