import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Eye, EyeOff } from "lucide-react";
import Spinner from "./Loaders/Spinner.jsx";
import { updatePassword } from "../services/userServices.js";
import { useUser } from "../context/UserContext.jsx";
import { toast } from "react-toastify";

function ChangePassword() {
    const [form, setForm] = useState({
        oldPassword: "",
        newPassword: "",
    });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useUser()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await updatePassword({
                oldPassword: form.oldPassword,
                newPassword: form.newPassword,
                userId: user._id
            });

            if (response && response.success) {
                toast.success(response.message || "Password updated successfully");
                setForm({
                    oldPassword: "",
                    newPassword: "",
                });
            } else {
                toast.error(response.message || "Failed to update password");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "An error occurred while updating the password."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 w-full max-w-sm mx-auto p-2 min-[350px]:px-4"
        >
            <div>
                <label htmlFor="oldPassword" className="block mb-1 font-medium text-sm">
                    Old Password
                </label>
                <div className="relative">
                    <Input
                        id="oldPassword"
                        type={showOldPassword ? "text" : "password"}
                        name="oldPassword"
                        value={form.oldPassword}
                        onChange={handleChange}
                        required
                        placeholder="Enter old password"
                        className="pr-10"
                        autoComplete="current-password"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        tabIndex={-1}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowOldPassword((s) => !s)}
                    >
                        {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                </div>
            </div>
            <div>
                <label htmlFor="newPassword" className="block mb-1 font-medium text-sm">
                    New Password
                </label>
                <div className="relative">
                    <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        required
                        placeholder="Enter new password"
                        className="pr-10"
                        autoComplete="new-password"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        tabIndex={-1}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowNewPassword((s) => !s)}
                    >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                </div>
            </div>
            <Button className="w-full py-5 font-semibold rounded-xl text-base mt-2" type="submit" disabled={loading}>
                {loading ? <Spinner /> : "Change Password"}
            </Button>
        </form>
    );
}

export default ChangePassword
