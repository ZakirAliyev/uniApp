import React, { useState, useEffect } from 'react';
import './index.scss';
import { Button, Form, Input } from "antd";
import { useGetSecurityProfileDataQuery, usePutAdminProfileDataMutation } from "../../services/usersApi.jsx";
import { Bounce, toast } from "react-toastify";

const SecurityProfileSection = () => {
    const [form] = Form.useForm(); // Create form instance
    const { data: getSecurityProfileData } = useGetSecurityProfileDataQuery();
    const [putAdminProfileData] = usePutAdminProfileDataMutation();

    useEffect(() => {
        if (getSecurityProfileData) {
            form.setFieldsValue({
                id: getSecurityProfileData.id,
                name: getSecurityProfileData.name,
                surname: getSecurityProfileData.surname,
                fatherName: getSecurityProfileData.fatherName,
                email: getSecurityProfileData.email,
                phoneNumber: getSecurityProfileData.phoneNumber,
                position: getSecurityProfileData.position,
                imgUrl: getSecurityProfileData.imgUrl,
                createdDateFormatted: getSecurityProfileData.createdDateFormatted,
            });
        }
    }, [getSecurityProfileData, form]);

    const handleSave = async (values) => {
        try {
            const response = await putAdminProfileData(values).unwrap();
            if (response.statusCode === 200) {
                toast.success(response?.message, {
                    position: "bottom-right",
                    autoClose: 2500,
                    theme: "dark",
                    transition: Bounce,
                });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <section id="securityProfileSection">
            <h2>Profile</h2>
            <Form
                form={form}
                onFinish={handleSave}
                layout="vertical"
                initialValues={{
                    name: '',
                    surname: '',
                    fatherName: '',
                    email: '',
                    phoneNumber: '',
                    position: '',
                    imgUrl: '',
                    createdDateFormatted: ''
                }}
            >
                <div className="labelWrapper">
                    <label>Name</label>
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Name is required' }]}
                    >
                        <Input size="large" placeholder="Name" className={"profileInput"}/>
                    </Form.Item>
                </div>

                <div className="labelWrapper">
                    <label>Surname</label>
                    <Form.Item
                        name="surname"
                        rules={[{ required: true, message: 'Surname is required' }]}
                    >
                        <Input size="large" placeholder="Surname" className={"profileInput"}/>
                    </Form.Item>
                </div>

                <div className="labelWrapper">
                    <label>Father's Name</label>
                    <Form.Item
                        name="fatherName"
                        rules={[{ required: true, message: "Father's name is required" }]}
                    >
                        <Input size="large" placeholder="Father's Name" className={"profileInput"}/>
                    </Form.Item>
                </div>

                <div className="labelWrapper">
                    <label>Email</label>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Email is required' },
                            { type: 'email', message: 'Email format is invalid' },
                        ]}
                    >
                        <Input size="large" placeholder="Email" className={"profileInput"}/>
                    </Form.Item>
                </div>

                <div className="labelWrapper">
                    <label>Phone Number</label>
                    <Form.Item
                        name="phoneNumber"
                        rules={[{ required: true, message: 'Phone number is required' }]}
                    >
                        <Input size="large" placeholder="Phone Number" className={"profileInput"}/>
                    </Form.Item>
                </div>

                <div className="labelWrapper">
                    <label>Position</label>
                    <Form.Item
                        name="position"
                        rules={[{ required: true, message: 'Position is required' }]}
                    >
                        <Input size="large" placeholder="Position" className={"profileInput"}/>
                    </Form.Item>
                </div>

                <div className="labelWrapper">
                    <label>Image URL</label>
                    <Form.Item
                        name="imgUrl"
                        rules={[{ required: true, message: 'Image URL is required' }]}
                    >
                        <Input size="large" placeholder="Image URL" className={"profileInput"}/>
                    </Form.Item>
                </div>

                <div className="labelWrapper">
                    <label>Created Date</label>
                    <Form.Item
                        name="createdDateFormatted"
                    >
                        <Input size="large" disabled placeholder="Created Date" className={"profileInput"}/>
                    </Form.Item>
                </div>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="saveButton"
                        size="large"
                    >
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </section>
    );
};

export default SecurityProfileSection;
