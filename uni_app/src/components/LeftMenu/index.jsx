import { useState } from 'react';
import './index.scss';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import UserTable from "../UserTable/index.jsx";
import { MdLogout } from "react-icons/md";
import Swal from "sweetalert2";
import { useGetFileQuery } from "../../services/usersApi.jsx";

const { Header, Sider, Content } = Layout;

const LeftMenu = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
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

    const { data: fileData, error, isLoading } = useGetFileQuery();

    async function handleGet() {
        // Check if the data is loaded and available
        if (fileData) {
            // Create a Blob from the fileContents
            const blob = new Blob([new Uint8Array(atob(fileData.data.fileContents).split('').map(char => char.charCodeAt(0)))], { type: fileData.data.contentType });
            const url = URL.createObjectURL(blob);

            // Create a link element for downloading
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file.xlsx'); // Dosya adı
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url); // Bellekten URL'yi kaldır
        } else if (error) {
            console.error("Error fetching file:", error);
        }
    }

    return (
        <Layout id={"leftMenu"}>
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
                    <div>
                        <button onClick={handleGet} disabled={isLoading}>
                            {isLoading ? 'Loading...' : 'GET FILE'}
                        </button>
                        {error && <p>Error loading file: {error.message}</p>}
                    </div>
                </div>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <UserOutlined />,
                            label: 'nav 1',
                        },
                        {
                            key: '2',
                            icon: <VideoCameraOutlined />,
                            label: 'nav 2',
                        },
                        {
                            key: '3',
                            icon: <UploadOutlined />,
                            label: 'nav 3',
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
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
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
                            : Security
                        </span>
                        <button onClick={() => handleLogOutBtn()}>
                            <MdLogout />
                        </button>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 0,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <UserTable />
                </Content>
            </Layout>
        </Layout>
    );
};

export default LeftMenu;
