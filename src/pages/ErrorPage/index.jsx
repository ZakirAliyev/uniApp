import './index.scss';
import UserNavbar from "../../components/UserNavbar/index.jsx";
import banner from "/src/assets/banner.jpeg"
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import {FaArrowLeftLong} from "react-icons/fa6";

function ErrorPage() {
    return (
        <section id={"homePage"}>
            <Helmet>
                <title>BDU - Səhifə tapılmadı</title>
            </Helmet>
            <UserNavbar/>
            <div className={"container3"}>
                <div className={"main"}>
                    <div>
                        <img src={banner} alt={"Image"}/>
                    </div>
                    <div className={"container2"} style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        marginTop: '-250px'
                    }}>
                        <img src={"https://innews.media/uploads/news/2024-01/_innews_5516bb3343f08a1381fcd09db_o.jpg"}
                             alt={"Image"} style={{
                                 height: '250px'
                        }}/>
                        <div className={"text1"}>Səhifə tapılmadı</div>
                        <div className={"text2"}>Axtardığınız səhifə tapılmadı.</div>
                        <div className={"text2"}>Aşağıdan ana səhifəyə qayıda bilərsiniz.</div>
                        <Link  className={"button1"}><FaArrowLeftLong className={"icon1"}/>
                            Ana səhifəyə qayıt</Link>
                    </div>
                    <div>
                        <img src={banner} alt={"Image"}/>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ErrorPage;
