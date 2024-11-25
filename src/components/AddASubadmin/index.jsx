import './index.scss';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useAddASubAdminPostMutation } from "../../services/usersApi.jsx";
import { Bounce, toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function AddASubadmin() {

    const [addASubAdminPost] = useAddASubAdminPostMutation();

    const SignupSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, 'Çox qısadır!')
            .max(50, 'Çox uzundur!')
            .required('Vacibdir'),
        surname: Yup.string()
            .min(2, 'Çox qısadır!')
            .max(50, 'Çox uzundur!')
            .required('Vacibdir'),
        fatherName: Yup.string()
            .min(2, 'Çox qısadır!')
            .max(50, 'Çox uzundur!')
            .required('Vacibdir'),
        email: Yup.string().email('Yanlış e-mail').required('Vacibdir'),
        password: Yup.string()
            .min(2, 'Çox qısadır!')
            .max(50, 'Çox uzundur!')
            .required('Vacibdir'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            surname: '',
            fatherName: '',
            email: '',
            password: '',
        },
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await addASubAdminPost(values).unwrap();
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
                }
                resetForm();
            } catch (e) {
                toast.error('Xəta baş verdi!', {
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
        validationSchema: SignupSchema,
    });

    return (
        <section id="addASubadmin">
            <h2>İşçi əlavə et</h2>
            <form onSubmit={formik.handleSubmit}>
                <div className="wrapper">
                    <label htmlFor="name">Ad</label>
                    <input
                        id="name"
                        name="name"
                        placeholder="Ad"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                    />
                    {formik.errors.name && formik.touched.name && <div id="feedback">{formik.errors.name}</div>}
                </div>
                <div className="wrapper">
                    <label htmlFor="surname">Soyad</label>
                    <input
                        id="surname"
                        name="surname"
                        placeholder="Soyad"
                        onChange={formik.handleChange}
                        value={formik.values.surname}
                    />
                    {formik.errors.surname && formik.touched.surname &&
                        <div id="feedback">{formik.errors.surname}</div>}
                </div>
                <div className="wrapper">
                    <label htmlFor="fatherName">Ata adı</label>
                    <input
                        id="fatherName"
                        name="fatherName"
                        placeholder="Ata adı"
                        onChange={formik.handleChange}
                        value={formik.values.fatherName}
                    />
                    {formik.errors.fatherName && formik.touched.fatherName &&
                        <div id="feedback">{formik.errors.fatherName}</div>}
                </div>
                <div className="wrapper">
                    <label htmlFor="email">E-mail</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="E-mail"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                    />
                    {formik.errors.email && formik.touched.email && <div id="feedback">{formik.errors.email}</div>}
                </div>
                <div className="wrapper">
                    <label htmlFor="password">Şifrə</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Şifrə"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />
                    {formik.errors.password && formik.touched.password &&
                        <div id="feedback">{formik.errors.password}</div>}
                </div>
                <button type="submit">Əlavə et</button>
            </form>
            <ToastContainer />
        </section>
    );
}

export default AddASubadmin;
