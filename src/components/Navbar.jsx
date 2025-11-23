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
            className='flex w-full justify-between items-center border px-5 py-2'
        >
            <div>
                <img
                    src={isDarkmode ? DarkLogo : LightLogo}
                    alt="For Us"
                    className="w-32 h-14 object-cover"
                />
            </div>
            <ThemeChanger />
            <Profile
                id={user?._id || ""}
                username={user?.username || "Manthan"}
                bio={user?.bio || "Welcome To My Profile"}
                profilePhoto={user?.profilePhoto || ""}
            />
        </div>
    )
}

export default Navbar
