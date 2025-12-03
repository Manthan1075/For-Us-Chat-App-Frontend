import { createContext, useState, useContext, useEffect } from "react";
import { initiateSocketConnection } from '../socket/socket.js'

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState();

    const addUser = (data) => {
        setUser(data);
    };

    const removeUser = () => {
        setUser(null);
    };

    useEffect(() => {
        if (user && user._id?.length != 0)
            initiateSocketConnection(user._id)
    }, [user])

    return (
        <UserContext.Provider value={{ user, addUser, removeUser }}>
            {children}
        </UserContext.Provider>
    );
};


export const useUser = () => useContext(UserContext);
