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
                <title>BDU - Giriş və icazə sistemi</title>
            </Helmet>
            <UserNavbar/>
            <div className={"container3"}>
                <div className={"main"}>

                    <div className={"container2"}>
                        <div className={"wrapper"}>
                            <div className={"wrapper1"}>
                                <div>
                                    <h2>Giriş və icazə sistemi'nə xoş gəlmisiniz</h2>
                                    <p>Giriş sistemi, müasir təhlükəsizlik tələblərinə cavab verən innovativ bir həll
                                        yoludur.
                                        Giriş-çıxış fəaliyyətləri sistem tərəfindən izlənilir, bu da təhlükəsizlik
                                        vəziyyətinin
                                        real vaxtda monitorinqinə imkan tanıyır. İstifadəçi dostu interfeysi ilə,
                                        qapıdan
                                        giriş
                                        sistemimiz asanlıqla idarə olunur. Daha təhlükəsiz və rahat bir mühit üçün bizim
                                        "Giriş
                                        və icazə" sistemimizdən istifadə edin!</p>
                                </div>
                                <div style={{
                                    marginTop: "10px",
                                }}>
                                    <Link to={`/login`} className={"button"}>Giriş üçün</Link>
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
