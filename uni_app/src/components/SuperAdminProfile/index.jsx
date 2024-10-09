import './index.scss';
import { useGetAdminProfileDataQuery, usePutAdminProfileDataMutation } from "../../services/usersApi.jsx";
import { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import { Bounce, toast } from "react-toastify";

const SuperAdminProfile = () => {
    const { data, isFetching } = useGetAdminProfileDataQuery();
    const [profileData, setProfileData] = useState({
        imgUrl: '',        // Add imgUrl field
        position: '',      // Add position field
        fatherName: '',    // Add fatherName field (if not already included)
        roomNumber: '',    // Add roomNumber field
    });
    const [putAdminProfileData] = usePutAdminProfileDataMutation();

    useEffect(() => {
        if (data) {
            setProfileData(data);
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const response = await putAdminProfileData(profileData).unwrap();
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
            toast.error(error.data.message || "An error occurred", {
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

    // Show loading state while fetching data
    if (isFetching) {
        return <div>Loading...</div>;
    }

    return (
        <section id="superAdminProfile">
            <h2>Profile</h2>
            <div className="profile-info">
                <div className="profile-item">
                    <strong>Name:</strong>
                    <Input
                        className="input-field" // Add a class for styling
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                        size="large"
                    />
                </div>
                <div className="profile-item">
                    <strong>Surname:</strong>
                    <Input
                        className="input-field" // Add a class for styling
                        name="surname"
                        value={profileData.surname}
                        onChange={handleChange}
                        size="large"
                    />
                </div>
                <div className="profile-item">
                    <strong>Father's Name:</strong>
                    <Input
                        className="input-field" // Add a class for styling
                        name="fatherName"
                        value={profileData.fatherName || ""}
                        onChange={handleChange}
                        size="large"
                    />
                </div>
                <div className="profile-item">
                    <strong>Position:</strong>
                    <Input
                        className="input-field" // Add a class for styling
                        name="position"   // Ensure this matches your API's expected field name
                        value={profileData.position || ""}
                        onChange={handleChange}
                        size="large"
                    />
                </div>
                <div className="profile-item">
                    <strong>ImgUrl:</strong>
                    <Input
                        className="input-field" // Add a class for styling
                        name="imgUrl"     // Ensure this matches your API's expected field name
                        value={profileData.imgUrl || ""}
                        onChange={handleChange}
                        size="large"
                    />
                </div>
                <div className="profile-item">
                    <strong>Phone Number:</strong>
                    <Input
                        className="input-field" // Add a class for styling
                        type="tel"
                        name="phoneNumber"
                        value={profileData.phoneNumber || ""}
                        onChange={handleChange}
                        size="large"
                    />
                </div>
                <div className="profile-item">
                    <strong>Room Number:</strong>
                    <Input
                        className="input-field" // Add a class for styling
                        name="roomNumber"  // Ensure this matches your API's expected field name
                        value={profileData.roomNumber || ""}
                        onChange={handleChange}
                        size="large"
                    />
                </div>
                <div className="profile-item">
                    <strong>Created Date:</strong>
                    <Input
                        className="input-field" // Add a class for styling
                        name="createdDateFormatted"
                        value={profileData.createdDateFormatted}
                        readOnly
                        size="large"
                    />
                </div>
            </div>
            <Button
                onClick={handleSave}
                type="primary"
                size="large"
                className="save-button"
                style={{ marginTop: '20px' }}
            >
                Save
            </Button>
        </section>
    );
};

export default SuperAdminProfile;
