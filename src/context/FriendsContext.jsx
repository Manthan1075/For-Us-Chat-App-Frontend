import { createContext, useContext, useState } from "react";

const FriendsContext = createContext();

export const FriendsProvider = ({ children }) => {
    const [friends, setFriends] = useState([]);

    const setAllFriends = (friendsList, onlineUsers) => {
        setFriends(
            friendsList.map(friend => ({
                ...friend,
                isOnline: Array.isArray(onlineUsers) ? onlineUsers.includes(friend._id) : !!friend.isOnline
            }))
        );
    };

    const setOnlineFriends = (onlineUsers) => {
        setFriends(prevFriends =>
            prevFriends.map(friend => ({
                ...friend,
                isOnline: Array.isArray(onlineUsers) ? onlineUsers.includes(friend._id) : !!friend.isOnline
            }))
        );
    };

    return (
        <FriendsContext.Provider value={{
            friends,
            setAllFriends,
            setOnlineFriends
        }}>
            {children}
        </FriendsContext.Provider>
    );
};

export const useFriends = () => useContext(FriendsContext);
