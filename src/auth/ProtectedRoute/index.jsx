import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const location = useLocation();

    const restrictedWithoutToken = ["/cp", "/scp", "/security"];
    const currentPath = location.pathname;

    if (token === "undefined") {
        if (restrictedWithoutToken.includes(currentPath)) {
            return <Navigate to="/" replace state={{ from: location }} />;
        }
    }

    const restrictedPaths = {
        Admin: ["/scp", "/security", "/main"],
        SuperAdmin: ["/cp", "/security", "/main"],
        Security: ["/cp", "/scp", "/main"],
    };

    if (role && restrictedPaths[role]?.includes(currentPath)) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return children;
};

export { ProtectedRoute };
