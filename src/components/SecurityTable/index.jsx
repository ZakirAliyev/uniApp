import './index.scss'

import React from 'react';
import { Table } from 'antd';
import { useGetVisitorsDataForSecurityQuery } from "../../services/usersApi.jsx";

const SecurityTable = () => {

    const columns = [
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
            title: 'Car Number',
            dataIndex: 'carNumber',
        },
        {
            title: 'Coming Date',
            dataIndex: 'comingDate',
        },
        {
            title: 'Created Date',
            dataIndex: 'createdDate',
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Going Date',
            dataIndex: 'goingDate',
        },
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Is Visited',
            dataIndex: 'isVisited',
            render: (value) => (value ? 'Yes' : 'No'),  // Converts 1/0 to Yes/No
        },
        {
            title: 'Visited Date',
            dataIndex: 'visitedDate',
            sorter: (a, b) => new Date(a.visitedDate) - new Date(b.visitedDate),
        },
    ];

    // Fetch data from the query hook
    const { data } = useGetVisitorsDataForSecurityQuery();
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
        <Table
            columns={columns}
            dataSource={dataSource}
            onChange={onChange}
            rowKey={'id'}
        />
    );
}

export default SecurityTable;
