import './index.scss'
import SuperAdminMenu from "../../components/SuperAdminMenu/index.jsx";
import {Helmet} from "react-helmet-async";

function SuperAdminPage() {
    return (
        <section id={"superAdminPage"}>
            <Helmet>
                <title>BDU - Super Admin səhifəsi</title>
            </Helmet>
            <SuperAdminMenu/>
        </section>
    );
}

export default SuperAdminPage;