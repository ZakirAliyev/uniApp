import './index.scss';

import {Input, Table} from 'antd';
import {useState} from 'react';
import {useGetVisitorsDataForSecurityQuery, usePutChangeIsVisitedMutation} from "../../services/usersApi.jsx";
import {Bounce, toast, ToastContainer} from "react-toastify";
import Swal from 'sweetalert2'; // Missing import for Swal

const SecurityTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('');

    const [putChangeIsVisited] = usePutChangeIsVisitedMutation();
    const {data, refetch} = useGetVisitorsDataForSecurityQuery();

    const handleActionClick = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            const response = await putChangeIsVisited({id}).unwrap();
            if (result.isConfirmed) {
                if (response?.statusCode === 200) {
                    toast.success(response?.message, {
                        position: "bottom-right",
                        autoClose: 2500,
                        theme: "dark",
                        transition: Bounce,
                    });
                }
                refetch();
            }
        });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'count',
            render: (text, record, index) => index + 1,
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
            title: 'FIN Code',
            dataIndex: 'finCode',
        },
        {
            title: 'Car Number',
            dataIndex: 'carNumber',
        },
        {
            title: 'Visited Date',
            dataIndex: 'visitedDate',
        },
        {
            title: 'Coming Date',
            dataIndex: 'commingDate',
        },
        {
            title: 'Exit Date',
            dataIndex: 'goIngDate',
        },
        {
            title: 'Actions',
            dataIndex: 'isVisited',
            render: (text, record) => (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '17px'}}
                     className={"isVisited"}>
                    {record.isVisited === 1 ? (
                        <button onClick={() => handleActionClick(record.id)}>Gəlir</button>
                    ) : record.isVisited === 2 ? (
                        <button className="yel" onClick={() => handleActionClick(record.id)}>İçəridə</button>
                    ) : record.isVisited === 3 ? (
                        <button className="re">Getdi</button>
                    ) : null}
                </div>
            ),
        },
    ];

    const dataSource = data?.data?.map((item) => ({
        adminId: item.adminId,
        carNumber: item.carNumber || 'N/A',
        commingDate: item.commingDate || 'N/A',
        createdDate: item.createdDate,
        description: item.description || 'N/A',
        email: item.email || 'N/A',
        goIngDate: item.goIngDate || 'N/A',
        id: item.id,
        isVisited: item.isVisited,
        name: item.name,
        surname: item.surname,
        visitedDate: item.visitedDate,
        finCode: item.finCode,
    })) || [];

    const filteredDataSource = dataSource.filter((item) => {
        const matchesSearchTerm =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilterBy =
            filterBy === 'With car' ? item.carNumber !== 'N/A' :
                filterBy === 'Without car' ? item.carNumber === 'N/A' :
                    true;

        return matchesSearchTerm && matchesFilterBy;
    });

    const onSearchChange = (e) => setSearchTerm(e.target.value);
    const onFilterChange = (e) => setFilterBy(e.target.value);

    return (
        <section id="securityTable">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 16px',
            }}>
                <Input
                    size="large"
                    placeholder="Search visitor"
                    style={{maxWidth: '300px', width: '100%'}}
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
                rowKey="id"
            />
            <ToastContainer/>
        </section>
    );
}

export default SecurityTable;
