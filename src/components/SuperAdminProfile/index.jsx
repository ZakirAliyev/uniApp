import './index.scss';
import {useEffect, useState} from 'react';
import {useGetAdminProfileDataQuery, usePutAdminProfileDataMutation} from "../../services/usersApi.jsx";
import {Input, Button} from 'antd';
import {Bounce, toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const SuperAdminProfile = () => {
    const {data: profileData, isFetching} = useGetAdminProfileDataQuery();
    const [putAdminProfileData] = usePutAdminProfileDataMutation();

    // Azərbaycan dilində sahə başlıqları
    const fieldLabels = {
        email: "E-poçt",
        name: "Ad",
        surname: "Soyad",
        fatherName: "Ata adı",
        position: "Vəzifə",
        phoneNumber: "Telefon nömrəsi",
        roomNumber: "Otaq nömrəsi",
        createdDateFormatted: "Yaradılma tarixi",
    };

    // Form məlumatlarını idarə etmək üçün lokal state
    const [formData, setFormData] = useState({
        id: '',
        email: '',
        name: '',
        surname: '',
        fatherName: '',
        position: '',
        phoneNumber: '',
        roomNumber: '',
        createdDateFormatted: ''
    });

    // Fetched məlumatlarla form state-ni yeniləyin
    useEffect(() => {
        if (profileData) {
            setFormData({
                id: profileData.id || '',
                email: profileData.email || '',
                name: profileData.name,
                surname: profileData.surname,
                fatherName: profileData.fatherName || '',
                position: profileData.position || '',
                phoneNumber: profileData.phoneNumber || '',
                roomNumber: profileData.roomNumber || '',
                createdDateFormatted: profileData.createdDateFormatted
            });
        }
    }, [profileData]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSave = async () => {
        try {
            const response = await putAdminProfileData(formData).unwrap();
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
        } catch (error) {
            toast.error(error.data.error || "Xəta baş verdi!", {
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

    if (isFetching) {
        return <div>Yüklənir...</div>;
    }

    return (
        <section id="superAdminProfile">
            <h2>Profil məlumatları</h2>
            <div className="profile-info">
                {Object.entries(formData).map(([key, value]) => (
                    <div className="profile-item" key={key} style={{
                        display: key !== 'id' ? '' : 'none',
                    }}>
                        <strong>{fieldLabels[key] || key}:</strong>
                        <Input
                            className="input-field"
                            name={key}
                            value={value}
                            onChange={handleChange}
                            size="large"
                            disabled={key === 'createdDateFormatted' || key === 'id' || key === "email"} // Disable both id and createdDateFormatted
                        />
                    </div>
                ))}
            </div>
            <Button
                onClick={handleSave}
                type="primary"
                size="large"
                className="save-button"
                style={{marginTop: '20px'}}
            >
                Saxla
            </Button>
            <ToastContainer/>
        </section>
    );
};

export default SuperAdminProfile;
