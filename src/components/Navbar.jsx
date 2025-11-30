import { useTheme } from '../context/ThemeContext'
import { useUser } from '../context/UserContext'
import Profile from './Profile'
import LightLogo from '../../public/assets/Logo.png'
import DarkLogo from '../../public/assets/Dark_logo.png'
import ThemeChanger from './ThemeChanger.jsx'

function Navbar() {
    const { isDarkmode } = useTheme()
    const { user } = useUser()

    return (
        <div
            className="
                w-full 
                flex items-center justify-between 
                px-4 sm:px-6 py-3
                border-b
                bg-white/70 dark:bg-neutral-900/70
                backdrop-blur-md
                shadow-sm
                sticky top-0 z-50
            "
        >
            <div className="flex items-center gap-3">
                <a href="/">
                    <img
                        src={isDarkmode ? DarkLogo : LightLogo}
                        alt="For Us"
                        className="w-28 sm:w-32 h-auto object-contain drop-shadow"
                    />
                </a>
            </div>

            <div className="flex-1 hidden sm:flex justify-center"></div>

            <div className="flex items-center gap-4">
                <ThemeChanger />

                <Profile
                    id={user?._id || ""}
                    username={user?.username || ""}
                    bio={user?.bio || ""}
                    profilePhoto={user?.profilePhoto || ""}
                />
            </div>
        </div>
    )
}

export default Navbar
