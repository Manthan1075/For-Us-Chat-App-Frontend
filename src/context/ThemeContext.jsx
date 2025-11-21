import { createContext, useContext, useState } from "react";


const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkmode, setIsDarkmod] = useState(false)

    const changeTheme = () => setIsDarkmod(prev => !prev);

    return (
        <ThemeContext.Provider value={{ isDarkmode, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext);