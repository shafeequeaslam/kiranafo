import React, { Component } from 'react';
import classnames from 'classnames';
import './otp.css';
import FooterComponent from '../../components/Footer/footer';
// import { Link } from 'react-router-dom';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import nameIcon from '../../assets/name-icon@2x.png'
import passwordIcon from '../../assets/password-icon@2x.png'
import kiranalogo from '../../assets/Kirana logo.png';
import fb from '../../assets/FB.png';
import insta from '../../assets/Insta.png';
import twitter from '../../assets/Twitter.png';
import yt from '../../assets/YT.png';
import phoneIcon from '../../assets/phone-icon@2x.png'
import Axios from 'axios';

class Otp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: '1',
            OtpBtnActive: false,
            isLoggedIn: true, phone: ""
        };
        this.changeBtnColor = this.changeBtnColor.bind(this);
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
        this.setState({ [name]: value },
            () => { this.validateField(name, value) });
    }
    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let phoneValid = this.state.phoneValid;
        let otpValid = this.state.otpValid;

        switch (fieldName) {
            case 'phone':
                phoneValid = value.length == 10;
            // fieldValidationErrors.phone = phoneValid ? '' : ' Enter valid phone number';
            case 'otp':
                otpValid = value.length == 6;
            // fieldValidationErrors.otp = otpValid ? '' : ' Enter valid otp';
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            phoneValid: phoneValid,
            otpValid: otpValid
        }, this.validateForm);
    }
    validateForm() {
        this.setState({ formValid: this.state.phoneValid && this.state.otpValid });
    }

    sendOTP = () => {
        console.log("Phone number:", this.state.phone, this.state.password);
        let details = {
            mobile_number: this.state.phone
        };
        let formBody = [];
        for (let property in details) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        Axios("https://cms.avenue11.com/kirana11_api/customer_app_api_resources/get_forgot_password_otp", {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formBody
        })
            .then((res) => {
                console.log(res);
                this.setState({
                    uid:res.data.user_details.uid,
                    otpSent:'1'
                })
            })
            .catch((err) => {
                console.log(err.response)
            })
    }
    checkOtp(e) {
        console.log(e.target.value.length, e.target.value)
        if (e.target.value.length == 6) {
            console.log('here')
            setTimeout(() => {
                if (this.state.otpValid) {
                    let details = {
                        mobile_number: this.state.phone,
                        otp: this.state.otp
                    };
                    let formBody = [];
                    for (let property in details) {
                        let encodedKey = encodeURIComponent(property);
                        let encodedValue = encodeURIComponent(details[property]);
                        formBody.push(encodedKey + "=" + encodedValue);
                    }
                    formBody = formBody.join("&");
                    Axios("https://cms.avenue11.com/kirana11_api/customer_app_api_resources/forgot_password_otp_verification", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: formBody
                    })
                        .then((res) => {
                            console.log(res)
                            if (res.data.msg === "success") {
                                this.setState({
                                    otpVerified: true
                                })
                            }
                            else {
                                this.setState({
                                    otpVerified: false
                                })
                            }
                        })
                        .catch((err) => {
                            console.log(err.response)
                        })
                }
            }, 100)

        }
        this.handleInput(e)

    }
    onSubmit(){
        if(this.state.otpVerified === true){
            window.location="/reset_pwd?uid="+this.state.uid
        }
    }

    render() {

        return (
            <div className="login_container otp_container">
                <div className="login_wrpr ">
                    <div style={{ width: '65%', margin: '0 auto' }}>
                        <div className="headerLogin">
                            <div style={{ display: 'flex',height:50 }}><img style={{ margin: 'auto' }} src={kiranalogo} height="100%" onClick={()=>{window.location.href = '/'}}></img></div>
                        </div>
                        <div className="red_line"></div>
                        <div style={{ border: '1px solid #d4d4d4', padding: '10px 15px' }}>

                            <div style={{ display: 'flex', padding: 7 }}> <a href="#" style={{ margin: 'auto', fontSize: 17, marginBottom: 5 }}>Forgot Password?</a></div>

                            <div style={{ width: '98%', margin: '0 auto' }}>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                                <InputGroup className="login" style={{ width: '65%' }}>
                                    <InputGroupAddon addonType="prepend">
                                        <div className="labelIcon" style={{ backgroundImage: "url(" + phoneIcon + ")" }}></div>
                                    </InputGroupAddon>
                                    <Input className="login" onChange={(e) => this.handleInput(e)} name="phone" placeholder="Enter Mobile Number*" onFocus={this.changeBtnColor} onBlur={() => this.setState({
                                        OtpBtnActive: false
                                    })} />
                                    <InputGroupAddon addonType="append">
                                        <button onClick={() => this.sendOTP()} style={{
                                            backgroundColor: '#fff',
                                            margin: "3.5px",
                                            fontSize: '1vw',
                                            width: '100%',
                                            borderRadius: '5px',
                                            border: this.state.phoneValid ? " 1px solid #cf2717" : '1px solid #d4d4d4',
                                            color: this.state.phoneValid ? '' : '#d4d4d4'
                                        }} disabled={this.state.phoneValid? false:true}>{this.state.otpSent?this.state.otpSent === "1"?'OTP Sent':'Send OTP':'Send OTP'}</button></InputGroupAddon>
                                </InputGroup>
                                <InputGroup className="login" style={{ marginLeft: '5%', width: '35%' }}>
                                    <Input className="login" placeholder="Enter otp" name="otp" onChange={(e) => this.checkOtp(e)} />
                                </InputGroup>

                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}><button className="button_red" style={{ width: '20%' }} onClick={() => this.onSubmit()}>Next</button></div>
                            <div className="Already_reg" style={{ display: 'flex', justifyContent: 'center', marginBottom: 30, color: '#666' }}> Already registered?<a href='/login' style={{ fontSize: 15 }}>Login here</a></div>
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

export default Otp;