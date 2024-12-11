import './index.scss';
import banner from './banner.jpeg';
import {useGetAllAdminsQuery, usePostNewVisitorMutation} from "../../services/usersApi.jsx";
import {useFormik} from "formik";
import {Bounce, toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {useEffect, useState} from "react";
import {PulseLoader} from "react-spinners";
import {Link} from "react-router-dom";
import {FaArrowLeftLong} from "react-icons/fa6";
import Cookies from "js-cookie";

function UserForm() {
    const {data: getAllAdmins} = useGetAllAdminsQuery();
    const dataSource = getAllAdmins?.data;

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 16);

    const [postNewVisitor] = usePostNewVisitorMutation();
    const [loading, setLoading] = useState(false);
    const [comingByCar, setComingByCar] = useState(false);

    useEffect(() => {
        if (!comingByCar) {
            formik.setFieldValue("carNumber", "");
        }
    }, [comingByCar]);

    const formik = useFormik({
        initialValues: {
            name: '',
            surname: '',
            description: '',
            carNumber: '',
            visitedDate: formattedDate,
            adminId: '',
            isRepeated: false,
            phoneNumber: '',
        },
        onSubmit: async values => {
            setLoading(true);
            const date = new Date(values.visitedDate);
            const formattedDate = date.toLocaleDateString('tr-TR') + ' ' + date.toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit'
            });

            try {
                let isRepeated = values.isRepeated === 'true';
                const response = await postNewVisitor({
                    name: values.name,
                    surname: values.surname,
                    description: values.description,
                    carNumber: values.carNumber,
                    adminId: values.adminId,
                    isRepeated,
                    visitedDate: formattedDate,
                    phoneNumber: "+994" + values.phoneNumber,
                }).unwrap();

                if (response?.statusCode === 200) {
                    toast.success(response?.message, {
                        position: "bottom-right",
                        autoClose: 2500,
                        theme: "dark",
                        transition: Bounce,
                    });
                }
            } catch (error) {
                console.log(error?.data);
                toast.error(error?.data?.error, {
                    position: "bottom-right",
                    autoClose: 2500,
                    theme: "dark",
                    transition: Bounce,
                });
            }

            setLoading(false);
        },
    });

    // <div className={"col-2 banner"}>
    //     <img
    //         src={banner}
    //         alt={"Image"} style={{
    //         width: '100%',
    //         height: '100%'
    //     }}/>
    // </div>

    return (
        <section id={"userForm"}>
            <div className={"container1"}>
                <div className={"row"}>
                    <div className={"col-12"} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <form onSubmit={formik.handleSubmit}>
                            <div className={"row"}>
                                <div className={"col-6 wrapper"}>
                                    <label>Gələn qonağın adı</label>
                                    <input
                                        placeholder={"Ad"}
                                        required
                                        name="name"
                                        onChange={formik.handleChange}
                                        value={formik.values.name}
                                    />
                                </div>
                                <div className={"col-6 wrapper"}>
                                    <label>Gələn qonağın soyadı</label>
                                    <input
                                        placeholder={"Soyad"}
                                        required
                                        name="surname"
                                        onChange={formik.handleChange}
                                        value={formik.values.surname}
                                    />
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col-6 wrapper"}>
                                    <label>Mobil nömrə</label>
                                    <div style={{
                                        position: 'relative'
                                    }}>
                                    <span style={{
                                        position: 'absolute',
                                        top: '10px',
                                        left: '20px',
                                        fontSize: '14px',
                                        color: '#A99674',
                                        fontWeight: '500',
                                    }}>+994</span>
                                        <input
                                            style={{
                                                width: '100%',
                                                paddingLeft: '60px',
                                            }}
                                            placeholder={"Məsələn: 501234567"}
                                            required
                                            name="phoneNumber"
                                            maxLength={9}
                                            onChange={formik.handleChange}
                                            value={formik.values.phoneNumber}
                                        />
                                    </div>
                                </div>
                                <div className={"col-6 wrapper"}>
                                    <label>Məsul şəxs</label>
                                    <select
                                        required
                                        name="adminId"
                                        onChange={formik.handleChange}
                                        value={formik.values.adminId}
                                    >
                                        <option value="">Müəllim seçin</option>
                                        {dataSource && dataSource.map((admin) => (
                                            <option key={admin.id}
                                                    value={admin.id}>{admin.name}
                                                {" " + admin.surname}
                                                {" " + admin.fatherName}
                                                {" - " + admin.facultyName || ""}
                                                {" - " + admin.departmentName || ""}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col-6 wrapper"}>
                                    <label>Gəliş tarixi və saatı</label>
                                    <input
                                        type={"datetime-local"}
                                        required
                                        name="visitedDate"
                                        onChange={formik.handleChange}
                                        value={formik.values.visitedDate}
                                    />
                                </div>
                                <div className={"col-6 wrapper"}>
                                    <label>Təkrarla</label>
                                    <select
                                        required
                                        name="isRepeated"
                                        onChange={formik.handleChange}
                                        value={formik.values.isRepeated ? "true" : "false"}
                                    >
                                        <option value="false">Bir dəfə</option>
                                        <option value="true">Hər həftə</option>
                                    </select>
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col-6 wrapper"} style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'start',
                                    gap: '15px',
                                }}>
                                    <input
                                        type={"checkbox"}
                                        checked={comingByCar}
                                        onChange={(e) => setComingByCar(e.target.checked)}
                                    />
                                    <label style={{
                                        marginTop: "5px"
                                    }}>Avtomobil ilə gələcəkmi?</label>
                                </div>
                                {comingByCar && (
                                    <div className={"col-6 wrapper"}>
                                        <label>Avtomobil Nömrəsi</label>
                                        <input
                                            placeholder={"Məsələn: 77-AA-777"}
                                            required
                                            name="carNumber"
                                            onChange={formik.handleChange}
                                            value={formik.values.carNumber}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className={"row"}>
                                <div className={"col-12 wrapper"}>
                                    <label>Gəliş səbəbi</label>
                                    <textarea
                                        placeholder={"Təsvir"}
                                        rows={5}
                                        required
                                        name="description"
                                        onChange={formik.handleChange}
                                        value={formik.values.description}
                                    />
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col-12 wrapper btntbn"}>
                                    <button type="submit">
                                        {loading ? (
                                            <PulseLoader size={8} color={'white'}/>
                                        ) : (
                                            <>Göndər</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </section>
    );
}

export default UserForm;

