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
            name: Yup.string().required('Zəhmət olmasa adı daxil edin!'),
            surname: Yup.string().required('Zəhmət olmasa soyadı daxil edin!'),
            fatherName: Yup.string().required("Zəhmət olmasa ata adını daxil edin!"),
            departmentId: Yup.number().required('Zəhmət olmasa bölməni seçin!'),
            facultyId: Yup.number().required('Zəhmət olmasa şöbəni seçin!'),
            roomNumber: Yup.string().required('Zəhmət olmasa otaq nömrəsini daxil edin!'),
            position: Yup.string().required('Zəhmət olmasa vəzifəni daxil edin!'),
            email: Yup.string().email('Zəhmət olmasa düzgün e-poçt daxil edin!').required('Zəhmət olmasa e-poçtu daxil edin!'),
            password: Yup.string().required('Zəhmət olmasa parolu daxil edin!'),
            phoneNumber: Yup.string().required('Zəhmət olmasa telefon nömrəsini daxil edin!'),
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
                <h2 style={{ marginBottom: '20px' }}>Yeni müəllim əlavə et</h2>

                {[{ name: 'name', label: 'Ad' }, { name: 'surname', label: 'Soyad' }, { name: 'fatherName', label: "Ata adı" }, { name: 'roomNumber', label: 'Otaq nömrəsi' }, { name: 'position', label: 'Vəzifə' }, { name: 'email', label: 'E-poçt', type: 'email' }, { name: 'password', label: 'Parol', type: 'password' }, { name: 'phoneNumber', label: 'Telefon nömrəsi' }].map(({ name, label, type = 'text' }) => (
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
                        <label><span style={{ color: 'red' }}>* </span>Fakültə və ya şöbə</label>
                        <select style={{ maxWidth: '600px', width: '100%' }} onChange={e => formik.setFieldValue('facultyId', e.target.value)} value={formik.values.facultyId} size="large">
                            <option disabled value="">Fakültə və ya şöbəni seçin</option>
                            {faculties?.data
                                ?.filter(faculty => !faculty.isDeleted) // Yalnız silinməmiş fakültələr daxildir
                                .map(faculty => (
                                    <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                                ))}
                        </select>
                    </div>
                </Form.Item>

                <Form.Item name="departmentId" validateStatus={formik.touched.departmentId && formik.errors.departmentId ? 'error' : ''} help={formik.touched.departmentId && formik.errors.departmentId}>
                    <div className="box" style={{ marginTop: '15px' }}>
                        <label><span style={{ color: 'red' }}>* </span>Bölmə</label>
                        <select style={{ maxWidth: '600px', width: '100%' }} onChange={e => formik.setFieldValue('departmentId', e.target.value)} value={formik.values.departmentId} size="large">
                            <option disabled value="">Bölməni seçin</option>
                            {departments?.data
                                ?.filter(department => !department.isDeleted) // Yalnız silinməmiş bölmələr daxildir
                                .map(department => (
                                    <option key={department.id} value={department.id}>{department.name}</option>
                                ))}
                        </select>
                    </div>
                </Form.Item>


                <div className="buttonWrapper" style={{ display: 'flex', gap: '10px', marginTop: '60px' }}>
                    <Button size="large" type="primary" htmlType="submit">Yadda saxla</Button>
                    <Button size="large" className="buttonSave" type="primary" onClick={formik.handleSubmit}>Yadda saxla və çıx</Button>
                    <Button size="large" className="buttonSave" type="primary" danger onClick={() => formik.resetForm()}>Ləğv et</Button>
                </div>
                <ToastContainer />
            </Form>
        </>
    );
}

export default AddATeacher;
