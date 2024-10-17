import './index.scss'

import {Input, Table} from 'antd';
import {useGetVisitorsDataForSecurityQuery} from "../../services/usersApi.jsx";
import {FiEdit} from "react-icons/fi";

const SecurityTable = () => {

    const columns = [
        {
            title: 'ID',
            dataIndex: 'count',
            render: (text, record, index) => index + 1
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ['descend'],
        },
        {
            title: 'Surname',
            dataIndex: 'surname',
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Car Number',
            dataIndex: 'carNumber',
        },
        {
            title: 'Coming Date',
            dataIndex: 'comingDate',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Visited Date',
            dataIndex: 'visitedDate',
            sorter: (a, b) => new Date(a.visitedDate) - new Date(b.visitedDate),
        },
        {
            title: 'Actions',
            render: (text, record) => (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '17px'}}>
                    <FiEdit
                        className={"buildingEditIcons"}
                        style={{
                            fontSize: '20px',
                            color: 'gray',
                            cursor: record.isDeleted ? 'not-allowed' : 'pointer'
                        }}
                    />
                </div>
            )
        }
    ];

    const {data} = useGetVisitorsDataForSecurityQuery();
    const dataSource = data?.data?.map(item => ({
        adminId: item.adminId,
        carNumber: item.carNumber || 'N/A',  // Defaulting to 'N/A' if empty
        comingDate: item.comingDate || 'N/A',
        createdDate: item.createdDate,
        description: item.description || 'N/A',
        email: item.email || 'N/A',
        goingDate: item.goingDate || 'N/A',
        id: item.id,
        isVisited: item.isVisited,
        name: item.name,
        surname: item.surname,
        visitedDate: item.visitedDate,
    }));

    console.log(dataSource);

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <section id={"securityTable"}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 16px'
            }}>
                <Input size={"large"} placeHolder={"Search visitor"} style={{
                    maxWidth: '300px',
                    width: '100%',
                }}/>
                <select>
                    <option>asdasd</option>
                    <option>asdasd</option>
                    <option>asdasd</option>
                </select>
            </div>
            <Table
                columns={columns}
                dataSource={dataSource}
                onChange={onChange}
                rowKey={'id'}
            />
        </section>
    );
}

export default SecurityTable;
