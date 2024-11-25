import './index.scss';
import {useState} from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import {Button, Layout, Menu, theme} from 'antd';
import {MdLogout, MdOutlinePendingActions, MdPersonAddAlt1} from "react-icons/md";
import Swal from "sweetalert2";
import {IoPeople} from "react-icons/io5";
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import {useNavigate} from "react-router";
import {FaCircleUser} from "react-icons/fa6";
import SecurityTable from "../SecurityTable/index.jsx";
import SecurityProfileSection from "../SecurityProfileSection/index.jsx";
import AdminTable from "../AdminTable/index.jsx";
import {useGetAdminProfileDataQuery} from "../../services/usersApi.jsx";
import AdminVisitorRequests from "../AdminVisitorRequests/index.jsx";
import AddAVisitor from "../AddAVisitor/index.jsx";

const {Header, Sider, Content} = Layout;

const AdminMenu = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState('1');

    const navigate = useNavigate();

    const {data: profileData} = useGetAdminProfileDataQuery()

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const renderContent = () => {
        switch (selectedMenuItem) {
            case '1':
                return <AdminTable/>
            case '2':
                return <AdminVisitorRequests/>
            case '3':
                return <AddAVisitor/>
            case '6':
                return <SecurityProfileSection/>
            default:
                return <AdminTable/>;
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
                        {collapsed ? "BSU" : "Bakı Dövlət Universiteti"}
                    </span>
                </div>
                <div className="demo-logo-vertical"/>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    selectedKeys={[selectedMenuItem]}
                    onClick={({key}) => {
                        setSelectedMenuItem(key);
                        if (key === '2' || key === '3' || key === '4') {
                            resetMenuItem();
                        }
                    }}
                    items={[
                        {
                            key: '1',
                            icon: <IoPeople className={"icon"}/>,
                            label: 'Bütün ziyarətçilər',
                        },
                        {
                            key: '2',
                            icon: <MdOutlinePendingActions className={"icon"}/>,
                            label: 'Ziyarətçi Sorğuları',
                        },
                        {
                            key: '3',
                            icon: <MdPersonAddAlt1 className={"icon"}/>,
                            label: 'Ziyarətçi əlavə et',
                        },
                        {
                            key: '6',
                            icon: <FaCircleUser className={"icon"}/>,
                            label: 'Profil',
                            style: {
                                position: 'absolute',
                                bottom: '42px',
                            }
                        },
                        {
                            key: '7',
                            icon: <MdLogout className={"icon"}/>,
                            label: 'Çıxış',
                            style: {
                                position: 'absolute',
                                bottom: 0,
                            },
                            onClick: () => {
                                Swal.fire({
                                    title: "Əminsiniz?",
                                    text: "Bunu geri qaytara bilməyəcəksiniz!",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#3085d6",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "Bəli"
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        Cookies.set("token", "null");
                                        Cookies.set("role", "null");
                                        setTimeout(() => {
                                            navigate('/login');
                                        }, 0);
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
                            color: '#495464',
                            padding: '5px'
                        }}>Xoş gəlmisiniz: </span>
                        <span>
                            {profileData?.name} {profileData?.surname}
                        </span>
                        <div className={"img1"}>
                            <img style={{
                                border: '1px solid #195464'
                            }} src={profileData?.imgUrl} alt={"Image"}/>
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

export default AdminMenu;
