import './index.scss';
import {Form, Input, Modal, Table} from "antd";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {FiEdit} from "react-icons/fi";
import {
    useDeleteTeacherMutation,
    useGetAllSubadminsQuery,
    usePutOneTeacherMutation, usePutSubAdminDataMutation,
} from "../../services/usersApi.jsx";
import {useEffect, useState} from 'react';
import Swal from "sweetalert2";
import 'react-toastify/dist/ReactToastify.css';

function SubadminsMenu() {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [newTeacherName, setNewTeacherName] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const {data: allTeachers, refetch} = useGetAllSubadminsQuery();
    const dataSource = allTeachers?.data || [];

    const [updateTeacher] = usePutSubAdminDataMutation();
    const [deleteTeacher] = useDeleteTeacherMutation();

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        const filtered = dataSource.filter(teacher =>
            teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchTerm, dataSource]);

    const showModal = (teacher) => {
        setSelectedTeacher(teacher);
        form.setFieldsValue(teacher);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const payload = {
                name: values.name,
                surname: values.surname,
                fatherName: values.fatherName,
                email: values.email,
                password: values.password
            };

            const response = await updateTeacher({
                id: selectedTeacher.id,
                ...payload
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
                setNewTeacherName("");
            } else {
                throw new Error();
            }
        } catch (error) {
            toast.error('Zəhmət olmasa bütün xanaları doldurun!', {
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

    async function handleDelete(record) {
        Swal.fire({
            title: "Əminsiniz?",
            text: "Bunu geri qaytara bilməyəcəksiniz!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Bəli",
            cancelButtonText: "Xeyr"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await deleteTeacher(record.id).unwrap();
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
                    toast.error(response?.message, {
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
            }
        });
    }


    const columns = [
        {
            title: 'Ad',
            dataIndex: 'name',
            render: text => <span
                style={{color: '#1677FF', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Soyad',
            dataIndex: 'surname',
            render: text => <span
                style={{color: '#1677FF', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Ata adı',
            dataIndex: 'fatherName',
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
                    <h2>İşçilər</h2>
                    <Form form={form}>
                        <div className={"box"}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Input
                                    className={"input"}
                                    size="large"
                                    name="search"
                                    value={searchTerm}
                                    placeholder={"İşçi axtar"}
                                    style={{
                                        width: '400px'
                                    }}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
            <div className="wrapper2">
                <Table
                    dataSource={filteredData}
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
                title="İşçini redaktə et"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} className={"ant-form-item-required111"}>
                    <Form.Item
                        label="Ad"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Zəhmət olmasa ad daxil edin!',
                            },
                        ]}
                        style={{
                            marginTop: '20px'
                        }}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Soyad"
                        name="surname"
                        rules={[
                            {
                                required: true,
                                message: 'Zəhmət olmasa soyad daxil edin!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Ata adı"
                        name="fatherName"
                        rules={[
                            {
                                required: true,
                                message: 'Zəhmət olmasa ata adı daxil edin!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Zəhmət olmasa email daxil edin!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Şifrə"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Zəhmət olmasa şifrə daxil edin!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
            <ToastContainer/>
        </div>
    );
}

export default SubadminsMenu;
