import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

    const [isDarkmode, setIsDarkmode] = useState(() => {
        const saved = localStorage.getItem("isDarkmode");
        return saved ? JSON.parse(saved) : false;
    });

    const changeTheme = () => {
        setIsDarkmode(prev => !prev);
    };

    useEffect(() => {
        localStorage.setItem("isDarkmode", JSON.stringify(isDarkmode));
        document.documentElement.className = isDarkmode ? "dark" : "light";
    }, [isDarkmode]);

    return (
        <ThemeContext.Provider value={{ isDarkmode, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
