import './index.scss'
import AdminMenu from "../../components/AdminMenu/index.jsx";
import {Helmet} from "react-helmet-async";

function AdminPage() {
    return (
        <section id={"adminPage"}>
            <Helmet>
                <title>BDU - Admin səhifəsi</title>
            </Helmet>
            <AdminMenu/>
        </section>
    );
}

export default AdminPage;