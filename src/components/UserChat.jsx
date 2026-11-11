import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover.js";
import { Button } from "./ui/button.js";

function UserChat({
    id = "",
    bio = "",
    profilePhoto = "",
    username = "",
    lastSeen = "",
    isUnreadMsg = false,
    unreadMsgCount = 0,
    navigateId = "",
    isOnline = false,
}) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (navigateId) {
            navigate(`/chat/${navigateId}`);
        }
    };

    return (
        <div className="flex p-3 items-center gap-3 justify-center-safe group">
            <Profile
                username={username || ""}
                bio={bio || ""}
                profilePhoto={profilePhoto || ""}
                id={id || ""}
                lastSeen={lastSeen || ""}
            />

            <Button
                onClick={handleClick}
                variant={'ghost'}
                className="
                flex-1 flex items-center gap-4 px-4 py-3 min-w-full
                rounded-xl cursor-pointer text-left
                transition-al
                active:scale-[0.99]
            "
            >
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base truncate text-foreground">{username}</p>

                    <p className="text-xs text-muted-foreground truncate">
                        {isOnline
                            ? <span className="text-green-600 dark:text-green-400 font-medium text-wrap">Online</span>
                            : lastSeen
                                ? moment(lastSeen).fromNow()
                                : "Offline"}

                    </p>
                </div>

                {isUnreadMsg && unreadMsgCount > 0 && (
                    <Badge
                        className="
                        rounded-full h-6 min-w-[1.5rem]
                        flex items-center justify-center 
                        px-1 text-xs font-bold bg-primary text-primary-foreground
                        animate-in zoom-in
                        "
                    >
                        {unreadMsgCount}
                    </Badge>
                )}
            </Button>
        </div>
    );
}

export default UserChat;