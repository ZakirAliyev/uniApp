import './index.scss';
import {Table} from "antd";
import {ToastContainer} from "react-toastify";
import {useGetAllSecurityQuery} from "../../services/usersApi.jsx";
import {useEffect} from "react";

function TeachersMenu() {

    const {data: securities, refetch} = useGetAllSecurityQuery()
    const dataSource = securities?.data

    useEffect(() => {
        refetch();
    }, []);

    const columns = [
        {
            title: 'Image',
            dataIndex: 'imgUrl',
            render: text => <img src={text} alt="Image" style={{
                width: '40px',
                height: '40px',
                borderRadius: '5px',
                objectFit: 'cover',
            }}/>,
        },
        {
            title: 'Firstname',
            dataIndex: 'name',
            render: text => <span
                style={{color: '#1677FF', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Lastname',
            dataIndex: 'surname',
            render: text => <span
                style={{color: '#1677FF', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Father Name',
            dataIndex: 'fatherName',
            render: text => <span
                style={{color: '#1677FF', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Room Number',
            dataIndex: 'roomNumber',
            render: text => <span
                style={{color: '#ff1616', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text || 'N/A'}</span>,
        },
        {
            title: 'Faculty Name',
            dataIndex: 'facultyName',
            render: text => <span
                style={{color: '#13a608', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Department Name',
            dataIndex: 'departmentName',
            render: text => <span
                style={{color: '#13a608', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Position',
            dataIndex: 'position',
            render: text => <span
                style={{color: '#13a608', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: text => <span
                style={{color: '#000000', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            render: text => <span
                style={{color: '#000000', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Create Date',
            dataIndex: 'createdDateFormatted',
        },
        {
            title: 'Last Edit Date',
            dataIndex: 'updatedDateFormatted',
            render: text => text || 'N/A',
        },
    ];

    return (
        <div id={"buildingsMenu"}>
            <div className={"wrapper1"}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <h2>Guardians</h2>
                </div>
            </div>
            <div className="wrapper2">
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    rowKey={record => record.id}
                    pagination={{
                        pageSize: 6
                    }}
                    style={{
                        overflowX: 'auto'
                    }}
                />
            </div>
            <ToastContainer/>
        </div>
    );
}

export default TeachersMenu;
