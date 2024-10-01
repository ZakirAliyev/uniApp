import { Form, Input, Checkbox, Button } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './index.scss';

const { TextArea } = Input;

function AddAVisitor() {
    const formik = useFormik({
        initialValues: {
            visitorName: '',
            visitorSurname: '',
            visitorEmail: '',
            description: '',
            carCheck: false,
            carNumber: '',
        },
        validationSchema: Yup.object({
            visitorName: Yup.string().required('Please input visitor name!'),
            visitorSurname: Yup.string().required('Please input visitor surname!'),
            visitorEmail: Yup.string().email('Please input a valid email!').required('Please input a valid email!'),
            description: Yup.string().required('Please provide a description!'),
            carNumber: Yup.string().when('carCheck', {
                is: true,
                then: Yup.string().required('Please input car number!'),
            }),
        }),
        onSubmit: (values) => {
            // Handle form submission
            console.log(values);
        },
    });

    const handleCheckboxChange = (e) => {
        formik.setFieldValue('carCheck', e.target.checked);
        if (!e.target.checked) {
            formik.setFieldValue('carNumber', ''); // Reset car number if checkbox is unchecked
        }
    };

    return (
        <Form className="wrapper" onFinish={formik.handleSubmit}>
            <h2>Add new visitor</h2>
            <Form.Item
                name="visitorName"
                validateStatus={formik.touched.visitorName && formik.errors.visitorName ? 'error' : ''}
                help={formik.touched.visitorName && formik.errors.visitorName}
            >
                <div className="box" style={{ marginTop: '30px' }}>
                    <label>
                        <span style={{ color: 'red' }}>* </span>Visitor name
                    </label>
                    <Input
                        className="input"
                        size="large"
                        name="visitorName"
                        placeholder="Visitor name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.visitorName}
                    />
                </div>
            </Form.Item>

            <Form.Item
                name="visitorSurname"
                validateStatus={formik.touched.visitorSurname && formik.errors.visitorSurname ? 'error' : ''}
                help={formik.touched.visitorSurname && formik.errors.visitorSurname}
            >
                <div className="box">
                    <label>
                        <span style={{ color: 'red' }}>* </span>Visitor surname
                    </label>
                    <Input
                        className="input"
                        size="large"
                        name="visitorSurname"
                        placeholder="Visitor surname"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.visitorSurname}
                    />
                </div>
            </Form.Item>

            <Form.Item
                name="visitorEmail"
                validateStatus={formik.touched.visitorEmail && formik.errors.visitorEmail ? 'error' : ''}
                help={formik.touched.visitorEmail && formik.errors.visitorEmail}
            >
                <div className="box">
                    <label>
                        <span style={{ color: 'red' }}>* </span>Visitor email
                    </label>
                    <Input
                        className="input"
                        size="large"
                        name="visitorEmail"
                        placeholder="Visitor email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.visitorEmail}
                    />
                </div>
            </Form.Item>

            <Form.Item
                name="description"
                validateStatus={formik.touched.description && formik.errors.description ? 'error' : ''}
                help={formik.touched.description && formik.errors.description}
            >
                <div className="box">
                    <label>
                        <span style={{ color: 'red' }}>* </span>Description
                    </label>
                    <TextArea
                        className="input"
                        rows={4}
                        size="large"
                        name="description"
                        placeholder="Description"
                        style={{ resize: 'none' }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                    />
                </div>
            </Form.Item>

            <Form.Item name="carCheck" valuePropName="checked">
                <div className="box">
                    <label>
                        Will he/she come by car?
                    </label>
                    <Checkbox
                        onChange={handleCheckboxChange}
                        checked={formik.values.carCheck}
                    />
                </div>
            </Form.Item>

            {formik.values.carCheck && (
                <Form.Item
                    name="carNumber"
                    validateStatus={formik.touched.carNumber && formik.errors.carNumber ? 'error' : ''}
                    help={formik.touched.carNumber && formik.errors.carNumber}
                >
                    <div className="box">
                        <label>
                            <span style={{ color: 'red' }}>* </span>Car number
                        </label>
                        <Input
                            className="input"
                            size="large"
                            name="carNumber"
                            placeholder="Car number"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.carNumber}
                        />
                    </div>
                </Form.Item>
            )}

            <div className="buttonWrapper" style={{ display: 'flex', gap: '10px' }}>
                <Button size="large" type="primary" htmlType="submit">Save</Button>
                <Button size="large" className="buttonSave" type="primary">Save and exit</Button>
                <Button size="large" className="buttonSave" type="primary" danger>Cancel</Button>
            </div>
        </Form>
    );
}

export default AddAVisitor;
