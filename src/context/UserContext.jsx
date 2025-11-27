import { createContext, useState, useContext, useEffect } from "react";
import { initiateSocketConnection } from '../socket/socket.js'

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser === undefined || storedUser === "undefined" || storedUser === null) {
                return null;
            }
            return JSON.parse(storedUser);
        } catch (e) {
            return null;
        }
    });

    const addUser = (data) => {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
    };

    const removeUser = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    useEffect(() => {
        if (user && user._id.length != 0)
            initiateSocketConnection(user._id)
    }, [user])

    return (
        <UserContext.Provider value={{ user, addUser, removeUser }}>
            {children}
        </UserContext.Provider>
    );
};


export const useUser = () => useContext(UserContext);
