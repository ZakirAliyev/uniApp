import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ROUTES } from "./routes/ROUTES.jsx";
import Cookies from 'js-cookie'

const routes = createBrowserRouter(ROUTES);

function App() {

    const adminToken = Cookies.get("adminToken");
    if (!adminToken) {
        Cookies.set("adminToken", "null");
    }

    const securityToken = Cookies.get("securityToken");
    if (!securityToken) {
        Cookies.set("securityToken", "null");
    }

    return (
        <RouterProvider router={routes} />
    );
}

export default App;