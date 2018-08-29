import React, { Component } from 'react';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap'
import emailIcon from '../../assets/email-icon@2x.png'
import nameIcon from '../../assets/name-icon@2x.png'
import passwordIcon from '../../assets/password-icon@2x.png'
import phoneIcon from '../../assets/phone-icon@2x.png'
import Axios from 'axios';

class SignUpForm extends Component {
      constructor(props) {
            super(props);
            this.state = {
                  salutation: "",
                  username: "",
                  password: "",
                  phone: "",
                  email: "",
                  otp: "",
                  otpVerified: ''
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
            let emailValid = this.state.emailValid;
            let passwordValid = this.state.passwordValid;
            let phoneValid = this.state.phoneValid;
            let otpValid = this.state.otpValid;

            switch (fieldName) {
                  case 'email':
                        emailValid = value.length > 1
                        // fieldValidationErrors.email = emailValid ? '' : '';
                        break;
                  case 'password':
                        passwordValid = value.length >= 5;
                        // fieldValidationErrors.password = passwordValid ? '' : ' is too short';
                        break;
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
                  emailValid: emailValid,
                  passwordValid: passwordValid,
                  phoneValid: phoneValid,
                  otpValid: otpValid
            }, this.validateForm);
      }
      validateForm() {
            this.setState({ formValid: this.state.emailValid && this.state.passwordValid && this.state.phoneValid && this.state.otpValid });
      }
      // validateField = (fieldName,value) =>{
      //       console.log(this.state.salutation);
      // }
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
            Axios("https://d2.kirana11.com/kirana11_api/customer_app_api_resources/get_registration_otp", {
                  method: "POST",
                  headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  data: formBody
            })
                  .then((res) => {
                        console.log(res)
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
                        console.log(this.state.otpValid)
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
                              Axios("https://d2.kirana11.com/kirana11_api/customer_app_api_resources/registration_otp_verification", {
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
      submitForm() {
            console.log('here', this.state.formValid, this.state.otpVerified, this.state.salutation != null, this.state.acceptTerms)
            if (this.state.formValid && this.state.otpVerified && this.state.salutation != null && this.state.acceptTerms) {
                  Axios({
                        url: "https://d2.kirana11.com/kirana11_api/customer_app_api_resources/user_register",
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json'
                        },
                        data: {
                              "mobile_number": this.state.phone, "mail": this.state.email, "name": this.state.username, "password": this.state.password, "salutation": this.state.salutation 
                        }
      })
      .then((data)=>{
            console.log(data.data);
            window.location.href='/login'
      })
      .catch((err)=>{
            console.log(err.response)
      })
}
            
      }
render() {
      return (
            <div>
                  <div style={{ display: 'flex', flexDirection: 'row', width: '60%' }}>
                        <div>
                              <input id="radio-1" className="radio-custom" name="salutation" type="radio" value="Mr" onChange={(e) => this.handleInput(e)} />
                              <label htmlFor="radio-1" className="radio-custom-label">Mr</label>
                        </div>
                        <div>
                              <input id="radio-2" className="radio-custom" name="salutation" type="radio" value="Ms" onChange={(e) => this.handleInput(e)} />
                              <label htmlFor="radio-2" className="radio-custom-label">Ms</label>
                        </div>
                        <div>
                              <input id="radio-3" className="radio-custom" name="salutation" type="radio" value="Mrs" onChange={(e) => this.handleInput(e)} />
                              <label htmlFor="radio-3" className="radio-custom-label">Mrs</label>
                        </div>
                  </div>
                  <InputGroup className="login">
                        <InputGroupAddon addonType="prepend">
                              <div className="labelIcon" style={{ backgroundImage: "url(" + nameIcon + ")" }}></div>
                        </InputGroupAddon>
                        <Input className="login" name="username" placeholder="username" onChange={(e) => this.handleInput(e)} />
                  </InputGroup>
                  <InputGroup className="login">
                        <InputGroupAddon addonType="prepend">
                              <div className="labelIcon" style={{ backgroundImage: "url(" + passwordIcon + ")" }}></div>
                        </InputGroupAddon>
                        <Input className="login" name="password" placeholder="password" type="password" onChange={(e) => this.handleInput(e)} />
                  </InputGroup>
                  <InputGroup className="login">
                        <InputGroupAddon addonType="prepend">
                              <div className="labelIcon" style={{ backgroundImage: "url(" + emailIcon + ")" }}></div>
                        </InputGroupAddon>
                        <Input className="login" name="email" placeholder="email" type="email" onChange={(e) => this.handleInput(e)} />
                  </InputGroup>
                  <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                        <InputGroup className="login" style={{ width: '65%' }}>
                              <InputGroupAddon addonType="prepend">
                                    <div className="labelIcon" style={{ backgroundImage: "url(" + phoneIcon + ")" }}></div>
                              </InputGroupAddon>
                              <Input className="login" name="phone" placeholder="phone" onChange={(e) => this.handleInput(e)} />

                              <InputGroupAddon addonType="append">
                                    <button onClick={this.sendOTP} style={{
                                          backgroundColor: '#fff',
                                          margin: "8% 1px",
                                          fontSize: '1vw',
                                          width: '100%',
                                          border: this.state.phoneValid ? " 1px solid #cf2717" : '1px solid #d4d4d4',
                                          color: this.state.phoneValid ? '' : '#d4d4d4'
                                    }}>Send OTP</button></InputGroupAddon>
                        </InputGroup>
                        <InputGroup className="login" style={{ marginLeft: '5%', width: '35%' }}>
                              <Input className="login" placeholder="otp" name="otp" onChange={(e) => this.checkOtp(e)} maxLength={6} />
                        </InputGroup>

                  </div>

                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', marginTop: 10 }}>
                        <div style={{ width: 'auto', fontSize: 14 }}>
                              <input id="check-1" className="check-custom" name="check-group" type="checkbox" onChange={(e) => this.setState({ acceptTerms: e.target.checked })} />
                              <label htmlFor="check-1" className="check-custom-label">Accept the terms</label>
                        </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}><button className="button_red" style={{ width: '30%' }} onClick={() => this.submitForm()}>Signup</button></div>
            </div>
      );
}
}

export default SignUpForm;