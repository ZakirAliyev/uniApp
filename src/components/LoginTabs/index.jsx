import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {Button, TextField} from "@mui/material";
import {
    usePostAdminLoginMutation,
    usePostSecurityLoginMutation,
    usePostSubAdminLoginMutation
} from "../../services/usersApi.jsx";
import {useFormik} from "formik";
import {Bounce, toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from "react-router";
import Cookies from 'js-cookie';
import {PulseLoader} from "react-spinners";
import './index.scss';

// Reusable TabPanel component for displaying tab content conditionally
function CustomTabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{p: 3}}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

// Helper function to generate accessibility props for tabs
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function LoginTabs() {
    const [value, setValue] = React.useState(0); // State to track selected tab
    const navigate = useNavigate();

    const [postAdminLogin, {isLoading: isAdminLoading}] = usePostAdminLoginMutation();
    const [postSecurityLogin, {isLoading: isSecurityLoading}] = usePostSecurityLoginMutation();
    const [postSubAdminLogin, {isLoading: isSubAdminLoading}] = usePostSubAdminLoginMutation();

    const formik = useFormik({
        initialValues: {email: '', password: ''},
        onSubmit: async (values) => handleLoginSubmit(values),
    });

    const isLoading = value === 0 ? isAdminLoading : value === 1 ? isSecurityLoading : isSubAdminLoading;

    const handleChange = (event, newValue) => setValue(newValue);

    const handleLoginSubmit = async (values) => {
        try {
            let response;
            switch (value) {
                case 0: // Admin login
                    response = await postAdminLogin(values).unwrap();
                    handleLoginSuccess(response, '/scp', '/cp');
                    break;
                case 1: // Security login
                    response = await postSecurityLogin(values).unwrap();
                    handleLoginSuccess(response, '/security');
                    break;
                case 2: // SubAdmin login
                    response = await postSubAdminLogin(values).unwrap();
                    handleLoginSuccess(response, '/main');
                    break;
                default:
                    break;
            }
        } catch (error) {
            handleLoginError(error);
        }
    };

    // Success handler for login with role-based redirection
    const handleLoginSuccess = (response, superAdminPath, adminPath) => {
        if (response?.statusCode === 200) {
            toast.success('Giriş uğula icra olundu!', toastOptions());
            Cookies.set('token', response?.data?.token, {expires: 7});
            Cookies.set('role', response?.data?.role, {expires: 7});
            setTimeout(() => {
                const path = response?.data?.role === 'SuperAdmin' ? '/scp' : response?.data?.role === 'Admin' ? '/cp' : response?.data?.role === 'Security' ? '/security' : '/main'
                navigate(path);
            }, 3500);
        }
    };

    const handleLoginError = (error) => {
        toast.error(`${error?.data?.error}`, toastOptions());
    };

    const toastOptions = () => ({
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
    });

    return (
        <Box sx={{width: '100%'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="login tabs"
                    TabIndicatorProps={{style: {backgroundColor: "#a99674"}}}
                >
                    <Tab label="ADMİN" {...a11yProps(0)} />
                    <Tab label="MÜHAVİZƏ" {...a11yProps(1)} />
                    <Tab label="İŞÇİ" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <LoginForm isLoading={isLoading} formik={formik}/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <LoginForm isLoading={isLoading} formik={formik}/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <LoginForm isLoading={isLoading} formik={formik}/>
            </CustomTabPanel>
            <ToastContainer/>
        </Box>
    );
}

// Reusable LoginForm component to reduce redundancy
function LoginForm({isLoading, formik}) {
    return (
        <form onSubmit={formik.handleSubmit}>
            <TextField
                required
                id="outlined-required-email"
                label="Email"
                className="input"
                fullWidth
                margin="normal"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                sx={inputStyles}
            />
            <TextField
                required
                id="outlined-required-password"
                label="Şifrə"
                type="password"
                className="input"
                fullWidth
                margin="normal"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                sx={inputStyles}
            />
            <Button
                type="submit"
                className="buttonForLoginTabs"
                variant="contained"
                fullWidth
                style={{marginTop: '16px', backgroundColor: '#a99674'}}
                disabled={isLoading}
            >
                {isLoading ? <PulseLoader size={10} color={'white'} style={{margin: '0'}}/> : "Daxİl ol"}
            </Button>
        </form>
    );
}

const inputStyles = {
    '& .MuiInputLabel-root': {color: '#a99674'},
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {borderColor: '#a99674'},
    },
    '& .MuiInputLabel-root.Mui-focused': {color: '#a99674'},
    '&:hover .MuiInputLabel-root': {color: '#a99674'},
};

LoginForm.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    formik: PropTypes.object.isRequired,
};
