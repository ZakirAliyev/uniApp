import './index.scss';
import {Button, Form, Input, Modal, Switch, Table} from "antd";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {FiEdit} from "react-icons/fi";
import {
    useChangeAvailabilityBuildingMutation,
    useGetAllBuildingsQuery,
    usePostNewBuildingMutation,
    usePutOneBuildingMutation
} from "../../services/usersApi.jsx";
import {useState} from 'react';
import {PulseLoader} from "react-spinners";

function BuildingsMenu() {
    const [form] = Form.useForm();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    const showModal = (building) => {
        setSelectedBuilding(building);
        form.setFieldsValue(building);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const {data: allBuildings, refetch} = useGetAllBuildingsQuery();
    const dataSource = allBuildings?.data || [];

    const [searchTerm, setSearchTerm] = useState("");
    const [newBuildingName, setNewBuildingName] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    const filteredData = dataSource
        .filter(building => building.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            const parseDate = (dateString) => {
                const [datePart, timePart] = dateString.split(' ');
                const [day, month, year] = datePart.split('.');
                const [hours, minutes] = timePart.split(':');
                return new Date(`${year}-${month}-${day}T${hours}:${minutes}`);
            };

            if (sortOrder === "newest") {
                return parseDate(b.createdDateFormatted) - parseDate(a.createdDateFormatted);
            } else if (sortOrder === "oldest") {
                return parseDate(a.createdDateFormatted) - parseDate(b.createdDateFormatted);
            } else if (sortOrder === "a-z") {
                return a.name.localeCompare(b.name);
            } else if (sortOrder === "z-a") {
                return b.name.localeCompare(a.name);
            } else {
                return 0;
            }
        });

    const [postNewBuilding] = usePostNewBuildingMutation();
    const [updateBuilding] = usePutOneBuildingMutation();
    const [changeAvailabilityBuilding] = useChangeAvailabilityBuildingMutation();

    const [addLoading, setAddLoading] = useState(false);

    async function handleAdd() {
        if (newBuildingName !== "") {
            setAddLoading(true);
            const response = await postNewBuilding({name: newBuildingName}).unwrap();
            if (response?.statusCode === 200) {
                toast.success(response?.message, {
                    position: "bottom-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                refetch();
                form.resetFields();
                setNewBuildingName("");
            } else {
                toast.error('An error occurred', {
                    position: "bottom-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
            }
            setAddLoading(false);
        }
    }

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await updateBuilding({
                id: selectedBuilding.id,
                name: values.name,
            }).unwrap();

            if (response?.statusCode === 200) {
                toast.success(response?.message, {
                    position: "bottom-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                refetch();
                form.resetFields();
                setNewBuildingName("");
            } else {
                toast.error('An error occurred', {
                    position: "bottom-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
            }
        } catch (error) {
            toast.error('Please fill in the required fields.', {
                position: "bottom-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
        }

        setIsModalOpen(false);
        form.resetFields();
    };

    const handleToggleAvailability = async (record) => {
        const response = await changeAvailabilityBuilding({
            id: record.id,
        }).unwrap();

        if (response?.statusCode === 200) {
            toast.success(response?.message, {
                position: "bottom-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            refetch();
        } else {
            toast.error('An error occurred while changing availability.', {
                position: "bottom-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: text => (<span style={{fontWeight: 500, textDecoration: "underline"}}>{text}</span>)
        },
        {
            title: 'Building Name',
            dataIndex: 'name',
            render: text => (
                <span style={{color: '#1677FF', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>),
        },
        {
            title: 'Faculty Count',
            dataIndex: 'facultyCount',
        },
        {
            title: 'Create Date',
            dataIndex: 'createdDateFormatted',
        },
        {
            title: 'Last Edit Date',
            dataIndex: 'updatedDateFormatted',
            render: text => text ? text : 'N/A',
        },
        {
            title: 'Availability in the system',
            render: (text, record) => (
                <Switch
                    checked={!record.isDeleted}
                    onChange={() => handleToggleAvailability(record)}
                />
            )
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
                        onClick={() => {
                            if (!record.isDeleted) {
                                showModal(record);
                            }
                        }}
                    />
                </div>
            )
        },
    ];

    return (
        <div id={"buildingsMenu"}>
            <div className={"wrapper1"}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <h2>Buildings</h2>
                    <select onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="" disabled selected>Sort by</option>
                        <option value="oldest">Oldest</option>
                        <option value="newest">Newest</option>
                        <option value="a-z">A-Z</option>
                        <option value="z-a">Z-A</option>
                    </select>
                </div>
                <Form form={form}>
                    <div className={"box"}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <label style={{minWidth: '120px'}}>Search building: </label>
                            <Input
                                className={"input"}
                                size="large"
                                name="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className={"box1"}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <label style={{minWidth: '120px'}}>Add new building</label>
                                <Form.Item name="building">
                                    <Input
                                        className={"input"}
                                        size="large"
                                        value={newBuildingName}
                                        onChange={(e) => setNewBuildingName(e.target.value)}
                                        style={{
                                            marginTop: '25px'
                                        }}
                                    />
                                </Form.Item>
                                <Button style={{marginLeft: '10px'}} type={"primary"} size={"large"}
                                        htmlType={"submit"} onClick={handleAdd}>
                                    {addLoading ? (
                                        <PulseLoader size={5} color={'white'} style={{
                                            margin: '0'
                                        }}/>
                                    ) : (
                                        <span>Add</span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Form>
                <div id={"buildingsTable"}>
                    <Table
                        dataSource={filteredData}
                        columns={columns}
                        pagination={{
                            pageSize: 9,
                        }}
                        rowKey={'id'}
                    />
                    <Modal
                        title="Change Building Info"
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                    >
                        <Form layout="vertical" form={form} initialValues={selectedBuilding}>
                            <Form.Item
                                label="Building Name"
                                name="name"
                                rules={[{required: true, message: 'Please input the building name!'}]}
                                style={{marginTop: '20px'}}
                            >
                                <Input placeholder="Building name"/>
                            </Form.Item>

                            <Form.Item
                                label="Faculty Count"
                                name="facultyCount"
                            >
                                <Input placeholder="Faculty count" disabled/>
                            </Form.Item>
                        </Form>
                    </Modal>

                    <ToastContainer/>
                </div>
            </div>
        </div>
    );
}

export default BuildingsMenu;
