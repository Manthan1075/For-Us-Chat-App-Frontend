import { io } from "socket.io-client";

let socket = null;

export const initiateSocketConnection = (userId) => {
    if (socket) return socket;

    socket = io(import.meta.env.VITE_SERVER_URL, {
        query: { userId },
        transports: ["websocket"],
    });

    return socket;
};

export const getSocket = () => socket;

export const subscribe = (event, callBack) => {
    if (!socket) return;
    socket.on(event, callBack);
};

export const unsubscribe = (event, callBack) => {
    if (!socket) return;
    socket.off(event, callBack);
};
