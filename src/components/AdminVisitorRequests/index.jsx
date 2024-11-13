import './index.scss';

import {Input, Table} from 'antd';
import {useState} from 'react';
import {
    useGetAllVisitorRequestsQuery,
    usePostVisitorAcceptMutation,
    usePostVisitorRejectMutation,
    usePutChangeIsVisitedMutation
} from "../../services/usersApi.jsx";
import {Bounce, toast, ToastContainer} from "react-toastify";
import Swal from 'sweetalert2';
import {ImCross} from "react-icons/im";
import {FaCheck} from "react-icons/fa";
import {PulseLoader} from "react-spinners";

const AdminVisitorRequests = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('');
    const [loading, setLoading] = useState({});

    const [putChangeIsVisited] = usePutChangeIsVisitedMutation();
    const {data, refetch} = useGetAllVisitorRequestsQuery();

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

    const [postVisitorAccept] = usePostVisitorAcceptMutation();
    const [postVisitorReject] = usePostVisitorRejectMutation();

    const setLoadingState = (id, type, isLoading) => {
        setLoading((prev) => ({
            ...prev,
            [id]: {
                ...(prev[id] || {}),
                [type]: isLoading
            }
        }));
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
            title: 'Car Number',
            dataIndex: 'carNumber',
        },
        {
            title: 'E-mail',
            dataIndex: 'email',
        },
        {
            title: 'Visited Date',
            dataIndex: 'visitedDate',
        },
        {
            title: 'Actions',
            dataIndex: 'isVisited',
            render: (text, record) => (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}
                     className={"isVisited"}>
                    <button
                        style={{display: "flex", justifyContent: "center", alignItems: "center"}}
                        onClick={async () => {
                            setLoadingState(record.id, 'accept', true);
                            try {
                                const response = await postVisitorAccept(record.id).unwrap();
                                toast.success(response?.message || "Visitor accepted successfully", {
                                    position: "bottom-right",
                                    autoClose: 2500,
                                    theme: "dark",
                                    transition: Bounce,
                                });
                                refetch();
                            } catch (error) {
                                toast.error("Failed to accept visitor", {
                                    position: "bottom-right",
                                    autoClose: 2500,
                                    theme: "dark",
                                    transition: Bounce,
                                });
                            } finally {
                                setLoadingState(record.id, 'accept', false);
                            }
                        }}
                    >
                        {loading[record.id]?.accept ? <PulseLoader color="white" size={8}/> :
                            <FaCheck className={"icon"}/>}
                    </button>

                    <button
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: '#ff3333'
                        }}
                        onClick={async () => {
                            setLoadingState(record.id, 'reject', true);
                            try {
                                const response = await postVisitorReject(record.id).unwrap();
                                toast.success(response?.message || "Visitor rejected successfully", {
                                    position: "bottom-right",
                                    autoClose: 2500,
                                    theme: "dark",
                                    transition: Bounce,
                                });
                                refetch();
                            } catch (error) {
                                toast.error("Failed to reject visitor", {
                                    position: "bottom-right",
                                    autoClose: 2500,
                                    theme: "dark",
                                    transition: Bounce,
                                });
                            } finally {
                                setLoadingState(record.id, 'reject', false);
                            }
                        }}
                    >
                        {loading[record.id]?.reject ? <PulseLoader color="#ff3333" size={8}/> :
                            <ImCross className={"icon"}/>}
                    </button>
                </div>
            ),
        },
    ];

    const dataSource = data?.data?.map((item) => ({
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

    const filteredDataSource = dataSource.filter((item) => {
        const matchesSearchTerm =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilterBy =
            filterBy === 'With car' ? item.carNumber !== 'N/A' :
                filterBy === 'Without car' ? item.carNumber === 'N/A' :
                    true;

        const isVisitedMatch = item.isVisited === 0;

        return matchesSearchTerm && matchesFilterBy && isVisitedMatch;
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
                pagination={{
                    pageSize: 7
                }}
            />
            <ToastContainer/>
        </section>
    );
}

export default AdminVisitorRequests;
