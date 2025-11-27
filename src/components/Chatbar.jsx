import React, { useEffect, useState } from "react";
import UserChat from "./UserChat.jsx";
import { fetchAllUsers } from "../services/userServices.js";
import { useUser } from "../context/UserContext.jsx";
import { Button } from "./ui/button";
import { SidebarOpen, X, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { subscribe } from '../socket/socket.js'

function Chatbar() {
    const { user } = useUser();
    const [usersList, setUsersList] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const response = await fetchAllUsers(user?._id);
            setUsersList(response);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        subscribe("online_users", (users) => {
            console.log("All Online Users:", users);
        });

        subscribe("user_online", (user) => {
            console.log("One user came online:", user);
        });
    }, []);


    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden absolute top-3 left-3 z-50 rounded-full bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm shadow"
                onClick={() => setIsOpen(true)}
            >
                <SidebarOpen size={22} />
            </Button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div
                className={`
                    fixed md:static top-0 left-0 
                    h-full w-72 
                    bg-white/80 dark:bg-neutral-900/80 
                    backdrop-blur-md
                    border-r border-neutral-200 dark:border-neutral-800
                    shadow-xl md:shadow-none
                    transition-transform duration-300 z-50
                    ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >

                <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
                    <h2 className="font-semibold text-xl tracking-wide">
                        Messages
                    </h2>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsOpen(false)}
                    >
                        <X size={20} />
                    </Button>
                </div>

                {/* Create New User */}
                <div className="p-4">
                    <Button
                        className="w-full py-5 rounded-2xl text-base font-medium shadow-sm hover:shadow-md transition"
                    >
                        <UserPlus className="mr-2" /> Create New User
                    </Button>
                </div>

                <div className="px-3 pb-6 overflow-y-auto h-[calc(100vh-170px)] space-y-2 custom-scrollbar">
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
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            No users found.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Chatbar;
