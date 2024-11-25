import React, {useState, useEffect} from 'react';
import './index.scss';
import {Button, Form, Input} from "antd";
import {useGetSecurityProfileDataQuery, usePutAdminProfileDataMutation} from "../../services/usersApi.jsx";
import {Bounce, toast, ToastContainer} from "react-toastify";

const SecurityProfileSection = () => {
    const [form] = Form.useForm(); // Create form instance
    const {data: getSecurityProfileData} = useGetSecurityProfileDataQuery();
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
                roomNumber: getSecurityProfileData.roomNumber,
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
            console.error("Redaktə edərkən xəta baş verdi!", error);
        }
    };

    return (
        <section id="securityProfileSection">
            <h2 style={{margin: '10px 0 40px'}}>Profil məlumatları</h2>
            <Form
                form={form}
                onFinish={handleSave}
                layout="vertical"
                initialValues={{
                    id: '', // ID alanı eklendi
                    name: '',
                    surname: '',
                    fatherName: '',
                    email: '',
                    phoneNumber: '',
                    position: '',
                    imgUrl: '',
                    createdDateFormatted: '',
                }}
            >
                {/* ID alanı - hidden */}
                <Form.Item name="id" hidden>
                    <Input type="hidden"/>
                </Form.Item>

                <div className="labelWrapper">
                    <label>Ad</label>
                    <Form.Item
                        name="name"
                        rules={[{required: true, message: 'Ad tələb olunur'}]}
                    >
                        <Input size="large" placeholder="Ad" className="profileInput"/>
                    </Form.Item>
                </div>

                <div className="labelWrapper">
                    <label>Soyad</label>
                    <Form.Item
                        name="surname"
                        rules={[{required: true, message: 'Soyad tələb olunur'}]}
                    >
                        <Input size="large" placeholder="Soyad" className="profileInput"/>
                    </Form.Item>
                </div>

                <div className="labelWrapper">
                    <label>Ata adı</label>
                    <Form.Item
                        name="fatherName"
                        rules={[{required: true, message: "Ata adı tələb olunur"}]}
                    >
                        <Input size="large" placeholder="Ata adı" className="profileInput"/>
                    </Form.Item>
                </div>

                <div className="labelWrapper">
                    <label>Email</label>
                    <Form.Item
                        name="email"
                        rules={[
                            {required: true, message: 'Email tələb olunur'},
                            {type: 'email', message: 'Email yalnışdır'},
                        ]}
                    >
                        <Input size="large" placeholder="Email" className="profileInput"/>
                    </Form.Item>
                </div>

                <div className="labelWrapper">
                    <label>Mobil nömrə</label>
                    <Form.Item
                        name="phoneNumber"
                        rules={[{required: true, message: 'Mobil nömrə tələb olunur'}]}
                    >
                        <Input size="large" placeholder="Mobil nömrə" className="profileInput"/>
                    </Form.Item>
                </div>

                <div className="labelWrapper">
                    <label>Vəzifə</label>
                    <Form.Item
                        name="position"
                        rules={[{required: true, message: 'Vəzifə tələb olunur'}]}
                    >
                        <Input size="large" placeholder="Vəzifə" className="profileInput"/>
                    </Form.Item>
                </div>

                <div className="labelWrapper">
                    <label>Yaradılma tarixi</label>
                    <Form.Item
                        name="createdDateFormatted"
                    >
                        <Input size="large" disabled placeholder="Yaradılma tarixi" className="profileInput"/>
                    </Form.Item>
                </div>

                <div className="labelWrapper">
                    <label>Otaq nömrəsi</label>
                    <Form.Item
                        name="roomNumber"
                    >
                        <Input size="large" disabled placeholder="Otaq nömrəsi" className="profileInput"/>
                    </Form.Item>
                </div>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="saveButton"
                        size="large"
                    >
                        Yadda saxla
                    </Button>
                </Form.Item>
            </Form>
            <ToastContainer/>
        </section>
    );
};

export default SecurityProfileSection;
