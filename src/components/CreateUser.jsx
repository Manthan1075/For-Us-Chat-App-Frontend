import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import Spinner from './Loaders/Spinner.jsx'
import { Eye, EyeOff } from 'lucide-react'
import { createUser } from '../services/userServices.js'
import { useUser } from '../context/UserContext.jsx'
import { toast } from 'react-toastify'

function CreateUser() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { user } = useUser()
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await createUser({
                username: formData.username,
                password: formData.password,
                userId: user._id,
            })

            console.log("Create User Response : ", response);
            if (response.success) {
                toast.success(response.message || "User created successfully", {
                    theme: 'colored'
                });
                setFormData({
                    username: '',
                    password: ''
                })
            } else {
                toast.error(response.message || "Failed to create user", {
                    theme: 'colored'
                });
            }
        } catch (error) {
            console.log("Error While Create User : ", error);
            toast.error("An error occurred while creating the user.", {
                theme: 'colored'
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className=" flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-6 rounded-xl"
            >
                <h1 className="text-2xl font-semibold text-center">
                    Create User
                </h1>

                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Username
                    </label>
                    <Input
                        type="text"
                        placeholder="Enter username"
                        required
                        value={formData.username}
                        onChange={(e) =>
                            setFormData({ ...formData, username: e.target.value })
                        }
                        className="h-11"
                    />
                </div>

                <div className="space-y-2 relative">
                    <label className="text-sm font-medium">
                        Password
                    </label>
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        required
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                        className="h-11 pr-10"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 text-base font-medium"
                >
                    {loading ? <Spinner /> : "Create User"}
                </Button>
            </form>
        </div>
    )
}

export default CreateUser
