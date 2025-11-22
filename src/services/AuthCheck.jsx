import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

function AuthCheck() {
    const { user } = useUser();

    if (!user) {
        // return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default AuthCheck;
