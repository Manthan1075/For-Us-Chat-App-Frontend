import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react'
import { loginUser } from "../../services/userServices";
import { toast } from "react-toastify";
import Spinner from "../../components/Loaders/Spinner";
import { Input } from '../../components/ui/input'
import { useUser } from '../../context/UserContext'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useNavigate } from 'react-router-dom'
import lightLogo from '../../../public/assets/Logo.png'
import darkLogo from '../../../public/assets/Dark_logo.png'

function LoginForm() {
    const [data, setData] = useState({ username: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const { isDarkmode } = useTheme()
    const { addUser } = useUser()
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const res = await loginUser(data);

            if (res.success) {
                addUser(res?.user)
                toast.success("Login Successful", { theme: "colored" });
                navigate('/')
            } else {
                toast.error(res.error || "Failed to login", { theme: "colored" });
            }
        } catch {
            toast.error("Login failed");
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="
            min-h-screen w-full px-6 pt-5 relative 
            bg-white dark:bg-black transition-colors
        ">

            <img
                src={isDarkmode ? darkLogo : lightLogo}
                alt="For Us"
                className="h-14 w-fit object-cover rounded-lg absolute left-0 top-5"
            />

            <div className="min-h-screen flex flex-col items-center justify-center">

                <img
                    src="https://ik.imagekit.io/mdzya242z/login-chat-illustration.svg"
                    alt="Login Illustration"
                    className="w-40 mb-3"
                />

                <h2 className="
                    text-2xl font-bold mb-6 
                    text-gray-900 dark:text-white
                ">
                    Welcome Back
                </h2>

                <form onSubmit={handleLogin} className="w-full max-w-xs flex flex-col gap-5">

                    <Input
                        type="text"
                        placeholder="Username"
                        required
                        value={data.username}
                        onChange={(e) => setData({ ...data, username: e.target.value })}
                        className="
                            placeholder-gray-400 
                            dark:bg-neutral-900 dark:text-white 
                            dark:placeholder-gray-500
                            border dark:border-neutral-800
                        "
                        autoComplete="username"
                    />

                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            className="
                                placeholder-gray-400 
                                dark:bg-neutral-900 dark:text-white 
                                dark:placeholder-gray-500
                                border dark:border-neutral-800
                            "
                            autoComplete="current-password"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="
                                absolute right-3 top-1.5 
                                text-gray-500 dark:text-gray-300
                            "
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff fontSize="small" />
                            ) : (
                                <Eye fontSize="small" />
                            )}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`
                            w-full py-3 rounded-xl font-semibold text-white text-sm
                            active:scale-95 transition-all cursor-pointer
                            ${loading
                                ? 'bg-violet-400 dark:bg-violet-700'
                                : 'bg-violet-500 dark:bg-violet-600'
                            }
                        `}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <Spinner />
                            </div>
                        ) : (
                            "Login"
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default LoginForm;
