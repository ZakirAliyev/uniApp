import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ROUTES } from "./routes/ROUTES.jsx";
import Cookies from 'js-cookie'

const routes = createBrowserRouter(ROUTES);

function App() {

    const token = Cookies.get("token");

    if (!token) {
        Cookies.set("token", "null");
    }

    const role = Cookies.get("role");

    if (!role) {
        Cookies.set("role", "null");
    }

    return (
        <RouterProvider router={routes} />
    );
}

export default App;