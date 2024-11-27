import LoginPage from "../pages/LoginPage/index.jsx";
import SecurityPage from "../pages/SecurityPage/index.jsx";
import Pages from "../pages/index.jsx";
import SuperAdminPage from "../pages/SuperAdminPage/index.jsx";
import UserPage from "../pages/UserPage/index.jsx";
import AdminPage from "../pages/AdminPage/index.jsx";
import HomePage from "../pages/HomePage/index.jsx";
import ErrorPage from "../pages/ErrorPage/index.jsx";
import {ProtectedRoute} from "../auth/ProtectedRoute/index.jsx";

export const ROUTES = [
    {
        path: '/',
        element: <Pages/>,
        children: [
            {
                index: true,
                element: <HomePage/>
            },
            {
                path: '/main',
                element: <ProtectedRoute><UserPage/></ProtectedRoute>
            },
            {
                path: 'login',
                element: <LoginPage/>
            },
            {
                path: 'security',
                element: <ProtectedRoute><SecurityPage/></ProtectedRoute>
            },
            {
                path: 'cp',
                element: <ProtectedRoute><AdminPage/></ProtectedRoute>
            },
            {
                path: 'scp',
                element: <ProtectedRoute><SuperAdminPage/></ProtectedRoute>
            },
            {
                path: '*',
                element: <ErrorPage/>
            },
        ]
    }
]