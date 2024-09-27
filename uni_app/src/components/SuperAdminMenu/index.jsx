import './index.scss'
import {useState} from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import {Button, Checkbox, Input, Layout, Menu, theme, Form} from 'antd';
import {MdHomeRepairService, MdLogout, MdOutlineAdminPanelSettings, MdOutlineSecurity} from "react-icons/md";
import Swal from "sweetalert2";
import SuperAdminTable from "../SuperAdminTable/index.jsx";
import {IoPeople, IoPersonAddSharp} from "react-icons/io5";
import {FaBookOpen, FaBuilding, FaChalkboardTeacher} from "react-icons/fa";
import {RiAdminFill} from "react-icons/ri";
import {useFormik} from "formik";
import * as Yup from 'yup';
import BuildingsTable from "../BuildingsTable/index.jsx";
import {useGetAllBuildingsQuery, usePostNewBuildingMutation} from "../../services/usersApi.jsx";
import {ToastContainer, toast, Bounce} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";

const {TextArea} = Input;
const {Header, Sider, Content} = Layout;

const SuperAdminMenu = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState('1');
    const [isCarChecked, setIsCarChecked] = useState(false);
    const {data: allBuildings, refetch} = useGetAllBuildingsQuery();

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            description: '',
            carNumber: null
        },
        validationSchema: Yup.object({
            carNumber: Yup.string().matches(/^[0-9]{2}-[A-Z]{2}-[0-9]{3}$/, 'Invalid car number format! Example: 77-AA-777').nullable(),
        }),
        onSubmit: values => {
            console.log(values);
        },
    });

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    function handleLogOutBtn() {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
            }
        });
    }

    function handleCheckboxChange(e) {
        setIsCarChecked(e.target.checked);
        if (!e.target.checked) {
            formik.setFieldValue('carNumber', null);
        }
    }

    const [postNewBuilding] = usePostNewBuildingMutation();

    const [buildingName, setBuildingName] = useState('');
    const [form] = Form.useForm();

    async function handleAdd(values) {
        const buildingData = {
            name: values.building,
        };

        const response = await postNewBuilding(buildingData).unwrap()
        if (response && response?.statusCode === 200) {
            toast.success(response.message, {
                position: "bottom-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            refetch()

        }

        setBuildingName('')
        form.resetFields()
    }

    const renderContent = () => {
        switch (selectedMenuItem) {
            case '1':
                return <SuperAdminTable/>;
            case '2':
                return (
                    <Form className={"wrapper"} onFinish={formik.handleSubmit}>
                        <h2>Add new visitor</h2>
                        <Form.Item
                            name="visitorName"
                            rules={[{required: true, message: 'Please input visitor name!'}]}
                        >
                            <div className={"box"}>
                                <label>
                                    <span style={{color: 'red'}}>* </span>Visitor name
                                </label>
                                <Input
                                    className={"input"}
                                    size="large"
                                    name="firstName"
                                    placeholder="Visitor name"
                                    onChange={formik.handleChange}
                                    value={formik.values.firstName}
                                />
                            </div>
                        </Form.Item>
                        <Form.Item
                            name="visitorSurname"
                            rules={[{required: true, message: 'Please input visitor surname!'}]}
                        >
                            <div className={"box"}>
                                <label>
                                    <span style={{color: 'red'}}>* </span>Visitor surname
                                </label>
                                <Input
                                    className={"input"}
                                    size="large"
                                    name="lastName"
                                    placeholder="Visitor surname"
                                    onChange={formik.handleChange}
                                    value={formik.values.lastName}
                                />
                            </div>
                        </Form.Item>
                        <Form.Item
                            name="visitorEmail"
                            rules={[{required: true, type: 'email', message: 'Please input a valid email!'}]}
                        >
                            <div className={"box"}>
                                <label>
                                    <span style={{color: 'red'}}>* </span>Visitor email
                                </label>
                                <Input
                                    className={"input"}
                                    size="large"
                                    name="email"
                                    placeholder="Visitor email"
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                />
                            </div>
                        </Form.Item>
                        <Form.Item
                            name="description"
                            rules={[{required: true, message: 'Please provide a description!'}]}
                        >
                            <div className={"box"}>
                                <label>
                                    <span style={{color: 'red'}}>* </span>Description
                                </label>
                                <TextArea
                                    className={"input"}
                                    rows={4}
                                    size={"large"}
                                    name="description"
                                    placeholder="Description"
                                    style={{resize: "none"}}
                                    onChange={formik.handleChange}
                                    value={formik.values.description}
                                />
                            </div>
                        </Form.Item>
                        <Form.Item name="carCheck" valuePropName="checked">
                            <div className={"box"}>
                                <label>
                                    <span style={{color: 'red'}}></span>Will he/she come by car?
                                </label>
                                <Checkbox onChange={handleCheckboxChange}/>
                            </div>
                        </Form.Item>
                        {isCarChecked && (
                            <Form.Item
                                name="carNumber"
                                rules={[{required: true, message: 'Please input car number!'}]}
                            >
                                <div className={"box"}>
                                    <label>
                                        <span style={{color: 'red'}}>* </span>Car number
                                    </label>
                                    <Input
                                        className={"input"}
                                        size="large"
                                        name="carNumber"
                                        placeholder="Car number"
                                        onChange={formik.handleChange}
                                        value={formik.values.carNumber}
                                    />
                                </div>
                                {formik.errors.carNumber && formik.touched.carNumber ? <div style={{
                                    color: "red",
                                    marginTop: '10px'
                                }}>{formik.errors.carNumber}</div> : null}
                            </Form.Item>
                        )}
                        <div className={"buttonWrapper"} style={{
                            display: 'flex',
                            gap: '10px'
                        }}>
                            <Button size={"large"} type="primary" htmlType="submit">Save</Button>
                            <Button size={"large"} className={"buttonSave"} type="primary">Save and exit</Button>
                            <Button size={"large"} className={"buttonSave"} type="primary" danger>Cancel</Button>
                        </div>
                    </Form>
                );
            case '3':
                return <div>Content 3</div>;
            case '4':
                return <div>Content 4</div>;
            case '5':
                return <div>Content 5</div>;
            case '6':
                return <div className={"wrapper1"}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <h2>Buildings</h2>
                        <select>
                            <option selected disabled>Sort by</option>
                            <option>Newest</option>
                            <option>Oldest</option>
                            <option>A-Z</option>
                            <option>Z-A</option>
                        </select>
                    </div>
                    <Form
                        form={form}
                        onFinish={handleAdd}
                    >
                        <div className={"box"}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                <label style={{
                                    minWidth: '120px'
                                }}>Search building: </label>
                                <Input
                                    className={"input"}
                                    size="large"
                                />
                            </div>
                            <div className={"box1"}>
                                {/*<Form.Item*/}
                                {/*    label="Add new building"*/}
                                {/*    name="building"*/}
                                {/*    rules={[{*/}
                                {/*        required: true,*/}
                                {/*        message: 'Please enter a building name!'*/}
                                {/*    }]}*/}
                                {/*>*/}
                                {/*    <Input*/}
                                {/*        className={"input"}*/}
                                {/*        size="large"*/}
                                {/*        value={buildingName}*/}
                                {/*        onChange={(e) => setBuildingName(e.target.value)}*/}
                                {/*    />*/}
                                {/*</Form.Item>*/}
                                {/*<Button*/}
                                {/*    size={"large"}*/}
                                {/*    className={"buttonSave"}*/}
                                {/*    type="primary"*/}
                                {/*    htmlType="submit"*/}
                                {/*>*/}
                                {/*    Add*/}
                                {/*</Button>*/}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}>
                                    <label style={{
                                        minWidth: '120px'
                                    }}>Add new building</label>
                                    <Input
                                        className={"input"}
                                        size="large"
                                    />
                                    <Button style={{
                                        marginLeft: '10px'
                                    }} type={"primary"} size={"large"} htmlType={"submit"}>
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Form>
                    <BuildingsTable/>
                </div>
            case '7':
                return <div>Content 7</div>;
            case '8':
                return <div>Content 8</div>;
            case '9':
                return <div>Content 9</div>;
            default:
                return <SuperAdminTable/>;
        }
    };

    return (
        <Layout id={"superAdminMenu"}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className={collapsed ? "img collapsed" : "img"}>
                    <img
                        src={"https://bdu.info.az/storage/photos/44/MED%C4%B0AK%C4%B0T/0-Baki%20Dovlet%20Universiteti.png"}
                        alt={"Image"}
                    />
                    <span style={{
                        color: 'white',
                        textAlign: 'center',
                        fontSize: '16px'
                    }}>
                    {collapsed ? "BSU" : "Baku State University"}
                    </span>
                </div>
                <div className="demo-logo-vertical"/>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    selectedKeys={[selectedMenuItem]}
                    onClick={({key}) => setSelectedMenuItem(key)}
                    items={[
                        {
                            key: '1',
                            icon: <IoPeople className={"icon"}/>,
                            label: 'Visitors',
                        },
                        {
                            key: '2',
                            icon: <IoPersonAddSharp className={"icon"}/>,
                            label: 'Add a visitor',
                        },
                        {
                            key: '3',
                            icon: <MdOutlineAdminPanelSettings className={"icon"}/>,
                            label: 'Roles',
                        },
                        {
                            key: '4',
                            icon: <RiAdminFill className={"icon"}/>,
                            label: 'Admins',
                        },
                        {
                            key: '5',
                            icon: <MdOutlineSecurity className={"icon"}/>,
                            label: 'Guardians',
                        },
                        {
                            key: '6',
                            icon: <FaBuilding className={"icon"}/>,
                            label: 'Buildings',
                        },
                        {
                            key: '7',
                            icon: <FaBookOpen className={"icon"}/>,
                            label: 'Faculties',
                        },
                        {
                            key: '8',
                            icon: <MdHomeRepairService className={"icon"}/>,
                            label: 'Departments',
                        },
                        {
                            key: '9',
                            icon: <FaChalkboardTeacher className={"icon"}/>,
                            label: 'Teachers',
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingRight: '30px'
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <div className={"logOut"}>
                        <span>
                            <span>Role </span>
                            : {Cookies.get('role') === 'SuperAdmin' ? (<>Super Admin</>) : (
                                <></>
                        )}
                        </span>
                        <button onClick={() => handleLogOutBtn()}>
                            <MdLogout/>
                        </button>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );
};

export default SuperAdminMenu;
