import React from 'react'
import { UserCircle } from "lucide-react";

function SelectUser() {
    return (
        <div className="flex flex-col items-center justify-center h-[80vh]">
            <UserCircle className="w-16 h-16 text-blue-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-2 text-center">
                Welcome!
            </h3>
            <p className="text-lg text-gray-500 dark:text-gray-400 text-center">
                Please select a profile to start chatting.
            </p>
        </div>
    );
}

export default SelectUser
