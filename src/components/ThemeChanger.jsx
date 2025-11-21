import { Button } from '@mui/material'
import { DarkModeTwoTone, LightModeTwoTone } from '@mui/icons-material'
import { useTheme } from '../context/ThemeContext'

function ThemeChanger() {
    const { changeTheme, isDarkmode } = useTheme()

    function changeThemeHandler() {
        changeTheme()
    }

    return (
        <div>
            <Button onClick={changeThemeHandler} title='Change Theme'>
                {
                    isDarkmode ? <LightModeTwoTone /> : <DarkModeTwoTone />
                }
            </Button>
        </div>
    )
}

export default ThemeChanger
