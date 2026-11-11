import React, { useEffect, useState } from "react";
import { fetchMedia } from "../services/messageServices.js"
import { useUser } from "../context/UserContext.jsx";

function MediaLibrary() {
    const { user } = useUser()
    const [media, setMedia] = useState([]);

    async function fetchMediaLibrary() {
        try {
            const response = await fetchMedia({
                userId: user._id,
                senderId: "6949237c938893a4291b3998",
                page: 1
            });
            console.log("Media Data :", response);

        } catch (error) {
            console.log("Error While Fetch Media :", error);
        }
    }

    useEffect(() => {
        fetchMediaLibrary();
    }, [])

    return (
        <h3>HEY THIS IS MEDIA LIBRARY</h3>
    )
}

export default MediaLibrary;