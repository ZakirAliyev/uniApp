import './index.scss'
import './index.scss';
import {Button, Input, Modal, Table, Form} from 'antd'; // Import Form
import {useState} from "react";
import {useDeleteFacultyMutation, useGetAllFacultiesQuery, usePutOneFacultyMutation} from "../../services/usersApi.jsx";
import {Bounce, toast, ToastContainer} from "react-toastify";
import Swal from "sweetalert2";

const FacultiesTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFaculty, setselectedFaculty] = useState(null);
    const [form] = Form.useForm();

    const {data: response, refetch} = useGetAllFacultiesQuery();
    const dataSource = response?.data;

    const [putOneFaculty] = usePutOneFacultyMutation();
    const [deleteFaculty] = useDeleteFacultyMutation();

    async function handleChange(record) {
        refetch()
    }

    const showModal = (record) => {
        setselectedFaculty(record);
        form.setFieldsValue({facultyName: record.name});
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log(values)
            console.log(selectedFaculty)
            const response = await putOneFaculty({
                id: selectedFaculty.id,
                name: values.facultyName,
                buildingId: selectedFaculty.buildingId
            }).unwrap();
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
                    const response = await deleteFaculty(id).unwrap();
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
                title: 'Faculty Name',
                dataIndex: 'name',
            },
            {
                title: 'Department Count',
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
        <div id={"facultiesTable"}>
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey={'id'}
                pagination={{
                    pageSize: 5,
                }}
            />
            <Modal title="Change Faculty Info" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical" style={{
                    margin: '30px 0'
                }}>
                    <Form.Item
                        label={
                            <span>
                                Faculty Name
                            </span>
                        }
                        name="facultyName"
                        rules={[{required: true, message: 'Faculty name is required'}]} // Required validation
                    >
                        <Input
                            className={"input"}
                            placeholder="Faculty name"
                            size={"large"}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            <ToastContainer/>
        </div>
    );
};

export default FacultiesTable;
