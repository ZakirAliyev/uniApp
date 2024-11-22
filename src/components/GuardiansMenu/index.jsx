import './index.scss';
import {Table, Modal, Form, Input, Button} from "antd";
import {ToastContainer, toast, Bounce} from "react-toastify";
import {useGetAllSecurityQuery, usePutOneTeacherMutation} from "../../services/usersApi.jsx";
import {useEffect, useState} from "react";
import {FiEdit} from "react-icons/fi";

function TeachersMenu() {
    const {data: securities, refetch} = useGetAllSecurityQuery();
    const [putOneTeacher] = usePutOneTeacherMutation();
    const dataSource = securities?.data;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [currentRecord, setCurrentRecord] = useState(null);

    useEffect(() => {
        refetch();
    }, []);

    const showModal = () => {
        setCurrentRecord(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const openEditModal = (record) => {
        setCurrentRecord(record);
        form.setFieldsValue(record);
        console.log(currentRecord)
        setIsModalVisible(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            values.id = currentRecord.id;
            const response = await putOneTeacher(values).unwrap(); // PUT isteği
            if (response?.statusCode === 200) {
                toast.success("Teacher updated successfully!", {
                    position: "bottom-right",
                    autoClose: 2500,
                    theme: "dark",
                    transition: Bounce,
                });
                refetch(); // Veriyi yenile
                setIsModalVisible(false);
                form.resetFields();
            } else {
                toast.error("An error occurred!", {
                    position: "bottom-right",
                    autoClose: 2500,
                    theme: "dark",
                    transition: Bounce,
                });
            }
        } catch (error) {
            console.error("Validation or API error:", error);
            toast.error("Update failed.", {
                position: "bottom-right",
                autoClose: 2500,
                theme: "dark",
                transition: Bounce,
            });
        }
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'imgUrl',
            render: text => <img src={text} alt="Image" style={{
                width: '40px',
                height: '40px',
                borderRadius: '5px',
                objectFit: 'cover',
            }}/>,
        },
        {
            title: 'Firstname',
            dataIndex: 'name',
            render: text => <span
                style={{color: '#1677FF', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Lastname',
            dataIndex: 'surname',
            render: text => <span
                style={{color: '#1677FF', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Father Name',
            dataIndex: 'fatherName',
            render: text => <span
                style={{color: '#1677FF', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Position',
            dataIndex: 'position',
            render: text => <span
                style={{color: '#1677FF', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: text => <span
                style={{color: '#000000', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            render: text => <span
                style={{color: '#000000', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Create Date',
            dataIndex: 'createdDateFormatted',
        },
        {
            title: 'Last Edit Date',
            dataIndex: 'updatedDateFormatted',
            render: text => text || 'N/A',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (_, record) => (
                <FiEdit onClick={() => openEditModal(record)} style={{
                    color: '#555',
                    fontSize: '20px',
                    cursor: 'pointer',
                }}/>
            ),
        },
    ];

    return (
        <div id={"teachersMenu"}>
            <div className={"wrapper1"}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <h2>Guardians</h2>
                    <Button type="primary" onClick={showModal}>Add guardian</Button>
                </div>
            </div>
            <div className="wrapper2">
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    rowKey={record => record.id}
                    pagination={{
                        pageSize: 6
                    }}
                    style={{
                        overflowX: 'auto'
                    }}
                />
            </div>
            <Modal
                title={currentRecord ? "Edit Guardian" : "Add Guardian"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
                    <Button key="save" type="primary" onClick={handleSave}>Save</Button>,
                ]}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{required: true, message: "Please enter the name"}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="surname" label="Surname"
                               rules={[{required: true, message: "Please enter the surname"}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="fatherName" label="Father Name"
                               rules={[{required: true, message: "Please enter the father name"}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="position" label="Position"
                               rules={[{required: true, message: "Please enter the position"}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="email" label="Email"
                               rules={[{required: true, message: "Please enter a valid email", type: "email"}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="password" label="Password"
                               rules={[{required: true, message: "Please enter the password"}]}>
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item name="phoneNumber" label="Phone Number"
                               rules={[{required: true, message: "Please enter the phone number"}]}>
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
            <ToastContainer/>
        </div>
    );
}

export default TeachersMenu;
