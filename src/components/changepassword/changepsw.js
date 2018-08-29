import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import './changepsw.css';
import Sidebar from '../Sidebar/sidebar';
import Header from '../Header/header';
import Axios from 'axios';
import AccSidebar from '../Sidebar/acc_sidebar';


class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            new_password: '',
            confirm_password: ''
        }
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
        let passwordValid = this.state.passwordValid;
        let new_passwordValid = this.state.new_passwordValid;
        let confirm_passwordValid = this.state.confirm_passwordValid;

        switch (fieldName) {
            case 'password':
                passwordValid = value.length >= 5;
                // fieldValidationErrors.password = passwordValid ? '' : ' is too short';
                break;
            case 'new_password':
                new_passwordValid = value.length >= 5;
                // fieldValidationErrors.password = passwordValid ? '' : ' is too short';
                break;
            case 'confirm_password':
                confirm_passwordValid = value.length >= 5;
                // fieldValidationErrors.password = passwordValid ? '' : ' is too short';
                break;
            // fieldValidationErrors.otp = otpValid ? '' : ' Enter valid otp';
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            passwordValid: passwordValid,
            new_passwordValid: new_passwordValid,
            confirm_passwordValid: confirm_passwordValid

        }, this.validateForm);
    }
    validateForm() {
        this.setState({ formValid: this.state.passwordValid && (this.state.new_passwordValid === this.state.confirm_passwordValid) });
    }
    submitForm() {
        if (this.state.formValid == true) {
            console.log(this.state.new_passwordValid === this.state.confirm_passwordValid, this.state.new_passwordValid, this.state.confirm_passwordValid);
            let usr = JSON.parse(localStorage.getItem('userDetails'))
            let usrToken = JSON.parse(localStorage.getItem('userToken'))
            let details = {
                uid: usr.user.uid,
                password: this.state.new_password,
                old_password: this.state.password
            }
            let formBody = [];
            for (let property in details) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            Axios({
                url: 'https://d2.kirana11.com/kirana11_api/customer_app_api_resources/change_password',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization':'Bearer '+usrToken.access_token
                },
                data: formBody
            })
            .then((data)=>{
                if(data.data.msg== "success"){
                    alert("Password Changed Successfully")
                }
                else{
                    alert("Enter the correct Old_Password ")
                }
            })
            .catch((err)=>{
                console.log(err.response)
                // this.getRefreshToken(usrToken,'submitForm');
            })
        }
    }
    getRefreshToken(value, type, param) {
        // console.log(val.refresh_token)
        let val;
        if (!value) {
            val = JSON.parse(localStorage.getItem('userToken'))
        }
        else
            val = value
        Axios({
            method: 'post',
            url: 'https://d2.kirana11.com/oauth2/token',
            data: {
                grant_type: 'refresh_token',
                client_id: 'client',
                refresh_token: val.refresh_token
            }

        })
            .then((value) => {
                console.log(value.data)
                localStorage.setItem('userToken', JSON.stringify(value.data));
                if (param) {
                    this[type](param);
                }
                else {
                    this[type]();
                }

            })
            .catch((err) => {
                if (err.response.status == 400) {
                    localStorage.removeItem('userDetails');
                    localStorage.removeItem('cartObj');
                    localStorage.removeItem('userToken')

                    window.location.replace('/login');
                }
                console.log(err.response, 'auth_err')
            })
    }
    render() {

        return (
            <main>
                <div>
                    <Header />
                </div>
                <div style={{ display: 'flex', width: '90%', margin: '50px auto' }}>
                    <div className="col-sm-3" style={{ padding: 0 }}>
                    <AccSidebar activeType={1} />
                    </div>

                    <div className="col-sm-9">
                        <div className="change_psw_container">
                            <div>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', margin: 'auto' }}>
                                    <div style={{ width: '100%', display: 'flex', fontSize: 24, color: '#666' }}>
                                        Change Password
                      </div>
                                    <div style={{ width: '40%' }}>
                                        <InputGroup className="login">
                                            <Input className="logininp" placeholder="Current password*" type="password" name="password" onChange={(e) => this.handleInput(e)} />
                                        </InputGroup>
                                        <InputGroup className="login">
                                            <Input className="logininp" placeholder="Enter new password*" type="password" name="new_password" onChange={(e) => this.handleInput(e)} />
                                        </InputGroup>
                                        <InputGroup className="login">
                                            <Input id="psw" className="logininp" placeholder="Re-Enter new password*" type="password" name="confirm_password" onChange={(e) => this.handleInput(e)} />
                                        </InputGroup>

                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <div style={{ display: 'flex', marginTop: 10 }}><button className="button_red" style={{ width: '10%' }} onClick={() => this.submitForm()}>Save</button></div>
                                        <div style={{ display: 'flex', marginTop: 10, marginLeft: 5 }}><button className="button_red" style={{ width: '10%' }} onClick={() => this.clearForm()}>Cancel</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

export default ChangePassword;


