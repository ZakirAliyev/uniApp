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
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        surname: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        fatherName: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
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
                toast.error('An error occurred!', {
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
            <h2>Add a Subadmin</h2>
            <form onSubmit={formik.handleSubmit}>
                <div className="wrapper">
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        name="name"
                        placeholder="Name"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                    />
                    {formik.errors.name && formik.touched.name && <div id="feedback">{formik.errors.name}</div>}
                </div>
                <div className="wrapper">
                    <label htmlFor="surname">Surname</label>
                    <input
                        id="surname"
                        name="surname"
                        placeholder="Surname"
                        onChange={formik.handleChange}
                        value={formik.values.surname}
                    />
                    {formik.errors.surname && formik.touched.surname &&
                        <div id="feedback">{formik.errors.surname}</div>}
                </div>
                <div className="wrapper">
                    <label htmlFor="fatherName">Father Name</label>
                    <input
                        id="fatherName"
                        name="fatherName"
                        placeholder="Father Name"
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
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />
                    {formik.errors.password && formik.touched.password &&
                        <div id="feedback">{formik.errors.password}</div>}
                </div>
                <button type="submit">Add</button>
            </form>
            <ToastContainer />
        </section>
    );
}

export default AddASubadmin;
