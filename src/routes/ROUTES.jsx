import LoginPage from "../pages/LoginPage/index.jsx";
import SecurityPage from "../pages/SecurityPage/index.jsx";
import Pages from "../pages/index.jsx";
import SuperAdminPage from "../pages/SuperAdminPage/index.jsx";

export const ROUTES = [
    {
        path: '/',
        element: <Pages/>,
        children: [
            {
                index: true,
                element: <></>
            },
            {
                path: 'login',
                element: <LoginPage/>
            },
            {
                path: 'security',
                element: <SecurityPage/>
            },
            {
                path: 'cp',
                element: <></>
            },
            {
                path: 'scp',
                element: <SuperAdminPage/>
            },
        ]
    }
]