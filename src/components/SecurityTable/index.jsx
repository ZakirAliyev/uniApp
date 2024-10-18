import './index.scss';

import {Input, Table} from 'antd';
import {useState} from 'react';
import {useGetVisitorsDataForSecurityQuery} from "../../services/usersApi.jsx";

const SecurityTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState(''); // Filtreleme için state

    const columns = [
        {
            title: 'ID',
            dataIndex: 'count',
            render: (text, record, index) => index + 1
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
            title: 'Visited Date',
            dataIndex: 'visitedDate',
        },
        {
            title: 'Actions',
            dataIndex: 'isVisited',
            render: (text, record) => (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '17px'}}>
                    <button>
                        {record.isVisited === 1 ? (
                            <>1</>
                        ) : record.isVisited === 2 ? (
                            <>2</>
                        ) : record.isVisited === 3 ? (
                            <>3</>
                        ) : (
                            <>else</>
                        )}
                    </button>
                </div>
            )
        }
    ];

    const {data} = useGetVisitorsDataForSecurityQuery();
    const dataSource = data?.data?.map(item => ({
        adminId: item.adminId,
        carNumber: item.carNumber || 'N/A',
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
    })) || [];

    // Arama ve filtreleme kriterlerine göre verileri filtreleme
    const filteredDataSource = dataSource.filter(item => {
        const matchesSearchTerm =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilterBy =
            filterBy === 'With car' ? item.carNumber !== 'N/A' :
                filterBy === 'Without car' ? item.carNumber === 'N/A' :
                    true; // Hiçbir filtre yoksa hepsini göster

        return matchesSearchTerm && matchesFilterBy;
    });

    const onSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const onFilterChange = (e) => {
        setFilterBy(e.target.value);
    };

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
                <Input
                    size={"large"}
                    placeholder={"Search visitor"}
                    style={{
                        maxWidth: '300px',
                        width: '100%',
                    }}
                    value={searchTerm}
                    onChange={onSearchChange}
                />
                <select onChange={onFilterChange} value={filterBy}>
                    <option value="">All visitors</option>
                    <option value="With car">With car</option>
                    <option value="Without car">Without car</option>
                </select>
            </div>
            <Table
                columns={columns}
                dataSource={filteredDataSource}
                onChange={onChange}
                rowKey={'id'}
            />
        </section>
    );
}

export default SecurityTable;
