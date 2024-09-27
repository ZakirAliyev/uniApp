import './index.scss';
import {Button, Input, Modal, Table, Form} from 'antd'; // Import Form
import {useState} from "react";
import {
    useDeleteBuildingMutation,
    useGetAllBuildingsQuery,
    usePutOneBuildingMutation
} from "../../services/usersApi.jsx";
import {Bounce, toast, ToastContainer} from "react-toastify";
import Swal from "sweetalert2";

const BuildingsTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [form] = Form.useForm(); // Initialize the form

    const {data: response, refetch} = useGetAllBuildingsQuery();
    const dataSource = response?.data;

    const [putOneBuilding] = usePutOneBuildingMutation();
    const [deleteBuilding] = useDeleteBuildingMutation();

    async function handleChange(record) {
        refetch()
    }

    const showModal = (record) => {
        setSelectedBuilding(record);
        form.setFieldsValue({buildingName: record.name}); // Set the form field value
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields(); // Validate form fields
            const response = await putOneBuilding({id: selectedBuilding.id, name: values.buildingName}).unwrap();
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
            setIsModalOpen(false);
            refetch();
        } catch (error) {
            toast.error(error.message || "An error occurred", {
                position: "top-right",
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

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await deleteBuilding(id).unwrap();
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
                } catch (error) {
                    toast.error(error.message || "An error occurred", {
                        position: "top-right",
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
            }
        });
    };

    const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
            },
            {
                title: 'Building Name',
                dataIndex: 'name',
            },
            {
                title: 'Faculty Count',
                dataIndex: 'facultyCount',
            },
            {
                title: 'Availability in the system',
                render: (text, record) => {
                    if (record.isDeleted === false) {
                        return <div style={{
                            color: 'green',
                            fontWeight: 'bolder',
                            fontSize: '18px'
                        }}>AVAILABLE</div>;
                    } else {
                        return <div style={{
                            color: 'red',
                            fontWeight: 'bolder',
                            fontSize: '18px'
                        }}>DELETED</div>;
                    }
                }
            },
            {
                title: 'Actions',
                render: (text, record) => (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}>
                        {record && record?.isDeleted === true ? (
                            <Button size={"large"} className={"buttonActionsForBuildingsTable"} type="primary"
                                    style={{
                                        backgroundColor: '#49AF41',
                                    }} onClick={() => handleChange(record)}>
                                Change availability
                            </Button>
                        ) : (
                            < Button size={"large"} className={"buttonActionsForBuildingsTable"} type="primary"
                                     onClick={() => showModal(record)}>Edit</Button>
                        )}
                        {record && record?.isDeleted === false ? (
                            <Button size={"large"}
                                    className={"buttonActionsForBuildingsTable buttonActionsForBuildingsTableDelete"}
                                    type="danger" onClick={() => handleDelete(record.id)} style={{
                                width: '105px'
                            }}>Delete</Button>
                        ) : (<></>)}
                    </div>
                )
            },
        ]
    ;

    return (
        <div id={"buildingsTable"}>
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey={'id'}
                pagination={{
                    pageSize: 5,
                }}
            />
            <Modal title="Change Building Info" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical" style={{
                    margin: '30px 0'
                }}>
                    <Form.Item
                        label={
                            <span>
                                Building Name
                            </span>
                        }
                        name="buildingName" // Name of the field
                        rules={[{required: true, message: 'Building name is required'}]} // Required validation
                    >
                        <Input
                            className={"input"}
                            placeholder="Building name"
                            size={"large"}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            <ToastContainer/>
        </div>
    );
};

export default BuildingsTable;
