import {Table} from 'antd';
import './index.scss'

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Ad',
        dataIndex: 'name',
    },
    {
        title: 'Soyad',
        dataIndex: 'surname',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Açıqlama',
        dataIndex: 'description',
    },
    {
        title: 'Date of arrial',
        dataIndex: 'goingDate',
    },
    {
        title: 'Exit date',
        dataIndex: 'commingDate',
    },
    {
        title: 'Is Visited',
        dataIndex: 'isVisited',
        render: (text, record) => (
            <button className={"tableBtn"}>Accepted</button>
        )
    },
    {
        title: 'Car number',
        dataIndex: 'carNumber',
    },
    {
        title: 'Admin',
        dataIndex: 'admin',
    },
];
const data = [
    {
        key: '1',
        id: '1',
        name: 'Zakir',
        surname: 'Aliyev',
        email: 'aliyevzakir814@gmail.com',
        description: 'Meqale getirir',
        commingDate: '24-03-2019',
        goingDate: '24-03-2019',
        isVisited: true,
        carNumber: '77-TT-777',
        admin: 'Elvin Jafarguliyev'
    },
    {
        key: '2',
        id: '2',
        name: 'Zakir',
        surname: 'Aliyev',
        email: 'aliyevzakir814@gmail.com',
        description: 'Meqale getirir',
        commingDate: '24-03-2019',
        goingDate: '24-03-2019',
        isVisited: true,
        carNumber: '77-TT-777',
        admin: 'Elvin Jafarguliyev'
    },
    {
        key: '3',
        id: '3',
        name: 'Zakir',
        surname: 'Aliyev',
        email: 'aliyevzakir814@gmail.com',
        description: 'Meqale getirir',
        commingDate: '24-03-2019',
        goingDate: '24-03-2019',
        isVisited: true,
        carNumber: '77-TT-777',
        admin: 'Elvin Jafarguliyev'
    },
    {
        key: '4',
        id: '4',
        name: 'Zakir',
        surname: 'Aliyev',
        email: 'aliyevzakir814@gmail.com',
        description: 'Meqale getirir',
        commingDate: '24-03-2019',
        goingDate: '24-03-2019',
        isVisited: true,
        carNumber: '77-TT-777',
        admin: 'Elvin Jafarguliyev'
    },
    {
        key: '5',
        id: '5',
        name: 'Zakir',
        surname: 'Aliyev',
        email: 'aliyevzakir814@gmail.com',
        description: 'Meqale getirir',
        commingDate: '24-03-2019',
        goingDate: '24-03-2019',
        isVisited: true,
        carNumber: '77-TT-777',
        admin: 'Elvin Jafarguliyev'
    },
    {
        key: '6',
        id: '6',
        name: 'Zakir',
        surname: 'Aliyev',
        email: 'aliyevzakir814@gmail.com',
        description: 'Meqale getirir',
        commingDate: '24-03-2019',
        goingDate: '24-03-2019',
        isVisited: true,
        carNumber: '77-TT-777',
        admin: 'Elvin Jafarguliyev'
    },
    {
        key: '7',
        id: '7',
        name: 'Zakir',
        surname: 'Aliyev',
        email: 'aliyevzakir814@gmail.com',
        description: 'Meqale getirir',
        commingDate: '24-03-2019',
        goingDate: '24-03-2019',
        isVisited: true,
        carNumber: '77-TT-777',
        admin: 'Elvin Jafarguliyev'
    },
    {
        key: '8',
        id: '8',
        name: 'Zakir',
        surname: 'Aliyev',
        email: 'aliyevzakir814@gmail.com',
        description: 'Meqale getirir',
        commingDate: '24-03-2019',
        goingDate: '24-03-2019',
        isVisited: true,
        carNumber: '77-TT-777',
        admin: 'Elvin Jafarguliyev'
    },
    {
        key: '9',
        id: '9',
        name: 'Zakir',
        surname: 'Aliyev',
        email: 'aliyevzakir814@gmail.com',
        description: 'Meqale getirir',
        commingDate: '24-03-2019',
        goingDate: '24-03-2019',
        isVisited: true,
        carNumber: '77-TT-777',
        admin: 'Elvin Jafarguliyev'
    },
    {
        key: '10',
        id: '10',
        name: 'Zakir',
        surname: 'Aliyev',
        email: 'aliyevzakir814@gmail.com',
        description: 'Meqale getirir',
        commingDate: '24-03-2019',
        goingDate: '24-03-2019',
        isVisited: true,
        carNumber: '77-TT-777',
        admin: 'Elvin Jafarguliyev'
    },
    {
        key: '11',
        id: '11',
        name: 'Zakir',
        surname: 'Aliyev',
        email: 'aliyevzakir814@gmail.com',
        description: 'Meqale getirir',
        commingDate: '24-03-2019',
        goingDate: '24-03-2019',
        isVisited: true,
        carNumber: '77-TT-777',
        admin: 'Elvin Jafarguliyev'
    },
    {
        key: '12',
        id: '12',
        name: 'Zakir',
        surname: 'Aliyev',
        email: 'aliyevzakir814@gmail.com',
        description: 'Meqale getirir',
        commingDate: '24-03-2019',
        goingDate: '24-03-2019',
        isVisited: true,
        carNumber: '77-TT-777',
        admin: 'Elvin Jafarguliyev'
    },
    {
        key: '13',
        id: '13',
        name: 'Zakir',
        surname: 'Aliyev',
        email: 'aliyevzakir814@gmail.com',
        description: 'Meqale getirir',
        commingDate: '24-03-2019',
        goingDate: '24-03-2019',
        isVisited: true,
        carNumber: '77-TT-777',
        admin: 'Elvin Jafarguliyev'
    },
    {
        key: '14',
        id: '14',
        name: 'Zakir',
        surname: 'Aliyev',
        email: 'aliyevzakir814@gmail.com',
        description: 'Meqale getirir',
        commingDate: '24-03-2019',
        goingDate: '24-03-2019',
        isVisited: true,
        carNumber: '77-TT-777',
        admin: 'Elvin Jafarguliyev'
    },
    {
        key: '15',
        id: '15',
        name: 'Zakir',
        surname: 'Aliyev',
        email: 'aliyevzakir814@gmail.com',
        description: 'Meqale getirir',
        commingDate: '24-03-2019',
        goingDate: '24-03-2019',
        isVisited: true,
        carNumber: '77-TT-777',
        admin: 'Elvin Jafarguliyev'
    },
];
const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
};
const UserTable = () => (
    <div id={"userTableForSecurity"}>
        <Table
            columns={columns}
            dataSource={data}
            onChange={onChange}
            showSorterTooltip={{
                target: 'sorter-icon',
            }}
            className={"userTableForSecurity"}
            pagination={{ pageSize: 7 }}
        />
    </div>
);
export default UserTable;