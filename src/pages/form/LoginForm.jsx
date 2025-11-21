import { TextField, Button } from '@mui/material'
import { loginUser } from '../../services/userServices'
import { useState } from 'react';
import { toast } from 'react-toastify'
import { useTheme } from '../../context/ThemeContext'


function LoginForm() {
    const [data, setData] = useState({
        username: "",
        password: ""
    });
    const { isDarkmode } = useTheme();
    const [showPassword, setShowPassword] = useState(false);


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(data);
            console.log("Response Of Login :", response);
            if (response.success) {
                toast.success(response.message || "Login Success", {
                    theme: 'colored'
                })
            } else {
                toast.error(response.message || "Failed To Login", {
                    theme: 'colored'
                })

            }
        } catch (error) {
            console.log("Error While Login User :: Login Page :", error);
            toast.error(error.message || "Failed To Login", {
                theme: 'colored'
            })
        }
    };

    return (
        <div className='h-screen w-screen overflow-hidden flex items-center justify-center'>
            <div className='flex gap-6 flex-col text-center'>
                <h3 className='text-xl font-mono'>Welcome Back</h3>
                <form className='flex flex-col gap-5 w-full' onSubmit={handleLogin}>
                    <TextField
                        id='username'
                        variant='outlined'
                        label="Username"
                        required
                        value={data.username}
                        onChange={(e) => setData({ ...data, username: e.target.value })}
                    />

                    <TextField
                        id='password'
                        variant='outlined'
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        required
                        onChange={(e) => setData({ ...data, password: e.target.value })}
                    />

                    <Button variant='outlined' type='submit'>Login</Button>
                </form>
            </div>



        </div>
    );
}

export default LoginForm;
