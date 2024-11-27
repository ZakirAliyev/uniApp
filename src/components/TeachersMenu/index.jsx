import './index.scss';
import {Form, Input, Modal, Table} from "antd";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {FiEdit} from "react-icons/fi";
import {
    useDeleteTeacherMutation,
    useGetAllDepartmentsQuery,
    useGetAllFacultiesQuery,
    useGetAllTeachersQuery, usePutAdminPasswordMutation,
    usePutOneTeacherMutation,
} from "../../services/usersApi.jsx";
import {useEffect, useState} from 'react';
import {FaRegTrashAlt} from "react-icons/fa";
import Swal from "sweetalert2";
import 'react-toastify/dist/ReactToastify.css';
import {RiLockPasswordLine} from "react-icons/ri";

function TeachersMenu() {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [newTeacherName, setNewTeacherName] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [selectedFacultyId, setSelectedFacultyId] = useState("");
    const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
    const [selectedDepartmentForFilter, setSelectedDepartmentForFilter] = useState("");

    const {data: allTeachers, refetch} = useGetAllTeachersQuery();
    const {data: departmentsData} = useGetAllDepartmentsQuery();
    const departments = departmentsData?.data || [];
    const {data: facultiesData} = useGetAllFacultiesQuery();
    const faculties = facultiesData?.data || [];
    const dataSource = allTeachers?.data || [];

    const [updateTeacher] = usePutOneTeacherMutation();
    const [deleteTeacher] = useDeleteTeacherMutation();

    useEffect(() => {
        refetch();
    }, []);

    const showModal = (teacher) => {
        setSelectedTeacher(teacher);
        form.setFieldsValue(teacher);
        setIsModalOpen(true);
    };

    const showPasswordModal = (teacher) => {
        setIsPasswordModalOpen(true)
        setSelectedTeacher(teacher)
    };
    const handlePasswordModalCancel = () => setIsPasswordModalOpen(false);


    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const filteredData = dataSource
        .filter(teacher => {
            if (selectedDepartmentForFilter === "withoutDepartment") {
                return !teacher.departmentId; // Filter for teachers with null department
            }
            if (selectedDepartmentForFilter) {
                return String(teacher.departmentId) === selectedDepartmentForFilter; // Filter for selected department
            }
            return true; // No department filter applied
        })
        .filter(teacher =>
            teacher.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
            teacher.surname.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
            teacher.fatherName.toLowerCase().startsWith(searchTerm.toLowerCase())
        )
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

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const departmentIdToUse = selectedDepartmentId !== ""
                ? selectedDepartmentId
                : selectedTeacher?.departmentId || 0;

            const facultyIdToUse = selectedFacultyId || selectedTeacher.facultyId;

            const payload = {
                name: values.name,
                surname: values.surname,
                fatherName: values.fatherName,
                departmentId: departmentIdToUse, // Correctly resolve departmentId
                facultyId: facultyIdToUse, // Correctly resolve facultyId
                roomNumber: values.roomNumber,
                position: values.position,
                email: values.email,
                password: values.password,
                phoneNumber: values.phoneNumber,
                imgUrl: values.imgUrl,
            };

            const response = await updateTeacher({
                id: selectedTeacher.id,
                ...payload,
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
            toast.error("Zəhmət olmasa xanaları doldurun.", {
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
            cancelButtonText: "Xeyr",
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

    const [putAdminPassword] = usePutAdminPasswordMutation()

    const handlePasswordChange = async () => {
        try {
            const values = await form.validateFields(["newPassword"]);

            const payload = {
                newPassword: values.newPassword,
            }

            const response = await putAdminPassword({
                adminId: selectedTeacher.id,
                ...payload,
            }).unwrap();

            if (response?.statusCode === 200) {
                toast.success(response?.message || "Şifrə uğurla dəyişdirildi.", {
                    position: "bottom-right",
                    autoClose: 2500,
                    theme: "dark",
                    transition: Bounce,
                });

                setIsPasswordModalOpen(false); // Close the modal
                form.resetFields(); // Reset form fields
            } else {
                throw new Error(response?.message || "Şifrə dəyişdirilmədi.");
            }
        } catch (error) {
            toast.error(
                error.message || "Zəhmət olmasa xanaları düzgün doldurun.",
                {
                    position: "bottom-right",
                    autoClose: 2500,
                    theme: "dark",
                    transition: Bounce,
                }
            );
        }
    };


    const columns = [
        {
            title: 'Image',
            dataIndex: 'imgUrl',
            render: text => <img src={text} alt={"Image"} style={{
                width: '40px',
                height: '40px',
                borderRadius: '5px',
                objectFit: 'cover',
            }}/>,
        },
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
            title: 'Otaq nömrəsi',
            dataIndex: 'roomNumber',
            render: text => <span
                style={{color: '#ff1616', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Fakültə və ya şöbə adı',
            dataIndex: 'facultyName',
            render: text => <span
                style={{color: '#13a608', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Kafedra adı',
            dataIndex: 'departmentName',
            render: text => <span
                style={{color: '#13a608', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text || 'N/A'}</span>,
        },
        {
            title: 'Vəzifə',
            dataIndex: 'position',
            render: text => <span
                style={{color: '#13a608', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: text => <span
                style={{color: '#000000', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Mobil nömrə',
            dataIndex: 'phoneNumber',
            render: text => <span
                style={{color: '#000000', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
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
            title: 'Əməliyyatlar',
            render: (text, record) => (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '17px'}}>
                    <FiEdit
                        className={"facultyEditIcons"}
                        style={{fontSize: '20px', color: 'gray', cursor: record.isDeleted ? 'not-allowed' : 'pointer'}}
                        onClick={() => !record.isDeleted && showModal(record)}
                    />
                    <RiLockPasswordLine
                        style={{
                            fontSize: "20px",
                            color: "gray",
                            cursor: record.isDeleted ? "not-allowed" : "pointer",
                        }}
                        onClick={() => !record.isDeleted && showPasswordModal(record)}
                    />

                    <FaRegTrashAlt
                        className={"facultyEditIcons"}
                        style={{
                            fontSize: '20px',
                            color: 'gray',
                            cursor: record.isDeleted ? 'not-allowed' : 'pointer'
                        }} onClick={() => handleDelete(record)}/>
                </div>
            ),
        },
    ];

    return (
        <div id={"buildingsMenu"}>
            <div className={"wrapper1"}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <h2>Adminlər</h2>
                    <div style={{display: 'flex', gap: '10px'}}>
                        <select
                            onChange={(e) => {
                                setSelectedDepartmentForFilter(e.target.value);
                            }}
                            value={selectedDepartmentForFilter}
                        >
                            <option value="">Bütün kafedralar</option>
                            <option value="withoutDepartment">Kafedrası olmayanlar</option>
                            {departments
                                .filter(department => !department.isDeleted) // Only include departments where isDeleted is false
                                .map((department) => (
                                    <option key={department.id} value={String(department.id)}>
                                        {department.name}
                                    </option>
                                ))}
                        </select>
                        <select
                            onChange={(e) => {
                                const value = e.target.value;
                                setSortOrder(value);
                            }}
                            value={sortOrder}
                        >
                            <option value="" disabled>Sırala</option>
                            <option value="oldest">Ən köhnə</option>
                            <option value="newest">Ən yeni</option>
                            <option value="a-z">A-Z</option>
                            <option value="z-a">Z-A</option>
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
                                placeholder={"Admin axtar"}
                                style={{
                                    width: '400px'
                                }}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
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
                    style={{
                        overflowX: 'auto'
                    }}
                />
            </div>
            <Modal
                title="Kafedranı redaktə et"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText={"Ləğv et"}
                okText={"Yadda saxla"}
            >
                <Form form={form} className={"ant-form-item-required111"}>
                    <Form.Item
                        label="Ad"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Zəhmət olmasa adı daxil edin!',
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
                                message: 'Zəhmət olmasa soyadı daxil edin!',
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
                        label="Otaq nömrəsi"
                        name="roomNumber"
                        rules={[
                            {
                                required: true,
                                message: 'Zəhmət olmasa otaq nömrəsi daxil edin!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Vəzifə"
                        name="position"
                        rules={[
                            {
                                required: true,
                                message: 'Zəhmət olmasa vəzifə daxil edin!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Fakültə və ya şöbə"
                        name="facultyId"
                        rules={[
                            {
                                required: true,
                                message: 'Zəhmət olmasa fakültə və ya şöbə daxil edin!',
                            },
                        ]}
                    >
                        <select
                            value={selectedFacultyId}
                            onChange={(e) =>
                                setSelectedFacultyId(parseInt(e.target.value, 10))
                            }
                            style={{
                                width: '100%',
                                border: '1px solid #D9D9D9',
                                outline: 'none',
                                height: '32px',
                                borderRadius: '5px',
                                paddingLeft: '8px',
                            }}
                        >
                            {faculties.map((faculty) =>
                                    !faculty.isDeleted && (
                                        <option key={faculty.id} value={faculty.id}>
                                            {faculty.name}
                                        </option>
                                    )
                            )}
                        </select>

                    </Form.Item>
                    <Form.Item
                        label="Kafedra"
                        name="departmentId"
                        rules={[
                            {
                                required: true,
                                message: "Zəhmət olmasa kafedra daxil edin!",
                            },
                        ]}
                    >
                        <select
                            value={selectedDepartmentId}
                            onChange={(e) => setSelectedDepartmentId(parseInt(e.target.value, 10))}
                            style={{
                                width: "100%",
                                border: "1px solid #D9D9D9",
                                outline: "none",
                                height: "32px",
                                borderRadius: "5px",
                                paddingLeft: "8px",
                            }}
                        >
                            <option key={0} value={0}>
                                Kafedrasız
                            </option>
                            {departments.map((faculty) =>
                                    !faculty.isDeleted && (
                                        <option key={faculty.id} value={faculty.id}>
                                            {faculty.name}
                                        </option>
                                    )
                            )}
                        </select>
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
                        label="Mobil nömrə"
                        name="phoneNumber"
                        rules={[
                            {
                                required: true,
                                message: 'Zəhmət olmasa mobil nömrə daxil edin!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Şifrəni Dəyişdir"
                open={isPasswordModalOpen}
                onOk={handlePasswordChange} // Call handler when OK is clicked
                onCancel={() => {
                    setIsPasswordModalOpen(false); // Close modal
                    form.resetFields(); // Reset form fields on cancel
                }}
                cancelText={"Ləğv et"}
                okText={"Yadda saxla"}
            >
                <Form form={form}>
                    <Form.Item
                        label="Yeni Şifrə"
                        name="newPassword"
                        rules={[
                            {
                                required: true,
                                message: "Zəhmət olmasa yeni şifrəni daxil edin!",
                            },
                            {
                                min: 6,
                                message: "Şifrə ən azı 6 simvoldan ibarət olmalıdır!",
                            },
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>
                </Form>
            </Modal>

            <ToastContainer/>
        </div>
    );
}

export default TeachersMenu;
