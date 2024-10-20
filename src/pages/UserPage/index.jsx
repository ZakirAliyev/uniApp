import './index.scss'
import UserNavbar from "../../components/UserNavbar/index.jsx";
import UserBanner from "../../components/UserBanner/index.jsx";
import UserFooter from "../../components/UserFooter/index.jsx";
import UserForm from "../../components/UserForm/index.jsx";

function UserPage() {
    return (
        <section id={"userPage"}>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <UserNavbar/>
            <UserBanner/>
            <UserForm/>
            <UserFooter/>
        </section>
    );
}

export default UserPage;