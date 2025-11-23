import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import moment from "moment";
import { useNavigate } from "react-router-dom";

function UserChat({
    profilePhoto = "",
    username = "",
    lastSeen = "",
    isUnreadMsg = false,
    unreadMsgCount = 0,
    navigateId = "",
}) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/chat/${navigateId}`);
    };

    return (
        <button
            onClick={handleClick}
            className="
                w-full flex items-center gap-4 px-4 py-3 
                rounded-xl border 
                transition-all 
                hover:bg-gray-100 dark:hover:bg-neutral-800 
                active:scale-[0.98]
            "
        >
            {/* Avatar */}
            <Avatar className="h-12 w-12 shrink-0">
                <AvatarImage src={profilePhoto} alt={username} />
                <AvatarFallback className="text-lg font-semibold">
                    {username?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 text-left">
                <p className="font-semibold text-base truncate">{username}</p>

                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {lastSeen ? moment(lastSeen).fromNow() : ""}
                </p>
            </div>

            {/* Unread Badge */}
            {isUnreadMsg && unreadMsgCount > 0 && (
                <Badge
                    className="
                        rounded-full min-w-7 h-7 
                        flex items-center justify-center 
                        px-0 text-sm font-semibold
                    "
                >
                    {unreadMsgCount}
                </Badge>
            )}
        </button>
    );
}

export default UserChat;
