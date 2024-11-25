import './index.scss'
import SecurityMenu from "../../components/SecurityMenu/index.jsx";
import {Helmet} from "react-helmet-async";

function SecurityPage() {
    return (
        <section id={"securityPage"}>
            <Helmet>
                <title>BDU - Mühafizə səhifəsi</title>
            </Helmet>
            <SecurityMenu/>
        </section>
    );
}

export default SecurityPage;