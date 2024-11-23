import {Button} from 'antd';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import './index.scss';
import {useCreateVisitorPostMutation} from "../../services/usersApi.jsx";
import {Bounce, toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function AddAVisitor() {
    const validationSchema = Yup.object({
        name: Yup.string().required('Ziyarətçinin adı tələb olunur'),
        surname: Yup.string().required('Ziyarətçinin soyadı tələb olunur'),
        email: Yup.string().email('Yanlış email formatı').required('Ziyarətçinin e-maili tələb olunur'),
        description: Yup.string().required('Təsvir tələb olunur'),
        visitedDate: Yup.string().required('Ziyarət tarixi tələb olunur'),
        finCode: Yup.string()
            .length(7, 'FIN kodu mütləq 7 simvol olmalıdır')
            .required('FIN kodu tələb olunur'),
        phoneNumber: Yup.string()
            .matches(/^\d{9}$/, 'Telefon nömrəsi 9 rəqəmdən ibarət olmalıdır')
            .required('Telefon nömrəsi tələb olunur'),
        isRepeated: Yup.boolean().required('Bu ziyarət təkrarlanan bir ziyarətdir? tələb olunur'),
        carNumber: Yup.string()
            .matches(/^[0-9]{2}-[A-Za-z]{2}-[0-9]{3}$/, 'Avtomobil nömrəsi XX-XX-XXX formatında olmalıdır')
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
        // visitedDate-ni əl ilə formatlamaq
        const visitedDate = new Date(values.visitedDate);

        const day = String(visitedDate.getDate()).padStart(2, '0');
        const month = String(visitedDate.getMonth() + 1).padStart(2, '0');
        const year = visitedDate.getFullYear();
        const hours = String(visitedDate.getHours()).padStart(2, '0');
        const minutes = String(visitedDate.getMinutes()).padStart(2, '0');

        const formattedVisitedDate = `${day}.${month}.${year} ${hours}:${minutes}`;

        values.visitedDate = formattedVisitedDate;

        values.phoneNumber = '+994' + values.phoneNumber;  // Telefon nömrəsinin formatını təmin et
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
            toast.error('Xəta', {
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
        // Cancel düyməsinə basıldığında formu sıfırlamaq
        resetForm();
    };

    return (
        <div className="wrapper zakirWrapper">
            <h2>Yeni Ziyarətçi Əlavə Et</h2>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({values, handleChange, handleBlur, setFieldValue, errors, touched, resetForm}) => (
                    <Form>
                        <div className="row">
                            <div className="col-6">
                                <label>Ziyarətçinin Adı <span style={{color: 'red'}}>*</span></label>
                                <Field
                                    type="text"
                                    name="name"
                                    placeholder="Ziyarətçinin adı"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.name}
                                />
                                <ErrorMessage name="name" component="div" style={{color: 'red', marginTop: '5px'}}/>
                            </div>
                            <div className="col-6">
                                <label>Ziyarətçinin Soyadı <span style={{color: 'red'}}>*</span></label>
                                <Field
                                    type="text"
                                    name="surname"
                                    placeholder="Ziyarətçinin soyadı"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.surname}
                                />
                                <ErrorMessage name="surname" component="div" style={{color: 'red', marginTop: '5px'}}/>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6">
                                <label>Ziyarətçinin E-maili <span style={{color: 'red'}}>*</span></label>
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="Ziyarətçinin e-maili"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                />
                                <ErrorMessage name="email" component="div" style={{color: 'red', marginTop: '5px'}}/>
                            </div>
                            <div className="col-6">
                                <label>Təsvir <span style={{color: 'red'}}>*</span></label>
                                <Field
                                    type="text"
                                    name="description"
                                    placeholder="Təsvir"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.description}
                                />
                                <ErrorMessage name="description" component="div"
                                              style={{color: 'red', marginTop: '5px'}}/>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6">
                                <label>Ziyarət Tarixi <span style={{color: 'red'}}>*</span></label>
                                <Field
                                    type="datetime-local"
                                    name="visitedDate"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.visitedDate}
                                    min={new Date().toISOString().slice(0, 16)} // Keçmiş tarixləri qarşısını al
                                />
                                <ErrorMessage name="visitedDate" component="div"
                                              style={{color: 'red', marginTop: '5px'}}/>
                            </div>
                            <div className="col-6">
                                <label>FIN Kodu <span style={{color: 'red'}}>*</span></label>
                                <Field
                                    type="text"
                                    name="finCode"
                                    placeholder="FIN Kodu"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.finCode}
                                />
                                <ErrorMessage name="finCode" component="div" style={{color: 'red', marginTop: '5px'}}/>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6">
                                <label>Bu, təkrarlanan bir ziyarət midir?</label>
                                <Field
                                    as="select"
                                    name="isRepeated"
                                    onChange={handleChange}
                                    value={values.isRepeated}
                                >
                                    <option value={false}>Bir dəfə</option>
                                    <option value={true}>Hər həftə</option>
                                </Field>
                                <ErrorMessage name="isRepeated" component="div"
                                              style={{color: 'red', marginTop: '5px'}}/>
                            </div>
                            <div className="col-6">
                                <label>Telefon Nömrəsi (məs: 501234567)<span style={{color: 'red'}}>*</span></label>
                                <Field
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="Telefon nömrəsi"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.phoneNumber}
                                />
                                <ErrorMessage name="phoneNumber" component="div"
                                              style={{color: 'red', marginTop: '5px'}}/>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6"
                                 style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px'}}>
                                <Field
                                    type="checkbox"
                                    name="carCheck"
                                    checked={values.carCheck}
                                    onChange={handleChange}
                                    style={{width: 'max-content'}}
                                />
                                <label style={{marginTop: '5px'}}>Avtomobillə gələcəklər?</label>
                            </div>
                            {values.carCheck && (
                                <div className="col-6">
                                    <label>Avtomobil Nömrəsi</label>
                                    <Field
                                        type="text"
                                        name="carNumber"
                                        placeholder="Avtomobil nömrəsi"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.carNumber}
                                    />
                                    <ErrorMessage name="carNumber" component="div"
                                                  style={{color: 'red', marginTop: '5px'}}/>
                                </div>
                            )}
                        </div>

                        <div className="formBtnWrapper">
                            <Button className="formBtn cancelBtn" onClick={() => handleCancel(resetForm)}>İmtina
                                Et</Button>
                            <Button htmlType="submit" className="formBtn">Yadda Saxla</Button>
                        </div>
                    </Form>
                )}
            </Formik>

            <ToastContainer/>
        </div>
    );
}

export default AddAVisitor;
