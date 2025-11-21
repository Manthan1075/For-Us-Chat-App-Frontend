import { createContext, useState, useContext } from 'react'

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const addUser = (data) => {
        setUser(data)
    }

    return (
        <UserContext.Provider value={{ user, addUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)