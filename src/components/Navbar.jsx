import { useTheme } from '../context/ThemeContext'
import { useUser } from '../context/UserContext'
import Profile from './Profile'
import ThemeChanger from './ThemeChanger'

function Navbar() {
    const { isDarkmode } = useTheme()
    const { user } = useUser()

    return (
        <div className='bg-white w-full shadow-lg py-2.5 flex justify-between px-2.5'>

            <div className=''>
                <img
                    src='../../public/assets/logo.png'
                    alt='For Us'
                    className='w-32 h-14 object-cover rounded-lg'
                />
            </div>
            <ThemeChanger />
            <Profile
                id={user?.id || ""}
                username={user?.username || "Manthan"}
                bio={user?.bio || "Welcome To My Profile"}
                profilePhoto={user?.profilePhoto || ""}
            />
        </div>
    )
}

export default Navbar
