// FriendsContext.jsx
import { createContext, useContext, useState } from "react";

const FriendsContext = createContext();

export const FriendsProvider = ({ children }) => {
    const [friends, setFriends] = useState([]);

    const setAllFriends = (list) => {
        setFriends(list);
    };

    const updateOnlineUsers = (onlineUserIds) => {
        setFriends(prev =>
            prev.map(friend => ({
                ...friend,
                isOnline: onlineUserIds.includes(friend._id)
            }))
        );
    };

    const setActiveFriend = (friendId) => {
        setFriends(prev =>
            prev.map(friend => ({
                ...friend,
                isActiveChat: user._id === friendId
            }))
        );
    };

    return (
        <FriendsContext.Provider value={{
            friends,
            setAllFriends,
            updateOnlineUsers,
            setActiveFriend
        }}>
            {children}
        </FriendsContext.Provider>
    );
};

export const useFriends = () => useContext(FriendsContext);
