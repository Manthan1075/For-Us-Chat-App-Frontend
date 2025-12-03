import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Edit, LogOut, Trash, X } from "lucide-react";
import { editProfile, deleteUser } from "../services/userServices";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "./ui/textarea";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";
import moment from "moment";
import Spinner from "./Loaders/Spinner";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog.tsx";
import ImagePreview from "./ImagePreview.jsx";
import ChangePassword from '../components/ChangePassword.jsx'

function Profile({ id, username, bio, profilePhoto, lastSeen }) {
    const { user, addUser, removeUser } = useUser();

    const [isEditOn, setIsEditOn] = useState(false);
    const [formData, setFormData] = useState({
        username,
        bio,
        profilePhoto: "",
    });

    const [loading, setLoading] = useState({
        editLoading: false,
        deleteLoading: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setFormData((p) => ({ ...p, profilePhoto: file }));
    };

    const handleEditUser = async () => {
        try {
            setLoading((p) => ({ ...p, editLoading: true }));

            const response = await editProfile({
                userId: id,
                username: formData.username,
                bio: formData.bio,
                profilePhoto: formData.profilePhoto,
            });

            if (response?.success) {
                toast.success(response.message || "Profile Updated Successfully", { theme: "colored" });
                addUser(response.user);
            } else {
                toast.error(response.message || "Failed to update profile", { theme: "colored" });
            }
            setIsEditOn(false);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading((p) => ({ ...p, editLoading: false }));
        }
    };

    const handleDeleteUser = async (userid) => {
        try {
            setLoading((p) => ({ ...p, deleteLoading: true }));
            const response = await deleteUser(userid);
            if (response.success) {
                toast.success(response.message || "User Account Deleted", {
                    theme: 'colored'
                })
            } else {
                toast.error(response.message || "Error Occur While Delete User", {
                    theme: 'colored'
                })
            }
            removeUser()
        } finally {
            setLoading((p) => ({ ...p, deleteLoading: false }));
        }
    };

    const handleLogout = () => {
        removeUser();
        window.location.href = "/login";
    };

    const handleCancelEdit = () => {
        setFormData({
            username,
            bio,
            profilePhoto: "",
        });
        setIsEditOn(false);
    };

    return (
        <Popover modal={false}>
            <PopoverTrigger>
                <Avatar className="cursor-pointer hover:scale-105 transition-transform">
                    <AvatarImage src={profilePhoto} />
                    <AvatarFallback>{username?.charAt(0)?.toUpperCase()}</AvatarFallback>
                </Avatar>
            </PopoverTrigger>

            <PopoverContent
                className="
                    w-[92vw] sm:w-96 
                    p-0 rounded-2xl 
                    bg-white/70 dark:bg-neutral-900/70 
                    backdrop-blur-xl 
                    border-none shadow-2xl
                "
            >
                <Card className="p-5 space-y-6 bg-transparent shadow-none border-none">

                    <div className="flex flex-col items-center text-center gap-3">

                        <div className="relative">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Avatar className="w-24 h-24 shadow-lg border-2 border-white dark:border-neutral-800">
                                        <AvatarImage src={formData.profilePhoto ? URL.createObjectURL(formData.profilePhoto) : profilePhoto} />
                                        <AvatarFallback className="text-xl font-bold">
                                            {username?.charAt(0)?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DialogTrigger>
                                <DialogContent>
                                    <ImagePreview imageUrl={profilePhoto} />
                                </DialogContent>
                            </Dialog>

                            {isEditOn && (
                                <>
                                    <label className="
                                        absolute bottom-1 right-1 
                                        bg-white dark:bg-neutral-800 
                                        p-2 rounded-full 
                                        shadow cursor-pointer
                                    ">
                                        <Input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        <Edit size={16} />
                                    </label>
                                    {formData.profilePhoto && (
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="destructive"
                                            className="absolute top-1 right-1 p-1 rounded-full"
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    profilePhoto: null
                                                }))
                                            }
                                            title="Remove selected image"
                                        >
                                            <X size={16} />
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>

                        <Input
                            name="username"
                            className={`
                                text-center text-lg font-semibold 
                                bg-transparent border-none 
                                focus-visible:ring-0 
                                ${!isEditOn && "pointer-events-none opacity-70"}
                            `}
                            value={formData.username}
                            onChange={handleChange}
                            readOnly={!isEditOn}
                        />

                        {lastSeen && user?._id !== id ? (
                            <p className="text-xs opacity-70">
                                Last seen {moment(lastSeen).fromNow()}
                            </p>
                        ) : ""}
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium opacity-80">Bio</p>
                        <Textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            readOnly={!isEditOn}
                            className={`
                                min-h-[90px] rounded-xl 
                                bg-neutral-100 dark:bg-neutral-800 
                                border-none 
                                ${!isEditOn && "pointer-events-none opacity-70"}
                            `}
                        />
                    </div>

                    <div className="space-y-3">
                        {(user._id === id || user.role === "admin") && (
                            isEditOn ? (
                                <>
                                    <Button
                                        onClick={handleEditUser}
                                        disabled={loading.editLoading}
                                        className="w-full font-semibold text-base py-5 rounded-xl"
                                    >
                                        {loading.editLoading ? <Spinner /> : "Save Changes"}
                                    </Button>
                                    <Button
                                        onClick={handleCancelEdit}
                                        variant="outline"
                                        disabled={loading.editLoading}
                                        className="w-full font-semibold text-base py-5 rounded-xl"
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>



                                    {user._id === id && (
                                        <>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        className="w-full flex gap-2 text-base py-4 rounded-xl"
                                                    >
                                                        {loading.deleteLoading ? <Spinner /> : <Trash size={18} />}
                                                        Delete Account
                                                    </Button>
                                                </AlertDialogTrigger>

                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete your account? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteUser(id)} disabled={loading.deleteLoading}>
                                                            Yes, Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                            <Button
                                                variant="outline"
                                                className="w-full flex gap-2 text-base py-4 rounded-xl"
                                                onClick={() => setIsEditOn(true)}
                                            >
                                                <Edit size={18} /> Edit Profile
                                            </Button>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant='outline'
                                                        className="w-full flex items-center gap-2 text-base py-4 rounded-xl transition-shadow hover:shadow-lg"
                                                    >
                                                        <span className="font-medium">Change Password</span>
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-md p-6 rounded-2xl shadow-2xl ">
                                                    <ChangePassword />
                                                </DialogContent>
                                            </Dialog>
                                            <Button
                                                variant="secondary"
                                                className="w-full flex gap-2 text-base py-4 rounded-xl"
                                                onClick={handleLogout}
                                            >
                                                <LogOut size={18} /> Logout
                                            </Button>
                                        </>
                                    )
                                    }
                                </>
                            )
                        )}
                    </div>
                </Card>
            </PopoverContent>
        </Popover>
    );
}

export default Profile;
