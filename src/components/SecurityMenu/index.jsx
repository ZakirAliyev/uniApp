import './index.scss'
import {useState} from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import {Button, Layout, Menu, theme} from 'antd';
import {MdLogout} from "react-icons/md";
import Swal from "sweetalert2";
import SuperAdminTable from "../SuperAdminTable/index.jsx";
import {IoPeople} from "react-icons/io5";
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import {useNavigate} from "react-router";
import {useGetAdminProfileDataQuery} from "../../services/usersApi.jsx";
import {FaCircleUser} from "react-icons/fa6";
import SecurityTable from "../SecurityTable/index.jsx";

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
                return <SecurityTable/>;
            default:
                return <SecurityTable/>;
        }
    };

    const {data: adminProfileData} = useGetAdminProfileDataQuery()

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
                            icon: <FaCircleUser className={"icon"}/>,
                            label: 'Profile',
                            style: {
                                position: 'absolute',
                                bottom: '42px',
                            }
                        },
                        {
                            key: '3',
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
                                    }
                                });
                            }
                        }
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
                        <span style={{
                            color: 'red',
                            padding: '5px'
                        }}>Security: </span>
                        <span>
                            {adminProfileData?.name}
                            {adminProfileData?.surname}
                        </span>
                        <div className={"img1"}>
                            <img src={adminProfileData?.imgUrl} alt={"Image"}/>
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
