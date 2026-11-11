import { useTheme } from "../context/ThemeContext";
import { Switch } from "../components/ui/switch";
import { Sun, Moon } from 'lucide-react'

function ThemeChanger() {
    const { changeTheme, isDarkmode } = useTheme();

    const handleThemeToggle = () => {
        localStorage.setItem("isDarkmode", JSON.stringify(!isDarkmode));
        changeTheme();
    };

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isDarkmode ? <Moon /> : <Sun />}
            </span>

            <Switch checked={isDarkmode} onCheckedChange={handleThemeToggle} />
        </div>
    );
}

export default ThemeChanger;
