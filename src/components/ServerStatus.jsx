import React, { useEffect, useState } from "react";
import { checkServerStatus } from "../services/userServices";

const STATUS = {
    CHECKING: "checking",
    SLEEPING: "sleeping",
    RUNNING: "running",
    ERROR: "error",
};

function ServerStatus() {
    const [status, setStatus] = useState(STATUS.CHECKING);
    const [text, setText] = useState("Checking server…");

    const checkStatus = async () => {
        let didRespond = false;

        const sleepTimer = setTimeout(() => {
            if (!didRespond) {
                setStatus(STATUS.SLEEPING);
                setText("Server Starting please wait...");
            }
        }, 7000);

        try {
            const res = await checkServerStatus();
            didRespond = true;
            clearTimeout(sleepTimer);

            if (res.status === "OK") {
                setStatus(STATUS.RUNNING);
                setText("Running");
            } else {
                setStatus(STATUS.ERROR);
                setText("Unreachable");
            }
        } catch (err) {
            didRespond = true;
            clearTimeout(sleepTimer);
            setStatus(STATUS.ERROR);
            setText("Unreachable");
        }
    };

    useEffect(() => {
        checkStatus();
    }, []);

    const dotColor = {
        checking: "bg-gray-400",
        sleeping: "bg-yellow-500",
        running: "bg-green-500",
        error: "bg-red-500",
    }[status];

    return (
        <div className="fixed bottom-3 left-4 text-xs text-gray-400 flex items-center gap-2 select-none">
            <span className={`h-2 w-2 rounded-full ${dotColor}`} />
            <span className="text-gray-500">Server Status:</span>
            <span className="text-gray-300">{text}</span>
        </div>
    );
}

export default ServerStatus;
