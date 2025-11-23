import React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Ghost, Home } from "lucide-react"

function PageNotFound() {
    const navigate = useNavigate()

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center text-center px-4">

            {/* Icon */}
            <Ghost className="h-24 w-24 text-gray-400 mb-6" />

            {/* Heading */}
            <h1 className="text-4xl font-bold mb-2">
                404 - Page Not Found
            </h1>

            {/* Subtext */}
            <p className="text-gray-600 mb-6 max-w-md">
                The page you’re looking for doesn't exist or has been moved.
            </p>

            {/* Back Home Button */}
            <Button
                className="flex items-center gap-2"
                onClick={() => navigate("/")}
            >
                <Home className="h-5 w-5" />
                Go Back Home
            </Button>

        </div>
    )
}

export default PageNotFound
