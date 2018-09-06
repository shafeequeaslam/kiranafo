import React, { Component } from 'react';
import classnames from 'classnames';
import './forgetpwd.css';
import FooterComponent from '../../components/Footer/footer';
// import { Link } from 'react-router-dom';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import nameIcon from '../../assets/name-icon@2x.png'
import passwordIcon from '../../assets/password-icon@2x.png';
import passwordIcon2 from '../../assets/reenterpsw.png'
import kiranalogo from '../../assets/Kirana logo.png';
import fb from '../../assets/FB.png';
import insta from '../../assets/Insta.png';
import twitter from '../../assets/Twitter.png';
import yt from '../../assets/YT.png';
import Axios from 'axios';

class Forgetpwd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: '1',
            OtpBtnActive: false,
            isLoggedIn: true, password: '',
        };
        this.changeBtnColor = this.changeBtnColor.bind(this);
    }
    componentDidMount() {
        let url = window.location.href;
        let url_string = url;
        let urlStr = new URL(url_string);
        let uid = urlStr.searchParams.get("uid");
        this.setState({
            uid: uid
        })
    }
    changeBtnColor() {
        this.setState({
            OtpBtnActive: true
        })
    }

    handleInput(e) {
        console.log(e.target.name, e.target.value)
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ [name]: value });
    }

    myFunction(e) {
        var x = document.getElementById("psw");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    }
    submitForm() {
        if (this.state.password === this.state.re_password) {
            let details = {
                password: this.state.password,
                uid: this.state.uid
            };
            let formBody = [];
            for (let property in details) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            Axios({
                url: 'https://cms.avenue11.com/kirana11_api/customer_app_api_resources/reset_password',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: formBody
            })
                .then((res) => {
                    console.log(res)
                    if (res.status === 200) {
                        window.location.href = '/login'
                    }

                })
                .catch((err) => {
                    console.log(err.response)
                })
        }
    }

    render() {

        return (
            <div className="login_container">
                <div className="login_wrpr">
                    <div style={{ width: '60%', margin: '0 auto' }}>
                        <div className="headerLogin">
                            <div style={{ display: 'flex', height: 50 }}><img style={{ margin: 'auto' }} src={kiranalogo} height="100%" onClick={()=>{window.location.href = '/'}}></img></div>
                        </div>
                        <div className="red_line"></div>
                        <div style={{ border: '1px solid #d4d4d4', padding: '10px 5px' }}>

                            <div style={{ display: 'flex' }}> <a href="#" style={{ margin: 'auto', fontSize: 20 }}>Forgot Password?</a></div>

                            <div style={{ width: '98%', margin: '0 auto', padding: 10 }}>
                                <InputGroup className="login">
                                    <InputGroupAddon addonType="prepend"><div className="labelIcon" style={{ margin: 'auto', width: 20, height: 23, backgroundImage: "url(" + passwordIcon + ")" }}></div></InputGroupAddon>
                                    <Input className="login" placeholder="Enter new password" type="password" name="password" value={this.state.password} onChange={(e) => this.handleInput(e)} />
                                </InputGroup>
                                <InputGroup className="login">
                                    <InputGroupAddon addonType="prepend">
                                        <div className="labelIcon" style={{ backgroundImage: "url(" + passwordIcon2 + ")" }}></div>
                                    </InputGroupAddon>
                                    <Input id="psw" className="login" placeholder="Re-Enter new password" type="password" name="re_password" value={this.state.re_password} onChange={(e) => this.handleInput(e)} /><button onClick={() => this.myFunction()}>show/hide</button>
                                </InputGroup>
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10, marginBottom: 30 }}><button className="button_red" style={{ width: '20%' }} onClick={() => this.submitForm()}>Confirm</button></div>
                            </div>
                            <div className="Already_reg" style={{ display: 'flex', justifyContent: 'center', marginBottom: 30, color: '#999999' }}> Already registered?<a href='/login' style={{ color: '#cf2127' + '!important' }}>Login here</a></div>
                        </div>


                    </div>
                </div>
                <div className="social_wrpr">
                    <div><img src={yt}></img></div>
                    <div><img src={twitter}></img></div>
                    <div><img src={insta}></img></div>
                    <div><img src={fb}></img></div>

                </div>
                <FooterComponent />

            </div>
        );
    }
}

export default Forgetpwd;