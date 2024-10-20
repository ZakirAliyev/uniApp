import './index.scss'

function UserForm() {
    return (
        <section id={"userForm"}>
            <div className={"container1"}>
                <div className={"row"}>
                    <div className={"col-6 col-md-6 col-sm-12 col-xs-12"}>
                        <h2>Neden bu kadar ciddisin?</h2>
                    </div>
                    <div className={"col-6 col-md-6 col-sm-12 col-xs-12"}>
                        <form>
                            <div className={"row"}>
                                <div className={"col-6 col-md-6 col-sm-12 col-xs-12 wrapper"}>
                                    <label>Ad</label>
                                    <input placeholder={"Ad"}/>
                                </div>
                                <div className={"col-6 col-md-6 col-sm-12 col-xs-12 wrapper"}>
                                    <label>Soyad</label>
                                    <input placeholder={"Soyad"}/>
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col-6 col-md-6 col-sm-12 col-xs-12 wrapper"}>
                                    <label>Email</label>
                                    <input placeholder={"Email"} type={"email"}/>
                                </div>
                                <div className={"col-6 col-md-6 col-sm-12 col-xs-12 wrapper"}>
                                    <label>Gəliş tarixi</label>
                                    <input type={"date"}/>
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col-12 col-md-6 col-sm-12 col-xs-12 wrapper"}>
                                    <label>Gəliş səbəbi</label>
                                    <textarea placeholder={"Təsvir"} rows={5}/>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default UserForm;