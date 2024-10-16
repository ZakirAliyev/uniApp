import './index.scss';
import {Form, Input, Modal, Table} from "antd";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {FiEdit} from "react-icons/fi";
import {
    useDeleteTeacherMutation,
    useGetAllDepartmentsQuery,
    useGetAllFacultiesQuery,
    useGetAllTeachersQuery,
    usePutOneTeacherMutation,
} from "../../services/usersApi.jsx";
import {useEffect, useState} from 'react';
import {FaRegTrashAlt} from "react-icons/fa";
import Swal from "sweetalert2";
import 'react-toastify/dist/ReactToastify.css';

function TeachersMenu() {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
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

            const departmentIdToUse = selectedDepartmentId || selectedTeacher.departmentId;
            const facultyIdToUse = selectedFacultyId || selectedTeacher.facultyId;

            const payload = {
                name: values.name,
                surname: values.surname,
                fatherName: values.fatherName,
                departmentId: departmentIdToUse,  // Ensure this comes from form or selection
                facultyId: facultyIdToUse || 0,  // Replace with actual facultyId or set to 0
                roomNumber: values.roomNumber,
                position: values.position,
                email: values.email,
                password: values.password || 'defaultPassword',  // Replace with actual logic if needed
                phoneNumber: values.phoneNumber,
                imgUrl: values.imgUrl
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
            toast.error('Please fill in the required fields.', {
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
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
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
            title: 'Room Number',
            dataIndex: 'roomNumber',
            render: text => <span
                style={{color: '#ff1616', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Faculty Name',
            dataIndex: 'facultyName',
            render: text => <span
                style={{color: '#13a608', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text}</span>,
        },
        {
            title: 'Department Name',
            dataIndex: 'departmentName',
            render: text => <span
                style={{color: '#13a608', fontSize: "15px", fontWeight: 600, cursor: 'pointer'}}>{text  || 'N/A'}</span>,
        },
        {
            title: 'Position',
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
            render: (text, record) => (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '17px'}}>
                    <FaRegTrashAlt
                        className={"facultyEditIcons"}
                        style={{
                            fontSize: '20px',
                            color: 'gray',
                            cursor: record.isDeleted ? 'not-allowed' : 'pointer'
                        }} onClick={() => handleDelete(record)}/>
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
                    <h2>Teachers</h2>
                    <div style={{display: 'flex', gap: '10px'}}>
                        <select
                            onChange={(e) => {
                                setSelectedDepartmentForFilter(e.target.value);
                            }}
                            value={selectedDepartmentForFilter}
                        >
                            <option value="">All Departments</option>
                            <option value="withoutDepartment">Without a department</option>
                            {/* New option */}
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
                            <option value="" disabled>Sort by</option>
                            <option value="oldest">Oldest</option>
                            <option value="newest">Newest</option>
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
                                placeholder={"Search teacher"}
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
                title="Edit Department"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} className={"ant-form-item-required111"}>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the department name!',
                            },
                        ]}
                        style={{
                            marginTop: '20px'
                        }}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Surname"
                        name="surname"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the department name!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Father Name"
                        name="fatherName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the department name!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Room Number"
                        name="roomNumber"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the department name!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Position"
                        name="position"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the department name!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Faculty"
                        name="facultyId"
                        rules={[
                            {
                                required: true,
                                message: 'Please select a department!',
                            },
                        ]}
                    >
                        <select
                            value={selectedDepartmentId}
                            onChange={(e) => setSelectedFacultyId(parseInt(e.target.value, 10))}
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
                        label="Department"
                        name="departmentId"
                        rules={[
                            {
                                required: true,
                                message: 'Please select a department!',
                            },
                        ]}
                    >
                        <select
                            value={selectedDepartmentId}
                            onChange={(e) => setSelectedDepartmentId(parseInt(e.target.value, 10))}
                            style={{
                                width: '100%',
                                border: '1px solid #D9D9D9',
                                outline: 'none',
                                height: '32px',
                                borderRadius: '5px',
                                paddingLeft: '8px',
                            }}
                        >
                            {departments.map((department) =>
                                    !department.isDeleted && (
                                        <option key={department.id} value={department.id}>
                                            {department.name}
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
                                message: 'Please input the department name!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Phone Number"
                        name="phoneNumber"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the department name!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Image URL"
                        name="imgUrl"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the department name!',
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

export default TeachersMenu;
