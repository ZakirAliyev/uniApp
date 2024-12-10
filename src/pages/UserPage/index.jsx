import './index.scss'
import UserNavbar from "../../components/UserNavbar/index.jsx";
import UserFooter from "../../components/UserFooter/index.jsx";
import UserForm from "../../components/UserForm/index.jsx";
import {Helmet} from "react-helmet-async";

function UserPage() {
    return (
        <section id={"userPage"}>
            <Helmet>
                <title>BDU - Qeydiyyat səhifəsi</title>
            </Helmet>
            <UserNavbar/>
            <UserForm/>
            <UserFooter/>
        </section>
    );
}

export default UserPage;