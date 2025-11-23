import React, { useEffect, useState } from "react";
import UserChat from "./UserChat.jsx";
import { fetchAllUsers } from "../services/userServices.js";
import { useUser } from "../context/UserContext.jsx";
import { Button } from "./ui/button";
import { SidebarOpen, X, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Chatbar() {
    const { user } = useUser();
    const [usersList, setUsersList] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const response = await fetchAllUsers(user?._id);
            setUsersList(response);
            console.log("USERS : ", response);

        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <>
            {/* ---------- TOP LEFT TOGGLE BUTTON (ALWAYS VISIBLE ON MOBILE) ---------- */}
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden absolute top-3 left-3 z-50"
                onClick={() => setIsOpen(true)}
            >
                <SidebarOpen />
            </Button>

            {/* ---------- SIDEBAR OVERLAY (MOBILE) ---------- */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* ---------- SIDEBAR PANEL ---------- */}
            <div
                className={`
                    fixed md:static top-0 left-0 h-full w-72 
                    bg-white dark:bg-neutral-900 border-r 
                    transition-transform duration-300 z-50
                    ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >

                {/* Header + Close Button */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="font-semibold text-lg">Chats</h2>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsOpen(false)}
                    >
                        <X />
                    </Button>
                </div>

                {/* ---------- CREATE NEW USER BUTTON ---------- */}
                <div className="p-4">
                    <Button
                        className="w-full py-5 rounded-xl text-base font-medium"
                        onClick={() => navigate("/create-user")}
                    >
                        <UserPlus className="mr-2" /> Create New User
                    </Button>
                </div>

                {/* ---------- USERS LIST ---------- */}
                <div className="px-3 pb-6 overflow-y-auto h-[calc(100vh-160px)] space-y-2">
                    {Array.isArray(usersList?.users) && usersList.users.length > 0 ? (
                        usersList.users.map((chatUser) => (
                            <UserChat
                                key={chatUser?._id}
                                profilePhoto={chatUser.profilePhoto || ""}
                                username={chatUser.username || ""}
                                lastSeen={chatUser.lastSeen || ""}
                                isUnreadMsg={!!chatUser.unreadCount}
                                unreadMsgCount={chatUser.unreadCount || 0}
                                navigateId={chatUser?._id}
                            />
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            No users found.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Chatbar;
