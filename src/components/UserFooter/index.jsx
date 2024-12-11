import './index.scss'
import {FaFacebook, FaPhoneAlt, FaPhoneVolume, FaTelegram, FaTwitter, FaYoutube} from "react-icons/fa";
import {IoMdMail} from "react-icons/io";
import {IoLocationSharp} from "react-icons/io5";
import {PiMailboxFill} from "react-icons/pi";
import {Link} from "react-router-dom";

function UserFooter() {
    return (
        <section id={"userFooter"}>
            <div className={"container1"}>
                <div className={"menu row"}>
                    <div className={"col-4 col-md-4 col-sm-4 col-xs-12"}>
                        <h2>Ünvan</h2>
                        <div className={"box"}>
                            <PiMailboxFill/>
                            <span>AZ 1148</span>
                        </div>
                        <div className={"box"}>
                            <IoLocationSharp/>
                            <span>Bakı şəhəri, akademik Zahid Xəlilov küçəsi 33</span>
                        </div>
                    </div>
                    <div className={"col-4 col-md-4 col-sm-4 col-xs-12"}>
                        <h2>Əlaqə</h2>
                        <div className={"box"}>
                            <FaPhoneAlt/>
                            <span>+994 (012) 539 11 46</span>
                        </div>
                    </div>
                    <div className={"col-4 col-md-4 col-sm-4 col-xs-12"}>
                        <h2>E-Mail</h2>
                        <div className={"box"}>
                            <IoMdMail/>
                            <span>cit@bsu.edu.az</span>
                        </div>
                    </div>
                </div>
                <div className={"icons"}>
                    <Link to={"https://www.facebook.com/bdu.eduaz1919"} className={"icon"}><FaFacebook/></Link>
                    <Link to={"https://t.me/s/bdu_eduaz"} className={"icon"}><FaTelegram/></Link>
                    <Link to={"https://x.com/bdu_eduaz"} className={"icon"}><FaTwitter/></Link>
                    <Link to={"https://www.youtube.com/@BakuStateUniversity"} className={"icon"}><FaYoutube/></Link>
                    <Link to={"http://bsu.edu.az/az/content/laq_vasitlri"} v className={"icon"}><IoMdMail/></Link>
                </div>
            </div>
            <div className={"bottomFooter"}>© 2024, Bakı Dövlət Universiteti</div>

        </section>
    );
}

export default UserFooter;