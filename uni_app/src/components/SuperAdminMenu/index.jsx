import './index.scss'
import {useState} from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import {Button, Layout, Menu, theme} from 'antd';
import {MdHomeRepairService, MdLogout, MdOutlineAdminPanelSettings, MdOutlineSecurity} from "react-icons/md";
import Swal from "sweetalert2";
import SuperAdminTable from "../SuperAdminTable/index.jsx";
import {IoPeople, IoPersonAddSharp} from "react-icons/io5";
import {FaBookOpen, FaBuilding, FaChalkboardTeacher} from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import BuildingsMenu from "../BuildingsMenu/index.jsx";
import {useNavigate} from "react-router";
import FacultiesMenu from "../FacultiesMenu/index.jsx";
import AddAVisitor from "../AddAVisitor/index.jsx";
import DepartmentsMenu from "../DepartmentsMenu/index.jsx";
import TeachersMenu from "../TeachersMenu/index.jsx";

const {Header, Sider, Content} = Layout;

const SuperAdminMenu = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState('1');

    const navigate = useNavigate();

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const renderContent = () => {
        switch (selectedMenuItem) {
            case '1':
                return <SuperAdminTable/>;
            case '2':
                return <AddAVisitor/>;
            case '3':
                return <div>Content 4</div>;
            case '4':
                return <div>Content 5</div>;
            case '5':
                return <BuildingsMenu/>;
            case '6':
                return <FacultiesMenu/>;
            case '7':
                return <DepartmentsMenu/>;
            case '8':
                return <TeachersMenu/>;
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
                            icon: <MdOutlineSecurity className={"icon"}/>,
                            label: 'Guardians',
                        },
                        {
                            key: '5',
                            icon: <FaBuilding className={"icon"}/>,
                            label: 'Buildings',
                        },
                        {
                            key: '6',
                            icon: <FaBookOpen className={"icon"}/>,
                            label: 'Faculties',
                        },
                        {
                            key: '7',
                            icon: <MdHomeRepairService className={"icon"}/>,
                            label: 'Departments',
                        },
                        {
                            key: '8',
                            icon: <FaChalkboardTeacher className={"icon"}/>,
                            label: 'Teachers',
                        },
                        {
                            key: '9',
                            icon: <MdLogout className={"icon"}/>,
                            label: 'Log out',
                            style: {
                                position: 'absolute',
                                bottom: 0,
                            },
                            onClick: () => {
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
                                        Cookies.set("token", "null");
                                        Cookies.set("role", "null");
                                        setTimeout(() => {
                                            navigate('/login')
                                        }, 2000);
                                        Swal.fire({
                                            title: "Deleted!",
                                            text: "Your file has been deleted.",
                                            icon: "success"
                                        });
                                    }
                                });
                            }
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
                    <div className={"profile"}>
                        <div className={"img1"}>
                            <img src={""} alt={""}/>
                        </div>
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
