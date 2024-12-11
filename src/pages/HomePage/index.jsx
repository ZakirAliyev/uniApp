import './index.scss';
import UserNavbar from "../../components/UserNavbar/index.jsx";
import video1 from "/src/assets/video.mp4"
import banner from "/src/assets/banner.jpeg"
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet-async";

function HomePage() {
    return (
        <section id={"homePage"}>
            <Helmet>
                <title>BDU Giriş-çıxışa nəzarət sistemi</title>
            </Helmet>
            <UserNavbar/>
            <div className={"container3"}>
                <div className={"main"}>

                    <div className={"container2"}>
                        <div className={"wrapper"}>
                            <div className={"wrapper1"}>
                                <div>
                                    <h2>Giriş-çıxışa nəzarət sistemi'nə xoş gəlmisiniz</h2>
                                    <p>Giriş-çıxışa nəzarət sistemi, müasir təhlükəsizlik tələblərinə cavab verən innovativ bir həll yoludur. Sistem, giriş-çıxış fəaliyyətlərini real vaxt rejimində izləyir və təhlükəsizlik vəziyyətinin tam monitorinqini həyata keçirir.</p>
                                </div>
                                <div style={{
                                    marginTop: "10px",
                                }}>
                                    <Link to={`/login`} className={"button"}>Giriş</Link>
                                </div>
                            </div>
                            <video src={video1} controls/>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default HomePage;
