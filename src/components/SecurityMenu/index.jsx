import './index.scss';
import {useState} from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import {Button, Layout, Menu, theme} from 'antd';
import {MdLogout} from "react-icons/md";
import Swal from "sweetalert2";
import {IoPeople} from "react-icons/io5";
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import {useNavigate} from "react-router";
import {
    useGetAdminProfileDataQuery,
    useGetExcelFileQuery,
    useGetPdfFileQuery,
    useGetPrintFileQuery
} from "../../services/usersApi.jsx";
import {FaCircleUser} from "react-icons/fa6";
import SecurityTable from "../SecurityTable/index.jsx";
import {FaFileCsv, FaFileExcel, FaFilePdf} from "react-icons/fa";
import {IoMdPrint} from "react-icons/io";
import {saveAs} from 'file-saver';
import SecurityProfileSection from "../SecurityProfileSection/index.jsx";

const {Header, Sider, Content} = Layout;

const SuperAdminMenu = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState('1');

    const navigate = useNavigate();

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const resetMenuItem = () => {
        setTimeout(() => {
            setSelectedMenuItem('1');
        }, 1000);
    };

    const renderContent = () => {
        switch (selectedMenuItem) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
                return <SecurityTable/>;
            case '6':
                return <SecurityProfileSection/>
            default:
                return <SecurityTable/>;
        }
    };

    const {data: excelFile} = useGetExcelFileQuery();
    const excelFile1 = excelFile?.data;

    const {data: pdfFile} = useGetPdfFileQuery();
    const pdfFile1 = pdfFile?.data;

    const {data: printFile} = useGetPrintFileQuery();
    const printFile1 = printFile?.data;

    const {data: adminProfileData} = useGetAdminProfileDataQuery();

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
                            label: 'All visitors',
                        },
                        {
                            key: '2',
                            icon: <FaFileExcel className={"icon"}/>,
                            label: 'Export as Excel',
                            onClick: () => {
                                if (excelFile1 && excelFile1.fileContents) {
                                    const byteCharacters = atob(excelFile1.fileContents);
                                    const byteNumbers = new Array(byteCharacters.length);
                                    for (let i = 0; i < byteCharacters.length; i++) {
                                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                                    }
                                    const byteArray = new Uint8Array(byteNumbers);
                                    const blob = new Blob([byteArray], {type: excelFile1.contentType});
                                    saveAs(blob, excelFile1.fileDownloadName || 'export.xlsx');
                                    Swal.fire("Success", "Excel file downloaded successfully!", "success");
                                    resetMenuItem(); // Reset after download
                                } else {
                                    Swal.fire("Error", "Failed to load Excel file", "error");
                                }
                            }
                        },
                        {
                            key: '3',
                            icon: <FaFilePdf className={"icon"}/>,
                            label: 'Export as PDF',
                            onClick: () => {
                                if (pdfFile1 && pdfFile1.fileContents) {
                                    const byteCharacters = atob(pdfFile1.fileContents);
                                    const byteNumbers = new Array(byteCharacters.length);
                                    for (let i = 0; i < byteCharacters.length; i++) {
                                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                                    }
                                    const byteArray = new Uint8Array(byteNumbers);
                                    const blob = new Blob([byteArray], {type: pdfFile1.contentType});
                                    saveAs(blob, pdfFile1.fileDownloadName || 'export.pdf');
                                    Swal.fire("Success", "PDF file downloaded successfully!", "success");
                                    resetMenuItem(); // Reset after download
                                } else {
                                    Swal.fire("Error", "Failed to load PDF file", "error");
                                }
                            }
                        },
                        {
                            key: '4',
                            icon: <IoMdPrint className={"icon"}/>,
                            label: 'Print',
                            onClick: () => {
                                if (printFile1 && printFile1.content) {
                                    const printWindow = window.open('', '_blank');
                                    printWindow.document.write(`
                <html>
                    <head>
                        <title>Print</title>
                        <style>
                            @media print {
                                @page {
                                    size: A4 landscape;
                                    margin: 0;
                                }
                                body { 
                                    font-family: Arial, sans-serif; 
                                    margin: 20px; 
                                }
                                table { 
                                    width: 100%; 
                                    border-collapse: collapse; 
                                }
                                th, td { 
                                    border: 1px solid #ccc; 
                                    padding: 8px; 
                                    text-align: center; 
                                }
                            }
                        </style>
                    </head>
                    <body>
                        ${printFile1.content}
                    </body>
                </html>
            `);
                                    printWindow.document.close();
                                    printWindow.focus();
                                    printWindow.print();
                                    printWindow.close();
                                    Swal.fire("Success", "Print initiated successfully!", "success");
                                    resetMenuItem(); // Reset after print
                                } else {
                                    Swal.fire("Error", "Failed to load print data", "error");
                                }
                            }
                        },
                        {
                            key: '6',
                            icon: <FaCircleUser className={"icon"}/>,
                            label: 'Profile',
                            style: {
                                position: 'absolute',
                                bottom: '42px',
                            }
                        },
                        {
                            key: '7',
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
                                            navigate('/login');
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
                            {adminProfileData?.name} {adminProfileData?.surname}
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
