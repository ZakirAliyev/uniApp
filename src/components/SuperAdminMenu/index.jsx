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
import DepartmentsMenu from "../DepartmentsMenu/index.jsx";
import TeachersMenu from "../TeachersMenu/index.jsx";
import AddATeacher from "../AddATeacher/index.jsx";
import {useGetAdminProfileDataQuery} from "../../services/usersApi.jsx";
import SuperAdminProfile from "../SuperAdminProfile/index.jsx";
import {FaCircleUser} from "react-icons/fa6";
import GuardiansMenu from "../GuardiansMenu/index.jsx";
import AddASubadmin from "../AddASubadmin/index.jsx";
import SubadminsMenu from "../SubadminsMenu/index.jsx";
import {RiAdminLine} from "react-icons/ri";
import {GrUserAdmin} from "react-icons/gr";
import SuperAdminDashboard from "../SuperAdminDashboard/index.jsx";
import {RxDashboard} from "react-icons/rx";

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
                return <SuperAdminDashboard/>;
            case '2':
                return <SuperAdminTable/>;
            case '3':
                return <GuardiansMenu/>;
            case '4':
                return <BuildingsMenu/>;
            case '5':
                return <FacultiesMenu/>;
            case '6':
                return <DepartmentsMenu/>;
            case '7':
                return <TeachersMenu/>;
            case '8':
                return <AddATeacher/>
            case '9':
                return <SubadminsMenu/>
            case '10':
                return <AddASubadmin/>
            case '11':
                return <SuperAdminProfile/>
            default:
                return <SuperAdminTable/>;
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
                    {collapsed ? "BDU" : "Bakı Dövlət Universiteti"}
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
                            icon: <RxDashboard className={"icon"}/>,
                            label: 'Nəzarət paneli',
                        },
                        {
                            key: '2',
                            icon: <IoPeople className={"icon"}/>,
                            label: 'Ziyarətçilər',
                        },
                        {
                            key: '3',
                            icon: <MdOutlineSecurity className={"icon"}/>,
                            label: 'Muhafizəçilər',
                        },
                        {
                            key: '4',
                            icon: <FaBuilding className={"icon"}/>,
                            label: 'Binalar',
                        },
                        {
                            key: '5',
                            icon: <FaBookOpen className={"icon"}/>,
                            label: 'Fakültə və şöbələr',
                        },
                        {
                            key: '6',
                            icon: <MdHomeRepairService className={"icon"}/>,
                            label: 'Kafedralar',
                        },
                        {
                            key: '7',
                            icon: <FaChalkboardTeacher className={"icon"}/>,
                            label: 'Adminlər',
                        },
                        {
                            key: '8',
                            icon: <IoPersonAddSharp className={"icon"}/>,
                            label: 'Admin əlavə et',
                        },
                        {
                            key: '9',
                            icon: <RiAdminLine className={"icon"}/>,
                            label: 'İşçilər',
                        },
                        {
                            key: '10',
                            icon: <GrUserAdmin className={"icon"}/>,
                            label: 'İşçi əlavə et',
                        },
                        {
                            key: '11',
                            icon: <FaCircleUser className={"icon"}/>,
                            label: 'Profil',
                            style: {
                                position: 'absolute',
                                bottom: '42px',
                            },
                        },
                        {
                            key: '12',
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
                                    confirmButtonText: "Bəli",
                                    cancelButtonText: "Xeyr"
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        Cookies.set("token", "null");
                                        Cookies.set("role", "null");
                                        setTimeout(() => {
                                            navigate('/login')
                                        }, 0);
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
                        <span style={{
                            color: '#252D37',
                            padding: '5px'
                        }}>Xoş gəlmisiniz: </span>
                        <span>
                            {adminProfileData?.name} {adminProfileData?.surname}
                        </span>
                        <div className={"img1"}>
                            <img style={{
                                border: '1px solid #195464'
                            }} src={adminProfileData?.imgUrl} alt={"Image"}/>
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
