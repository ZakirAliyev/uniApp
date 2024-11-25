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
            name: Yup.string().required('Adı daxil edin!'),
            surname: Yup.string().required('Soyadı daxil edin!'),
            fatherName: Yup.string().required("Ata adını daxil edin!"),
            facultyId: Yup.number().required('Fakültə və ya şöbəni seçin!'),
            roomNumber: Yup.string().required('Otaq nömrəsini daxil edin!'),
            position: Yup.string().required('Vəzifəni daxil edin!'),
            email: Yup.string().email('Doğru bir email daxil edin!').required('Email daxil edin!'),
            password: Yup.string().required('Şifrəni daxil edin!'),
        }),
        onSubmit: async (values) => {
            const dataToSend = {
                ...values,
                departmentId: parseInt(values.departmentId, 10),
                facultyId: parseInt(values.facultyId, 10),
            };
            try {
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
                    formik.resetForm();
                }
            } catch (error) {
                toast.error(error?.data?.error || "Bir xəta baş verdi. Yenidən cəhd edin.", {
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

                {[{ name: 'name', label: 'Ad' }, { name: 'surname', label: 'Soyad' }, {
                    name: 'fatherName',
                    label: "Ata adı"
                }, { name: 'roomNumber', label: 'Otaq nömrəsi' }, { name: 'position', label: 'Vəzifə' }, {
                    name: 'email',
                    label: 'Email',
                    type: 'email'
                }, { name: 'password', label: 'Şifrə', type: 'password' }, {
                    name: 'phoneNumber',
                    label: 'Telefon nömrəsi'
                }].map(({ name, label, type = 'text' }) => (
                    <Form.Item key={name} name={name}
                               validateStatus={formik.touched[name] && formik.errors[name] ? 'error' : ''}
                               help={formik.touched[name] && formik.errors[name]}>
                        <div className="box">
                            <label>
                                <span style={{ color: 'red' }}>* </span>{label}
                            </label>
                            <Input className="input" size="large" name={name} placeholder={label} type={type}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   value={formik.values[name]} />
                        </div>
                    </Form.Item>
                ))}

                <Form.Item name="facultyId"
                           validateStatus={formik.touched.facultyId && formik.errors.facultyId ? 'error' : ''}
                           help={formik.touched.facultyId && formik.errors.facultyId}>
                    <div className="box">
                        <label><span style={{ color: 'red' }}>* </span>Fakültə və ya şöbə</label>
                        <select style={{ maxWidth: '600px', width: '100%' }}
                                onChange={e => formik.setFieldValue('facultyId', e.target.value)}
                                value={formik.values.facultyId} size="large">
                            <option disabled value="">Fakültə və ya şöbəni seçin</option>
                            {faculties?.data
                                ?.filter(faculty => !faculty.isDeleted)
                                .map(faculty => (
                                    <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                                ))}
                        </select>
                    </div>
                </Form.Item>

                <Form.Item name="departmentId">
                    <div className="box">
                        <label><span style={{ color: 'red' }}>* </span>Kafedra</label>
                        <select style={{ maxWidth: '600px', width: '100%' }}
                                onChange={e => formik.setFieldValue('departmentId', e.target.value)}
                                value={formik.values.departmentId} size="large">
                            <option value="">Kafedranı seçin</option>
                            {departments?.data
                                ?.filter(department => !department.isDeleted)
                                .map(department => (
                                    <option key={department.id} value={department.id}>{department.name}</option>
                                ))}
                        </select>
                    </div>
                </Form.Item>

                <div className="buttonWrapper" style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                    <Button size="large" type="primary" htmlType="submit">Yadda saxla</Button>
                    <Button size="large" className="buttonSave" type="primary" danger
                            onClick={() => formik.resetForm()}>Ləğv et</Button>
                </div>
                <ToastContainer />
            </Form>
        </>
    );
}

export default AddATeacher;
