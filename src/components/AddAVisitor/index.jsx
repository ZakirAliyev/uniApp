import { Button } from 'antd';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import './index.scss';
import { useCreateVisitorPostMutation } from "../../services/usersApi.jsx";
import { Bounce, toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function AddAVisitor() {
    const validationSchema = Yup.object({
        name: Yup.string().required('Visitor Name is required'),
        surname: Yup.string().required('Visitor Surname is required'),
        email: Yup.string().email('Invalid email format').required('Visitor Email is required'),
        description: Yup.string().required('Description is required'),
        visitedDate: Yup.string().required('Visited Date is required'),
        finCode: Yup.string()
            .length(7, 'FIN Code must be exactly 7 characters')
            .required('FIN Code is required'),
        phoneNumber: Yup.string()
            .matches(/^\d{9}$/, 'Phone number must be a 9-digit number')
            .required('Phone number is required'),
        isRepeated: Yup.boolean().required('Is this a repeated visit? is required'),
        carNumber: Yup.string()
            .matches(/^[0-9]{2}-[A-Za-z]{2}-[0-9]{3}$/, 'Car number must be in the format XX-XX-XXX')
    });

    const initialValues = {
        name: '',
        surname: '',
        email: '',
        description: '',
        carCheck: false,
        carNumber: '',
        visitedDate: '',
        adminId: '',
        isRepeated: false,
        phoneNumber: '',
        finCode: '',
    };

    const [postVisitor] = useCreateVisitorPostMutation();

    const handleSubmit = async (values) => {
        // Format the visitedDate manually
        const visitedDate = new Date(values.visitedDate);

        const day = String(visitedDate.getDate()).padStart(2, '0');
        const month = String(visitedDate.getMonth() + 1).padStart(2, '0');
        const year = visitedDate.getFullYear();
        const hours = String(visitedDate.getHours()).padStart(2, '0');
        const minutes = String(visitedDate.getMinutes()).padStart(2, '0');

        const formattedVisitedDate = `${day}.${month}.${year} ${hours}:${minutes}`;

        values.visitedDate = formattedVisitedDate;

        values.phoneNumber = '+994' + values.phoneNumber;  // Ensure phone number is formatted
        values.isRepeated = values.isRepeated === "true" || values.isRepeated === true;
        try {
            const response = await postVisitor(values).unwrap();
            if (response?.statusCode === 200) {
                toast.success(response.message, {
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
        } catch (error) {
            toast.error('Error', {
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
    };

    const handleCancel = (resetForm) => {
        // Reset the form values when Cancel button is clicked
        resetForm();
    };

    return (
        <div className="wrapper zakirWrapper">
            <h2>Add New Visitor</h2>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, handleChange, handleBlur, setFieldValue, errors, touched, resetForm }) => (
                    <Form>
                        <div className="row">
                            <div className="col-6">
                                <label>Visitor Name <span style={{ color: 'red' }}>*</span></label>
                                <Field
                                    type="text"
                                    name="name"
                                    placeholder="Visitor Name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.name}
                                />
                                <ErrorMessage name="name" component="div" style={{ color: 'red', marginTop: '5px' }} />
                            </div>
                            <div className="col-6">
                                <label>Visitor Surname <span style={{ color: 'red' }}>*</span></label>
                                <Field
                                    type="text"
                                    name="surname"
                                    placeholder="Visitor Surname"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.surname}
                                />
                                <ErrorMessage name="surname" component="div" style={{ color: 'red', marginTop: '5px' }} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6">
                                <label>Visitor Email <span style={{ color: 'red' }}>*</span></label>
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="Visitor Email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                />
                                <ErrorMessage name="email" component="div" style={{ color: 'red', marginTop: '5px' }} />
                            </div>
                            <div className="col-6">
                                <label>Description <span style={{ color: 'red' }}>*</span></label>
                                <Field
                                    type="text"
                                    name="description"
                                    placeholder="Description"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.description}
                                />
                                <ErrorMessage name="description" component="div" style={{ color: 'red', marginTop: '5px' }} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6">
                                <label>Visited Date <span style={{ color: 'red' }}>*</span></label>
                                <Field
                                    type="datetime-local"
                                    name="visitedDate"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.visitedDate}
                                    min={new Date().toISOString().slice(0, 16)} // Prevent past dates
                                />
                                <ErrorMessage name="visitedDate" component="div" style={{ color: 'red', marginTop: '5px' }} />
                            </div>
                            <div className="col-6">
                                <label>FIN Code <span style={{ color: 'red' }}>*</span></label>
                                <Field
                                    type="text"
                                    name="finCode"
                                    placeholder="FIN Code"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.finCode}
                                />
                                <ErrorMessage name="finCode" component="div" style={{ color: 'red', marginTop: '5px' }} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6">
                                <label>Is this a repeated visit?</label>
                                <Field
                                    as="select"
                                    name="isRepeated"
                                    onChange={handleChange}
                                    value={values.isRepeated}
                                >
                                    <option value={false}>Bir dəfə</option>
                                    <option value={true}>Hər həftə</option>
                                </Field>
                                <ErrorMessage name="isRepeated" component="div" style={{ color: 'red', marginTop: '5px' }} />
                            </div>
                            <div className="col-6">
                                <label>Phone Number (məs: 501234567)<span style={{ color: 'red' }}>*</span></label>
                                <Field
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="Phone number"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.phoneNumber}
                                />
                                <ErrorMessage name="phoneNumber" component="div" style={{ color: 'red', marginTop: '5px' }} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
                                <Field
                                    type="checkbox"
                                    name="carCheck"
                                    checked={values.carCheck}
                                    onChange={handleChange}
                                    style={{ width: 'max-content' }}
                                />
                                <label style={{ marginTop: '5px' }}>Will they come by car?</label>
                            </div>
                            {values.carCheck && (
                                <div className="col-6">
                                    <label>Car Number <span style={{ color: 'red' }}>*</span></label>
                                    <Field
                                        type="text"
                                        name="carNumber"
                                        placeholder="Car number"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.carNumber}
                                    />
                                    <ErrorMessage name="carNumber" component="div" style={{ color: 'red', marginTop: '5px' }} />
                                </div>
                            )}
                        </div>

                        <div className="buttonWrapper" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <Button type="primary" size="large" htmlType="submit">Save</Button>
                        </div>
                    </Form>
                )}
            </Formik>
            <ToastContainer />
        </div>
    );
}

export default AddAVisitor;
