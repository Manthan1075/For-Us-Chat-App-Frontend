import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Edit, LogOut, Trash } from "lucide-react";
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
            console.log("EDIT PROFILE RES :", response);

            if (response?.success) {
                toast.success(response.message || "Profile Updated Successfully", { theme: "colored" });
                addUser(response.data);
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

    const handleDeleteUser = async () => {
        try {
            setLoading((p) => ({ ...p, deleteLoading: true }));
            await deleteUser(id);
        } finally {
            setLoading((p) => ({ ...p, deleteLoading: false }));
        }
    };

    const handleLogout = () => {
        removeUser();
        window.location.href = "/login";
    };

    return (
        <div>
            <Popover modal={false}>
                <PopoverTrigger>
                    <Avatar className="cursor-pointer">
                        <AvatarImage src={profilePhoto} />
                        <AvatarFallback>{username?.charAt(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                </PopoverTrigger>

                {/* MOBILE-FIRST POPUP */}
                <PopoverContent className="w-[92vw] sm:w-80 p-0 rounded-xl shadow-lg border">
                    <Card className="p-4 space-y-6 shadow-none border-none rounded-xl">

                        {/* PROFILE HEADER SECTION */}
                        <div className="flex flex-col items-center text-center gap-3">

                            <div className="relative">
                                <Avatar className="w-20 h-20 shadow-md border">
                                    <AvatarImage src={profilePhoto} />
                                    <AvatarFallback className="text-lg font-bold">
                                        {username?.charAt(0)?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                {isEditOn && (
                                    <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow cursor-pointer">
                                        <Input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        <Edit size={16} />
                                    </label>
                                )}
                            </div>

                            {/* Name */}
                            <Input
                                name="username"
                                className={`text-center text-lg font-semibold bg-transparent border-none focus-visible:ring-0 ${!isEditOn && "pointer-events-none opacity-80"
                                    }`}
                                value={formData.username}
                                onChange={handleChange}
                                readOnly={!isEditOn}
                            />

                            {/* Last Seen */}
                            <p className="text-xs opacity-70">
                                Last seen {moment(lastSeen).fromNow()}
                            </p>
                        </div>

                        {/* BIO SECTION */}
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Bio</p>
                            <Textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                readOnly={!isEditOn}
                                className={`min-h-[90px] bg-muted rounded-md ${!isEditOn && "pointer-events-none opacity-80 border-none"
                                    }`}
                                placeholder="Write something about yourself..."
                            />
                        </div>

                        {/* BUTTON SECTION */}
                        <div className="space-y-3">
                            {isEditOn ? (
                                <Button
                                    onClick={handleEditUser}
                                    disabled={loading.editLoading}
                                    className="w-full font-semibold"
                                >
                                    {loading.editLoading ? <Spinner /> : "Save Changes"}
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        className="w-full flex gap-2 font-medium"
                                        onClick={() => setIsEditOn(true)}
                                    >
                                        <Edit size={16} /> Edit Profile
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                className="w-full flex gap-2 font-medium"
                                            >
                                                {loading.deleteLoading ? <Spinner /> : <Trash size={16} />}
                                                Delete Account
                                            </Button>
                                        </AlertDialogTrigger>

                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete your account?
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDeleteUser}>
                                                    Yes, Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    <Button
                                        variant="secondary"
                                        className="w-full flex gap-2 font-medium"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={16} /> Logout
                                    </Button>
                                </>
                            )}
                        </div>
                    </Card>
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default Profile;
