import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {Button, TextField} from "@mui/material";
import {usePostAdminLoginMutation, usePostSecurityLoginMutation} from "../../services/usersApi.jsx";
import {useFormik} from "formik";
import {Bounce, toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from "react-router";
import Cookies from 'js-cookie';
import {PulseLoader} from "react-spinners";
import './index.scss'

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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function LoginTabs() {
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [postAdminLogin, {isLoading: isAdminLoading}] = usePostAdminLoginMutation();
    const [postSecurityLogin, {isLoading: isSecurityLoading}] = usePostSecurityLoginMutation();

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: async (values) => {
            try {
                let response;
                if (value === 0) {
                    response = await postAdminLogin(values).unwrap();
                    if (response?.statusCode === 200) {
                        toast.success('Admin login successful!', {
                            position: "top-right",
                            autoClose: 1500,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            transition: Bounce,
                        });
                        Cookies.set('token', response?.data?.token, {expires: 7});
                        Cookies.set('role', response?.data?.role, {expires: 7});
                        setTimeout(() => {
                            if (response?.data?.role === 'SuperAdmin') {
                                navigate('/scp');
                            } else if (response?.data?.role === 'Admin') {
                                navigate('/cp');
                            }
                        }, 2500);
                    }
                } else {
                    response = await postSecurityLogin(values).unwrap();
                    if (response?.statusCode === 200) {
                        toast.success('Security login successful!', {
                            position: "top-right",
                            autoClose: 1500,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            transition: Bounce,
                        });
                        Cookies.set('token', response?.data?.token, {expires: 7});
                        setTimeout(() => {
                            navigate('/security');
                        }, 2500);
                    }
                }
            } catch (error) {
                toast.error(`${error?.data?.error}`, {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            }
        },
    });

    const isLoading = value === 0 ? isAdminLoading : isSecurityLoading;

    return (
        <Box sx={{width: '100%'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example"
                      TabIndicatorProps={{
                          style: {
                              backgroundColor: "#a99674"
                          }
                      }}>
                    <Tab label="Login as admin" {...a11yProps(0)} />
                    <Tab label="Login as security" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
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
                        sx={{
                            '& .MuiInputLabel-root': {
                                color: '#a99674',
                            },
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#a99674',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#a99674',
                            },
                            '&:hover .MuiInputLabel-root': {
                                color: '#a99674',
                            },
                        }}
                    />
                    <TextField
                        required
                        id="outlined-required-password"
                        label="Password"
                        type="password"
                        className="input"
                        fullWidth
                        margin="normal"
                        name="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        sx={{
                            '& .MuiInputLabel-root': {
                                color: '#a99674',
                            },
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#a99674',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#a99674',
                            },
                            '&:hover .MuiInputLabel-root': {
                                color: '#a99674',
                            },
                        }}
                    />
                    <Button
                        type="submit"
                        className="buttonForLoginTabs"
                        variant="contained"
                        fullWidth
                        style={{marginTop: '16px', backgroundColor: '#a99674'}}
                        disabled={isLoading}
                    >
                        {isLoading ? <PulseLoader size={10} color={'white'} style={{
                            margin: '0'
                        }}/> : "Login"}
                    </Button>
                </form>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
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
                        sx={{
                            '& .MuiInputLabel-root': {
                                color: '#a99674',
                            },
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#a99674',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#a99674',
                            },
                            '&:hover .MuiInputLabel-root': {
                                color: '#a99674',
                            },
                        }}
                    />
                    <TextField
                        required
                        id="outlined-required-password"
                        label="Password"
                        type="password"
                        className="input"
                        fullWidth
                        margin="normal"
                        name="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        sx={{
                            '& .MuiInputLabel-root': {
                                color: '#a99674',
                            },
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#a99674',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#a99674',
                            },
                            '&:hover .MuiInputLabel-root': {
                                color: '#a99674',
                            },
                        }}
                    />
                    <Button
                        type="submit"
                        className="button"
                        variant="contained"
                        fullWidth
                        style={{marginTop: '16px', backgroundColor: '#a99674'}}
                        disabled={isLoading}
                    >
                        {isLoading ? <PulseLoader size={10} color={'white'} style={{
                            margin: '0'
                        }}/> : "Login"}
                    </Button>
                </form>
            </CustomTabPanel>
            <ToastContainer/>
        </Box>
    );
}
