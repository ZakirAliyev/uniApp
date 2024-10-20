import './index.scss'
import React from 'react';

function UserNavbar() {
    return (
        <section id={"userNavbar"}>

            <div className={"container1"}>
                <nav>
                    <div className={"logo"}>
                        <img
                            src={"https://bdu.info.az/storage/photos/44/MED%C4%B0AK%C4%B0T/0-Baki%20Dovlet%20Universiteti.png"}
                            alt={"Logo"}/>
                    </div>
                    <div className={"logo2"}>
                        <img
                            src={"https://bdu.info.az/assets/img/svg/bsu-icon.svg"}
                            alt={"Logo"}/>
                    </div>
                    <div className={"name"}>
                        <span className={"first"}>AZƏRBAYCAN RESPUBLIKASININ ELM VƏ TƏHSİL NAZİRLİYİ</span>
                        <span className={"last"}>BAKI DÖVLƏT UNİVERSİTETİ</span>
                        <span className={"first1"}>Giriş və icazə sistemi</span>
                    </div>
                    <div className={"logo1"}>
                        <img
                            src={"https://bdu.info.az/assets/img/svg/bsu-icon.svg"}
                            alt={"Logo"}/>
                        1919
                    </div>
                </nav>
            </div>
        </section>
    );
}

export default UserNavbar;