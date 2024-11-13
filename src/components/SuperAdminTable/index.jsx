import './index.scss';
import {Table} from 'antd';
import {useGetAllSuperAdminsVisitorsQuery} from "../../services/usersApi.jsx";
import {useEffect} from "react";

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Surname',
        dataIndex: 'surname',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Description',
        dataIndex: 'description',
    },
    {
        title: 'Visited Date',
        dataIndex: 'visitedDate', // Fixed the typo in data field
        render: (text) => text || "N/A",
    },
    {
        title: 'Car Number',
        dataIndex: 'carNumber',
        render: (text) => text || "N/A",
    },
    {
        title: 'Is Visited',
        dataIndex: 'isVisited',
        render: (text) => {
            if (text === -1) {
                return <button className={"scpBtn reBtn"}>Rədd edildi</button>;
            } else if (text === 0) {
                return <button className={"scpBtn"}>Gözləyir</button>;
            } else if (text === 1) {
                return <button className={"scpBtn yelBtn"}>Gəlir</button>;
            } else if (text === 2) {
                return <button className={"scpBtn"}>İçəridə</button>;
            } else if (text === 3) {
                return <button className={"scpBtn reBtn"}>Çıxdı</button>;
            }
        },
    }
];

const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
};

const SuperAdminTable = () => {
    const {data: allBuildings, refetch} = useGetAllSuperAdminsVisitorsQuery();
    const dataSource = (allBuildings?.data || []).slice().reverse(); // Reverse the data array

    useEffect(() => {
        refetch();
    }, [refetch]);

    return (
        <div id="userTableForSecurity">
            <Table
                columns={columns}
                dataSource={dataSource}
                onChange={onChange}
                showSorterTooltip={{
                    target: 'sorter-icon',
                }}
                className="userTableForSecurity"
                pagination={{pageSize: 7}}
                rowKey="id" // It's good practice to set a unique rowKey
            />
        </div>
    );
};

export default SuperAdminTable;
