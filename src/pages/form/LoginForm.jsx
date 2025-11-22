import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react'
import { loginUser } from "../../services/userServices";
import { toast } from "react-toastify";
import Spinner from "../../components/Loaders/Spinner";
import { useUser } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'

function LoginForm() {
    const [data, setData] = useState({ username: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)

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
        <div className="min-h-screen w-full bg-white px-6 pt-5 relative">

            <img
                src="../../../public/assets/Logo.png"
                alt="For Us"
                className="h-14 w-fit object-cover rounded-lg absolute left-0 top-5"
            />

            <div className="min-h-screen flex flex-col items-center justify-center">

                <img
                    src="../../../public/assets/login-chat-illustration.svg"
                    alt="Login Illustration"
                    className="w-40 mb-3"
                />

                <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>

                <form onSubmit={handleLogin} className="w-full max-w-xs flex flex-col gap-5">

                    <input
                        type="text"
                        placeholder="Username"
                        required
                        value={data.username}
                        onChange={(e) => setData({ ...data, username: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-violet-500"
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-violet-500"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-500"
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
                        className={`w-full py-3 rounded-xl font-semibold text-white cursor-pointer text-sm active:scale-95 transition-all
                            ${loading ? 'bg-violet-400' : 'bg-violet-500'}`}
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
