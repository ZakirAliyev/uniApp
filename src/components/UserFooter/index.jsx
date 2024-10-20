import './index.scss'
import {FaFacebook, FaPhoneAlt, FaPhoneVolume, FaTelegram, FaTwitter, FaYoutube} from "react-icons/fa";
import {IoMdMail} from "react-icons/io";
import {IoLocationSharp} from "react-icons/io5";
import {PiMailboxFill} from "react-icons/pi";

function UserFooter() {
    return (
        <section id={"userFooter"}>
            <div className={"container1"}>
                <div className={"container"}>
                    <div className={"menu row"}>
                        <div className={"col-4 col-md-4 col-sm-4 col-xs-12"}>
                            <h2>Ünvan</h2>
                            <div className={"box"}>
                                <PiMailboxFill/>
                                <span>AZ1148</span>
                            </div>
                            <div className={"box"}>
                                <IoLocationSharp/>
                                <span>Akademik Zahid Xəlilov küçəsi-33</span>
                            </div>
                        </div>
                        <div className={"col-4 col-md-4 col-sm-4 col-xs-12"}>
                            <h2>Əlaqə</h2>
                            <div className={"box"}>
                                <FaPhoneAlt/>
                                <span>(+994 12)539 05 17</span>
                            </div>
                            <div className={"box"}>
                                <FaPhoneVolume/>
                                <span>Fax</span>
                                <span>(+9942 12)598 33 76</span>
                            </div>
                        </div>
                        <div className={"col-4 col-md-4 col-sm-4 col-xs-12"}>
                            <h2>E-Mail</h2>
                            <div className={"box"}>
                                <IoMdMail/>
                                <span>info@bsu.edu.az</span>
                            </div>
                            <div className={"box"}>
                                <IoMdMail/>
                                <span>zakiraliyev@bsu.edu.az</span>
                            </div>
                        </div>


                    </div>
                    <div className={"text"}>
                        Bu veb sayt, Bakı Dövlət Universiteti binasına giriş icazəsi üçün nəzərdə tutulmuşdur və bütün
                        qonaqların sistemdən asanlıqla istifadə etməsinə imkan tanıyır.
                    </div>
                    <div className={"icons"}>
                        <div className={"icon"}><FaFacebook/></div>
                        <div className={"icon"}><FaTelegram/></div>
                        <div className={"icon"}><FaTwitter/></div>
                        <div className={"icon"}><FaYoutube/></div>
                        <div className={"icon"}><IoMdMail/></div>
                    </div>
                </div>
            </div>
            <div className={"bottomFooter"}>© 2024, Bakı Dövlət Universiteti</div>

        </section>
    );
}

export default UserFooter;