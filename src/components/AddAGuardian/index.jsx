import { Form, Input, Button } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './index.scss';
import {
    useGetAllDepartmentsQuery,
    useGetAllFacultiesQuery,
    usePostNewTeacherMutation
} from "../../services/usersApi.jsx";
import { Bounce, toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function AddATeacher() {
    const [postNewTeacher] = usePostNewTeacherMutation();

    const { data: faculties } = useGetAllFacultiesQuery();
    const { data: departments } = useGetAllDepartmentsQuery();

    const formik = useFormik({
        initialValues: {
            name: '',
            surname: '',
            fatherName: '',
            departmentId: '',
            facultyId: '',
            roomNumber: '',
            position: '',
            email: '',
            password: '',
            phoneNumber: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Please input the name!'),
            surname: Yup.string().required('Please input the surname!'),
            fatherName: Yup.string().required("Please input the father's name!"),
            departmentId: Yup.number().required('Please select the department!'),
            facultyId: Yup.number().required('Please select the faculty!'),
            roomNumber: Yup.string().required('Please input the room number!'),
            position: Yup.string().required('Please input the position!'),
            email: Yup.string().email('Please input a valid email!').required('Please input the email!'),
            password: Yup.string().required('Please input the password!'),
            phoneNumber: Yup.string().required('Please input the phone number!'),
        }),
        onSubmit: async (values) => {
            const dataToSend = {
                ...values,
                departmentId: parseInt(values.departmentId, 10),
                facultyId: parseInt(values.facultyId, 10),
            };

            const response = await postNewTeacher(dataToSend).unwrap();

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
        },
    });

    return (
        <>
            <Form className="wrapper" onFinish={formik.handleSubmit}>
                <h2 style={{ marginBottom: '20px' }}>Add new teacher</h2>

                {[{ name: 'name', label: 'Name' }, { name: 'surname', label: 'Surname' }, { name: 'fatherName', label: "Father Name" }, { name: 'roomNumber', label: 'Room Number' }, { name: 'position', label: 'Position' }, { name: 'email', label: 'Email', type: 'email' }, { name: 'password', label: 'Password', type: 'password' }, { name: 'phoneNumber', label: 'Phone Number' }].map(({ name, label, type = 'text' }) => (
                    <Form.Item key={name} name={name} validateStatus={formik.touched[name] && formik.errors[name] ? 'error' : ''} help={formik.touched[name] && formik.errors[name]}>
                        <div className="box" style={{ marginTop: '15px' }}>
                            <label>
                                <span style={{ color: 'red' }}>* </span>{label}
                            </label>
                            <Input className="input" size="large" name={name} placeholder={label} type={type} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values[name]} />
                        </div>
                    </Form.Item>
                ))}


                <Form.Item name="facultyId" validateStatus={formik.touched.facultyId && formik.errors.facultyId ? 'error' : ''} help={formik.touched.facultyId && formik.errors.facultyId}>
                    <div className="box" style={{ marginTop: '15px' }}>
                        <label><span style={{ color: 'red' }}>* </span>Faculty</label>
                        <select style={{ maxWidth: '600px', width: '100%' }} onChange={e => formik.setFieldValue('facultyId', e.target.value)} value={formik.values.facultyId} size="large">
                            <option disabled value="">Select faculty</option>
                            {faculties?.data
                                ?.filter(faculty => !faculty.isDeleted) // Only include faculties where isDeleted is false
                                .map(faculty => (
                                    <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                                ))}
                        </select>
                    </div>
                </Form.Item>

                <Form.Item name="departmentId" validateStatus={formik.touched.departmentId && formik.errors.departmentId ? 'error' : ''} help={formik.touched.departmentId && formik.errors.departmentId}>
                    <div className="box" style={{ marginTop: '15px' }}>
                        <label><span style={{ color: 'red' }}>* </span>Department</label>
                        <select style={{ maxWidth: '600px', width: '100%' }} onChange={e => formik.setFieldValue('departmentId', e.target.value)} value={formik.values.departmentId} size="large">
                            <option disabled value="">Select department</option>
                            {departments?.data
                                ?.filter(department => !department.isDeleted) // Only include departments where isDeleted is false
                                .map(department => (
                                    <option key={department.id} value={department.id}>{department.name}</option>
                                ))}
                        </select>
                    </div>
                </Form.Item>


                <div className="buttonWrapper" style={{ display: 'flex', gap: '10px', marginTop: '60px' }}>
                    <Button size="large" type="primary" htmlType="submit">Save</Button>
                    <Button size="large" className="buttonSave" type="primary" onClick={formik.handleSubmit}>Save and exit</Button>
                    <Button size="large" className="buttonSave" type="primary" danger onClick={() => formik.resetForm()}>Cancel</Button>
                </div>
                <ToastContainer />
            </Form>
        </>
    );
}

export default AddATeacher;
