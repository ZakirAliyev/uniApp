import './index.scss';
import {Button, Form, Input, Modal, Switch, Table} from "antd";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {FiEdit} from "react-icons/fi";
import {
    useChangeAvailabilityDepartmentMutation,
    useGetAllDepartmentsQuery,
    useGetAllFacultiesQuery,
    usePostNewDepartmentMutation,
    usePutOneDepartmentMutation
} from "../../services/usersApi.jsx";
import {useEffect, useState} from 'react';
import {PulseLoader} from "react-spinners";

function DepartmentsMenu() {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [newDepartmentName, setNewDepartmentName] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [showAvailable, setShowAvailable] = useState(false);
    const [showDeleted, setShowDeleted] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [loadingDepartments, setLoadingDepartments] = useState({});
    const [selectedFacultyId, setSelectedFacultyId] = useState("");
    const [selectedFacultyForFilter, setSelectedFacultyForFilter] = useState("");

    const {data: allDepartments, refetch} = useGetAllDepartmentsQuery();
    const {data: facultiesData} = useGetAllFacultiesQuery();
    const faculties = facultiesData?.data || [];
    const dataSource = allDepartments?.data || [];

    const [postNewDepartment] = usePostNewDepartmentMutation();
    const [updateDepartment] = usePutOneDepartmentMutation();
    const [changeAvailabilityDepartment] = useChangeAvailabilityDepartmentMutation();

    useEffect(() => {
        refetch();
    }, []);

    const showModal = (department) => {
        setSelectedDepartment(department);
        form.setFieldsValue(department);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const filteredData = dataSource
        .filter(department => {
            if (selectedFacultyForFilter) {
                return String(department.facultyId) === selectedFacultyForFilter;
            }
            return true;
        })
        .filter(department => {
            if (showAvailable) return !department.isDeleted;
            if (showDeleted) return department.isDeleted;
            return true;
        })
        .filter(department => department.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            const parseDate = (dateString) => {
                const [datePart, timePart] = dateString.split(' ');
                const [day, month, year] = datePart.split('.');
                const [hours, minutes] = timePart.split(':');
                return new Date(`${year}-${month}-${day}T${hours}:${minutes}`);
            };

            switch (sortOrder) {
                case "newest":
                    return parseDate(b.createdDateFormatted) - parseDate(a.createdDateFormatted);
                case "oldest":
                    return parseDate(a.createdDateFormatted) - parseDate(b.createdDateFormatted);
                case "a-z":
                    return a.name.localeCompare(b.name);
                case "z-a":
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });

    const handleAdd = async () => {
        if (newDepartmentName && selectedFacultyId) {
            setAddLoading(true);
            try {
                const response = await postNewDepartment({
                    name: newDepartmentName,
                    facultyId: selectedFacultyId
                }).unwrap();

                if (response?.statusCode === 200) {
                    toast.success(response?.message, {
                        position: "bottom-right",
                        autoClose: 2500,
                        theme: "dark",
                        transition: Bounce,
                    });
                    refetch();
                    form.resetFields();
                    setNewDepartmentName("");
                    setSelectedFacultyId("");
                } else {
                    throw new Error();
                }
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                toast.error('Xəta baş verdi!', {
                    position: "bottom-right",
                    autoClose: 2500,
                    theme: "dark",
                    transition: Bounce,
                });
            } finally {
                setAddLoading(false);
            }
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const facultyIdToUse = selectedFacultyId || selectedDepartment.facultyId;

            const response = await updateDepartment({
                id: selectedDepartment.id,
                name: values.name,
                facultyId: facultyIdToUse
            }).unwrap();

            if (response?.statusCode === 200) {
                toast.success(response?.message, {
                    position: "bottom-right",
                    autoClose: 2500,
                    theme: "dark",
                    transition: Bounce,
                });
                refetch();
                form.resetFields();
                setNewDepartmentName("");
            } else {
                throw new Error();
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error('Zəhmət olmasa xanaları doldurun!', {
                position: "bottom-right",
                autoClose: 2500,
                theme: "dark",
                transition: Bounce,
            });
        } finally {
            setIsModalOpen(false);
            form.resetFields();
        }
    };

    const handleToggleAvailability = async (record) => {
        setLoadingDepartments(prev => ({...prev, [record.id]: true}));
        try {
            const response = await changeAvailabilityDepartment({id: record.id}).unwrap();
            if (response?.statusCode === 200) {
                toast.success(response?.message, {
                    position: "bottom-right",
                    autoClose: 2500,
                    theme: "dark",
                    transition: Bounce,
                });
                refetch();
            } else {
                throw new Error();
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error('Mövcudluğu dəyişərkən xəta baş verdi!', {
                position: "bottom-right",
                autoClose: 2500,
                theme: "dark",
                transition: Bounce,
            });
        } finally {
            setLoadingDepartments(prev => ({...prev, [record.id]: false}));
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: text => <span style={{fontWeight: 500, textDecoration: "underline"}}>{text}</span>,
        },
        {
            title: 'Kafedra adı',
            dataIndex: 'name',
            render: text => <span
                style={{color: '#1677FF', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Fakültə və ya şöbə ID',
            dataIndex: 'facultyId',
            render: text => <span style={{fontWeight: 500, textDecoration: "underline"}}>{text}</span>,
        },
        {
            title: 'Fakültə və ya şöbə adı',
            dataIndex: 'facultyName',
            render: text => <span
                style={{color: '#109eb1', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Admin sayı',
            dataIndex: 'adminCount',
        },
        {
            title: 'Yaradılma tarixi',
            dataIndex: 'createdDateFormatted',
        },
        {
            title: 'Son dəyişdirilmə tarixi',
            dataIndex: 'updatedDateFormatted',
            render: text => text || 'N/A',
        },
        {
            title: 'Sistemdə mövcudluğu',
            render: (text, record) => (
                loadingDepartments[record.id] ? (
                    <span><PulseLoader size={8}/></span>
                ) : (
                    <Switch
                        checked={!record.isDeleted}
                        onChange={() => handleToggleAvailability(record)}
                    />
                )
            ),
        },
        {
            title: 'Əməliyyatlar',
            render: (text, record) => (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '17px'}}>
                    <FiEdit
                        className={"facultyEditIcons"}
                        style={{fontSize: '20px', color: 'gray', cursor: record.isDeleted ? 'not-allowed' : 'pointer'}}
                        onClick={() => !record.isDeleted && showModal(record)}
                    />
                </div>
            ),
        },
    ];

    return (
        <div id={"buildingsMenu"}>
            <div className={"wrapper1"}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <h2>Kafedralar</h2>
                    <div style={{display: 'flex', gap: '10px'}}>
                        <select
                            onChange={(e) => {
                                setSelectedFacultyForFilter(e.target.value);
                            }}
                            value={selectedFacultyForFilter}
                        >
                            <option value="">Bütün fakültə və ya şöbələr</option>
                            {faculties.map((faculty) => (
                                <option key={faculty.id} value={String(faculty.id)}>
                                    {faculty.name}
                                </option>
                            ))}
                        </select>

                        <select
                            onChange={(e) => {
                                const value = e.target.value;
                                setSortOrder(value);
                                setShowAvailable(value === "available");
                                setShowDeleted(value === "deleted");
                            }}
                            value={sortOrder}
                        >
                            <option value="" disabled>Sırala</option>
                            <option value="oldest">Ən köhnə</option>
                            <option value="newest">Ən yeni</option>
                            <option value="a-z">A-Z</option>
                            <option value="z-a">Z-A</option>
                            <option value="available">Mövcuddur</option>
                            <option value="deleted">Silinmiş</option>
                        </select>
                    </div>
                </div>
                <Form form={form}>
                    <div className={"box"} style={{margin: '20px 0'}}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Input
                                className={"input"}
                                size="large"
                                name="search"
                                value={searchTerm}
                                placeholder={"Kafedra axtar"}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className={"box1"}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                                justifyContent: 'flex-start'
                            }}>
                                <Input
                                    size={"large"}
                                    className={"input"}
                                    value={newDepartmentName}
                                    placeholder="Yeni kafedra əlavə et"
                                    onChange={(e) => setNewDepartmentName(e.target.value)}
                                />
                            </div>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                                justifyContent: 'flex-start'
                            }}>
                                <select
                                    value={selectedFacultyId}
                                    onChange={(e) => setSelectedFacultyId(e.target.value)}
                                >
                                    <option value="" disabled>Fakültə və ya şöbə seç</option>
                                    {faculties.map((faculty) => (
                                        <option key={faculty.id} value={String(faculty.id)}>
                                            {faculty.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Button
                                type={"primary"}
                                loading={addLoading}
                                disabled={!newDepartmentName || !selectedFacultyId}
                                onClick={handleAdd}
                                className={"addFacultyButton"}
                                size={"large"}
                            >
                                Əlavə et
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
            <div className="wrapper2">
                <Table
                    dataSource={filteredData}
                    columns={columns}
                    rowKey={record => record.id}
                    pagination={{
                        pageSize: 6
                    }}
                />
            </div>
            <ToastContainer/>
            <Modal
                title="Kafedranı redaktə et"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form}>
                    <Form.Item
                        label="Kafedra adı"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Zəhmət olmasa kafedra adını daxil edin!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default DepartmentsMenu;
