import './index.scss';
import { Table, Modal, Form, Input, Button } from "antd";
import { ToastContainer, toast, Bounce } from "react-toastify";
import {
    useGetAllSecurityQuery,
    usePostNewGuardiansMutation,
    usePutOneTeacherMutation
} from "../../services/usersApi.jsx";
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";

function TeachersMenu() {
    const { data: securities, refetch } = useGetAllSecurityQuery();
    const [putOneTeacher] = usePutOneTeacherMutation();
    const [postNewAdmin] = usePostNewGuardiansMutation();
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
        setIsModalVisible(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            let response;

            if (currentRecord) {
                values.id = currentRecord.id;
                response = await putOneTeacher(values).unwrap();
            } else {
                response = await postNewAdmin(values).unwrap();
            }

            if (response?.statusCode === 200) {
                toast.success(currentRecord ? "Mühafizəçi uğurla redaktə edildi!" : "Mühavizəçi əlavə olundu!", {
                    position: "bottom-right",
                    autoClose: 2500,
                    theme: "dark",
                    transition: Bounce,
                });
                refetch(); // Veriyi yenilə
                setIsModalVisible(false);
                form.resetFields();
            } else {
                toast.error("Xəta baş verdi!", {
                    position: "bottom-right",
                    autoClose: 2500,
                    theme: "dark",
                    transition: Bounce,
                });
            }
        } catch (error) {
            toast.error(currentRecord ? "Xəta baş verdi!" : "Xəta baş verdi!", {
                position: "bottom-right",
                autoClose: 2500,
                theme: "dark",
                transition: Bounce,
            });
        }
    };

    const columns = [
        {
            title: 'Ad',
            dataIndex: 'name',
            render: text => <span
                style={{ color: '#1677FF', fontSize: "15px", fontWeight: 600, cursor: 'pointer' }}>{text}</span>,
        },
        {
            title: 'Soyad',
            dataIndex: 'surname',
            render: text => <span
                style={{ color: '#1677FF', fontSize: "15px", fontWeight: 600, cursor: 'pointer' }}>{text}</span>,
        },
        {
            title: 'Ata adı',
            dataIndex: 'fatherName',
            render: text => <span
                style={{ color: '#1677FF', fontSize: "15px", fontWeight: 600, cursor: 'pointer' }}>{text}</span>,
        },
        {
            title: 'Vəzifə',
            dataIndex: 'position',
            render: text => <span
                style={{ color: '#1677FF', fontSize: "15px", fontWeight: 600, cursor: 'pointer' }}>{text}</span>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: text => <span
                style={{ color: '#000000', fontSize: "15px", fontWeight: 600, cursor: 'pointer' }}>{text}</span>,
        },
        {
            title: 'Mobil nömrə',
            dataIndex: 'phoneNumber',
            render: text => <span
                style={{ color: '#000000', fontSize: "15px", fontWeight: 600, cursor: 'pointer' }}>{text}</span>,
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
            title: 'Əməliyyatlar',
            dataIndex: 'actions',
            render: (_, record) => (
                <FiEdit onClick={() => openEditModal(record)} style={{
                    color: '#555',
                    fontSize: '20px',
                    cursor: 'pointer',
                }} />
            ),
        },
    ];

    return (
        <div id={"teachersMenu"}>
            <div className={"wrapper1"}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2>Mühafizəçilər</h2>
                    <Button type="primary" onClick={showModal}>Mühafizəçi əlavə et</Button>
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
                title={currentRecord ? "Mühavizəçini redaktə et" : "Mühafizəçi əlavə et"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>Ləğv et</Button>,
                    <Button key="save" type="primary" onClick={handleSave}>Yadda saxla</Button>,
                ]}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Ad"
                               rules={[{ required: true, message: "Zəhmət olmasa adı daxil edin." }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="surname" label="Soyad"
                               rules={[{ required: true, message: "Zəhmət olmasa soyadı daxil edin." }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="fatherName" label="Ata adı"
                               rules={[{ required: true, message: "Zəhmət olmasa ata adını daxil edin." }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="position" label="Vəzifə"
                               rules={[{ required: true, message: "Zəhmət olmasa vəzifəni daxil edin." }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email"
                               rules={[{ required: true, message: "Zəhmət olmasa doğru email daxil edin.", type: "email" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Şifrə"
                               rules={[{ required: true, message: "Zəhmət olmasa şifrə daxil edin." }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="phoneNumber" label="Mobil nömrə"
                               rules={[{ required: true, message: "Zəhmət olmasa mobil nömrəni daxil edin." }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            <ToastContainer />
        </div>
    );
}

export default TeachersMenu;
