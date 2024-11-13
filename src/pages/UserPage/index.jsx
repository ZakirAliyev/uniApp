import './index.scss'
import UserNavbar from "../../components/UserNavbar/index.jsx";
import UserBanner from "../../components/UserBanner/index.jsx";
import UserFooter from "../../components/UserFooter/index.jsx";
import UserForm from "../../components/UserForm/index.jsx";

function UserPage() {
    return (
        <section id={"userPage"}>
            <UserNavbar/>
            <UserBanner/>
            <UserForm/>
            <UserFooter/>
        </section>
    );
}

export default UserPage;