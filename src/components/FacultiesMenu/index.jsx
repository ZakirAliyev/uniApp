import './index.scss';
import {Button, Form, Input, Modal, Switch, Table} from "antd";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {FiEdit} from "react-icons/fi";
import {
    useChangeAvailabilityFacultyMutation,
    useGetAllBuildingsQuery,
    useGetAllFacultiesQuery,
    usePostNewFacultyMutation,
    usePutOneFacultyMutation
} from "../../services/usersApi.jsx";
import {useEffect, useState} from 'react';
import {PulseLoader} from "react-spinners";

function FacultiesMenu() {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [newFacultyName, setNewFacultyName] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [showAvailable, setShowAvailable] = useState(false);
    const [showDeleted, setShowDeleted] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [loadingFaculties, setLoadingFaculties] = useState({});
    const [selectedBuildingId, setSelectedBuildingId] = useState("");
    const [selectedBuildingForFilter, setSelectedBuildingForFilter] = useState("");

    const {data: allFaculties, refetch} = useGetAllFacultiesQuery();
    const {data: buildingsData} = useGetAllBuildingsQuery();
    const buildings = buildingsData?.data || [];
    const dataSource = allFaculties?.data || [];

    const [postNewFaculty] = usePostNewFacultyMutation();
    const [updateFaculty] = usePutOneFacultyMutation();
    const [changeAvailabilityFaculty] = useChangeAvailabilityFacultyMutation();

    useEffect(() => {
        refetch();
    }, []);

    const showModal = (faculty) => {
        setSelectedFaculty(faculty);
        form.setFieldsValue(faculty);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const filteredData = dataSource
        .filter(faculty => {
            if (selectedBuildingForFilter) {
                return String(faculty.buildingId) === selectedBuildingForFilter;
            }
            return true;
        })
        .filter(faculty => {
            if (showAvailable) return !faculty.isDeleted;
            if (showDeleted) return faculty.isDeleted;
            return true;
        })
        .filter(faculty => faculty.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
        if (newFacultyName && selectedBuildingId) {
            setAddLoading(true);
            try {
                const response = await postNewFaculty({
                    name: newFacultyName,
                    buildingId: selectedBuildingId
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
                    setNewFacultyName("");
                    setSelectedBuildingId("");
                } else {
                    throw new Error();
                }
            } catch (error) {
                toast.error('Xəta baş verdi.', {
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
            const buildingIdToUse = selectedBuildingId || selectedFaculty.buildingId;

            const response = await updateFaculty({
                id: selectedFaculty.id,
                name: values.name,
                buildingId: buildingIdToUse
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
                setNewFacultyName("");
            } else {
                throw new Error();
            }
        } catch (error) {
            toast.error('Zəhmət olmasa xanaları doldurun.', {
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
        setLoadingFaculties(prev => ({...prev, [record.id]: true}));
        try {
            const response = await changeAvailabilityFaculty({id: record.id}).unwrap();
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
        } catch (error) {
            toast.error('Mövcudluğu dəyişdirərkən xəta baş verdi.', {
                position: "bottom-right",
                autoClose: 2500,
                theme: "dark",
                transition: Bounce,
            });
        } finally {
            setLoadingFaculties(prev => ({...prev, [record.id]: false}));
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: text => <span style={{fontWeight: 500, textDecoration: "underline"}}>{text}</span>,
        },
        {
            title: 'Fakültə və ya şöbə adı',
            dataIndex: 'name',
            render: text => <span
                style={{color: '#1677FF', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Bina ID',
            dataIndex: 'buildingId',
            render: text => <span style={{fontWeight: 500, textDecoration: "underline"}}>{text}</span>,
        },
        {
            title: 'Bina adı',
            dataIndex: 'buildingName',
            render: text => <span
                style={{color: '#109eb1', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Kafedra sayı',
            dataIndex: 'departmentCount',
        },
        {
            title: 'Yaradılma tarixi',
            dataIndex: 'createdDateFormatted',
        },
        {
            title: 'Son redaktə tarixi',
            dataIndex: 'updatedDateFormatted',
            render: text => text || 'N/A',
        },
        {
            title: 'Sistemdə mövcudluğu',
            render: (text, record) => (
                loadingFaculties[record.id] ? (
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
                    <h2>Fakültə və ya şöbələr</h2>
                    <div style={{display: 'flex', gap: '10px'}}>
                        {/* Filter by Building */}
                        <select
                            onChange={(e) => {
                                setSelectedBuildingForFilter(e.target.value);
                            }}
                            value={selectedBuildingForFilter}
                        >
                            <option value="">Bütün binalar</option>
                            {/* Optional: To show all faculties */}
                            {buildings.map((building) => (
                                <option key={building.id} value={String(building.id)}>
                                    {building.name}
                                </option>
                            ))}
                        </select>

                        {/* Sort By */}
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
                            <option value="newest">Ən təzə</option>
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
                                placeholder={"Fakültə və ya şöbə axtar"}
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
                                    value={newFacultyName}
                                    placeholder="Yeni fakültə və şöbə əlavə et"
                                    onChange={(e) => setNewFacultyName(e.target.value)}
                                />
                            </div>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                                justifyContent: 'flex-start'
                            }}>
                                <select
                                    value={selectedBuildingId}
                                    onChange={(e) => setSelectedBuildingId(e.target.value)}
                                >
                                    <option value="" disabled>Bina seç</option>
                                    {buildings.map((building) => (
                                        <option key={building.id} value={String(building.id)}>
                                            {building.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Button
                                type={"primary"}
                                loading={addLoading}
                                disabled={!newFacultyName || !selectedBuildingId}
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
                title="Fakültə və ya şöbəni redaktə et"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form}>
                    <Form.Item
                        label="Fakültə və ya şöbə adı"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Zəhmət olmasa fakültə adını daxil edin!',
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

export default FacultiesMenu;
