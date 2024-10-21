import './index.scss';
import {useGetAllAdminsQuery, usePostNewVisitorMutation} from "../../services/usersApi.jsx";
import {useFormik} from "formik";
import {Bounce, toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {useState} from "react";
import {PulseLoader} from "react-spinners";

function UserForm() {
    const {data: getAllAdmins} = useGetAllAdminsQuery();
    const dataSource = getAllAdmins?.data;

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 16);

    const [postNewVisitor] = usePostNewVisitorMutation()

    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            surname: '',
            email: '',
            description: '',
            carNumber: '',
            visitedDate: formattedDate,
            adminId: '',
            isRepeated: false,
        },
        onSubmit: async values => {
            setLoading(true)
            const date = new Date(values.visitedDate);
            const formattedDate = date.toLocaleDateString('tr-TR') + ' ' + date.toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            try {
                const response = await postNewVisitor({
                    name: values.name,
                    surname: values.surname,
                    email: values.email,
                    description: values.description,
                    carNumber: values.carNumber,
                    adminId: values.adminId,
                    isRepeated: values.isRepeated,
                    visitedDate: formattedDate,
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
            setLoading(false)
        },
    });


    return (
        <section id={"userForm"}>
            <div className={"container1"}>
                <div className={"row"}>
                    <div className={"col-6 col-md-6 col-sm-12 col-xs-12"}>
                        <div className={"image"}>
                            <h2>Giriş və icazə sisteminə qeydiyyat</h2>
                            <div className={"span"}>
                                Giriş sistemi, müasir təhlükəsizlik tələblərinə cavab verən innovativ bir həll yoludur.
                                Giriş-çıxış fəaliyyətləri sistem tərəfindən izlənilir, bu da təhlükəsizlik vəziyyətinin
                                real vaxtda monitorinqinə imkan tanıyır. İstifadəçi dostu interfeysi ilə, qapıdan giriş
                                sistemimiz asanlıqla idarə olunur. Daha təhlükəsiz və rahat bir mühit
                                üçün bizim "Giriş və icazə" sistemimizdən istifadə edin!
                            </div>
                        </div>
                    </div>
                    <div className={"col-6 col-md-6 col-sm-12 col-xs-12"}>
                        <form onSubmit={formik.handleSubmit}>
                            <div className={"row"}>
                                <div className={"col-6 col-md-6 col-sm-12 col-xs-12 wrapper"}>
                                    <label>Ad</label>
                                    <input
                                        placeholder={"Ad"}
                                        required
                                        name="name"
                                        onChange={formik.handleChange}
                                        value={formik.values.name}
                                    />
                                </div>
                                <div className={"col-6 col-md-6 col-sm-12 col-xs-12 wrapper"}>
                                    <label>Soyad</label>
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
                                <div className={"col-6 col-md-6 col-sm-12 col-xs-12 wrapper"}>
                                    <label>Email</label>
                                    <input
                                        placeholder={"Email"}
                                        type={"email"}
                                        required
                                        name="email"
                                        onChange={formik.handleChange}
                                        value={formik.values.email}
                                    />
                                </div>
                                <div className={"col-6 col-md-6 col-sm-12 col-xs-12 wrapper"}>
                                    <label>Müəllim</label>
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
                                <div className={"col-6 col-md-6 col-sm-12 col-xs-12 wrapper"}>
                                    <label>Gəliş tarixi və saatı</label>
                                    <input
                                        type={"datetime-local"}
                                        required
                                        name="visitedDate"
                                        onChange={formik.handleChange}
                                        value={formik.values.visitedDate}
                                        min={formattedDate.slice(0, 10) + "T08:00"}
                                        max={formattedDate.slice(0, 10) + "T17:00"}
                                    />
                                </div>
                                <div className={"col-6 col-md-6 col-sm-12 col-xs-12 wrapper"}>
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
                                <div className={"col-12 col-md-12 col-sm-12 col-xs-12 wrapper"}>
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
                                <div className={"col-12 wrapper"}>
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
