import React, { useEffect, useState } from "react";
import UserChat from "./UserChat.jsx";
import { fetchAllUsers } from "../services/userServices.js";
import { useUser } from "../context/UserContext.jsx";
import { Button } from "./ui/button";
import { SidebarOpen, X, UserPlus, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import CreateUser from "./CreateUser.jsx";
import { subscribe } from "../socket/socket.js";
import { useParams } from 'react-router-dom'

function Chatbar() {
    const { user } = useUser();
    const [usersList, setUsersList] = useState([]);
    const [isOpen, setIsOpen] = useState(true);
    const { friendId } = useParams();
    const [loading, setLoading] = useState(false)

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await fetchAllUsers(user?._id);
            if (response.success) {
                setUsersList(response);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false)
        }
    };



    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        subscribe("online_users", (users) => {
            if (!usersList?.users) return;
            const updated = usersList.users.map((u) => ({
                ...u,
                isOnline: users.includes(u._id),
            }));
            setUsersList({ users: updated });
        });
    }, [usersList]);

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 left-3 z-[100] rounded-full bg-background shadow"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={22} /> : <SidebarOpen size={22} />}
            </Button>





            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 md:hidden max-h-screen z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`
          absolute md:static
          top-0 left-0 
          h-[100vh] w-72 
          bg-background border-r 
          z-50 shadow-md md:shadow-none
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:-translate-x-0 md:hidden"}
        `}
            >

                <div className="flex items-center justify-between gap-2 p-4 border-b bg-background">
                    <h2 className="font-semibold text-xl m-0">Messages</h2>
                    <Button
                        onClick={fetchUsers}
                        variant="outline"
                        className="flex items-center gap-2 px-3 py-2 rounded-full border shadow-sm bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-indigo-600 dark:text-indigo-300"
                        title="Refresh user list"
                    >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Refresh</span>
                    </Button>
                </div>



                {user.role === "admin" &&
                    (<div className="p-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full py-5">
                                    <UserPlus className="mr-2" /> Create New User
                                </Button>
                            </DialogTrigger>

                            <DialogContent>
                                <CreateUser />
                            </DialogContent>
                        </Dialog>
                    </div>
                    )}


                <div className="px-3 pb-6 pt-1.5 overflow-y-auto h-[calc(100vh-150px)] space-y-2">
                    {loading ? (
                        <div
                            className="flex items-center space-x-4 p-3 bg-white dark:bg-neutral-900 rounded-2xl border shadow animate-pulse"
                        >
                            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-neutral-700" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-700 rounded" />
                                <div className="h-3 w-20 bg-gray-200 dark:bg-neutral-700 rounded" />
                            </div>
                        </div>
                    ) : Array.isArray(usersList?.users) && usersList.users.length > 0 ? (
                        usersList.users.map((chatUser) => (
                            <div
                                className={`relative flex items-center border rounded-2xl transition-all duration-200 cursor-pointer ${chatUser._id === friendId
                                    ? "ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-700 shadow"
                                    : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                    }`}
                                key={chatUser?._id}
                            >
                                <UserChat
                                    id={chatUser._id || ""}
                                    bio={chatUser.bio || ""}
                                    profilePhoto={chatUser.profilePhoto || ""}
                                    username={chatUser.username || ""}
                                    lastSeen={chatUser.lastSeen || ""}
                                    isUnreadMsg={!!chatUser.unreadCount}
                                    unreadMsgCount={chatUser.unreadCount || 0}
                                    navigateId={chatUser?._id}
                                    isOnline={chatUser.isOnline}
                                />

                                {chatUser.isOnline && (
                                    <span className="absolute left-2 top-2 block w-3 h-3 rounded-full bg-green-500 border-2 border-background"></span>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-muted-foreground">
                            No users found.
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}

export default Chatbar;
