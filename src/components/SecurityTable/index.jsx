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
            title: "Əminsiniz?",
            text: "Bunu geri qaytara bilməyəcəksiniz!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Bəli",
            cancelButtonText: "Xeyr",
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
            title: 'Ad',
            dataIndex: 'name',
        },
        {
            title: 'Soyad',
            dataIndex: 'surname',
        },
        {
            title: 'Açıqlama',
            dataIndex: 'description',
        },
        {
            title: 'FIN Kod',
            dataIndex: 'finCode',
        },
        {
            title: 'Avtomobil nömrəsi',
            dataIndex: 'carNumber',
        },
        {
            title: 'Ziyarət tarixi',
            dataIndex: 'visitedDate',
        },
        {
            title: 'Gəliş tarixi',
            dataIndex: 'commingDate',
        },
        {
            title: 'Çıxış tarixi',
            dataIndex: 'goIngDate',
        },
        {
            title: 'Əməliyyatlar',
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
            filterBy === 'Avtomobil ilə' ? item.carNumber !== 'N/A' :
                filterBy === 'Avtomobilsiz' ? item.carNumber === 'N/A' :
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
                    placeholder="Ziyarətçi axtar"
                    style={{maxWidth: '300px', width: '100%'}}
                    value={searchTerm}
                    onChange={onSearchChange}
                />
                <select onChange={onFilterChange} value={filterBy}>
                    <option value="">Bütün ziyarətçilər</option>
                    <option value="With car">Avtomobil ilə</option>
                    <option value="Without car">Avtomobilsiz</option>
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
