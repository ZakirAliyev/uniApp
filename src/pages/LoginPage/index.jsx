import './index.scss';
import {Col, Row} from "antd";
import LoginTabs from "../../components/LoginTabs/index.jsx";
import {Helmet} from "react-helmet-async";

function LoginPage() {
    return (
        <section id={"loginPage"}>
            <Helmet>
                <title>BDU - Giriş səhifəsi</title>
            </Helmet>
            <div className={"lane"}></div>
            <div className={"container"}>
                <Row gutter={[16, 16]} justify="center" align="middle">
                    <Col xs={24} sm={24} md={12} className={"col col1"}>
                        <img
                            src={"https://bdu.info.az/storage/photos/44/MED%C4%B0AK%C4%B0T/0-Baki%20Dovlet%20Universiteti.png"}
                            alt={"Image"}
                            className="responsive-image"
                        />
                    </Col>
                    <Col xs={24} sm={24} md={12} className={"col col2"}>
                        <div className={"wrapper"}>
                            <div className={"img"}>
                                <img
                                    src={"https://bdu.info.az/storage/photos/44/MED%C4%B0AK%C4%B0T/0-Baki%20Dovlet%20Universiteti.png"}
                                    alt={"Image"}
                                    height={130}
                                />
                            </div>
                            <div className={"bsu"}>BAKI DÖVLƏT UNİVERSİTETİ</div>
                            <LoginTabs/>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className={"lane"}></div>
        </section>
    );
}

export default LoginPage;
