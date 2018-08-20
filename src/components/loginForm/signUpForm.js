import React, { Component } from 'react';
import {InputGroup, InputGroupAddon, Input} from 'reactstrap'
import emailIcon from '../../assets/email-icon@2x.png'
import nameIcon from '../../assets/name-icon@2x.png'
import passwordIcon from '../../assets/password-icon@2x.png'
import phoneIcon from '../../assets/phone-icon@2x.png'

class SignUpForm extends Component {
      constructor(props){
            super(props);
            this.state={
                  salutation: "",
                  username: "",
                  password: "",
                  phone: ""
            }
      }
      handleInput = (e) =>{
            const name = e.target.name;
            const value = e.target.value;
            this.setState({ [name]: value },()=>{this.validateField(name,value)});
      }
      validateField = (fieldName,value) =>{
            console.log(this.state.radioId);
      }
      sendOTP = () => {
            console.log("Phone number:", this.state.phone);
            fetch("https://d2.kirana11.com/kirana11_api/customer_app_api_resources/get_forgot_password_otp", {
                  method: "POST",
                  headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  body: encodeURIComponent('mobile_number') + "=" + encodeURIComponent(this.state.phone)
            })
      }
      render() {
            return (
                  <div>
                        <div style={{ display: 'flex', flexDirection: 'row', width: '60%' }}>
                              <div>
                                    <input id="radio-1" className="radio-custom" name="salutation" type="radio" value="Mr" onChange={(e)=>this.handleInput(e)} />
                                    <label htmlFor="radio-1" className="radio-custom-label">Mr</label>
                              </div>
                              <div>
                                    <input id="radio-2" className="radio-custom" name="salutation" type="radio" value="Ms" onChange={(e)=>this.handleInput(e)} />
                                    <label htmlFor="radio-2" className="radio-custom-label">Ms</label>
                              </div>
                              <div>
                                    <input id="radio-3" className="radio-custom" name="salutation" type="radio" value="Mrs" onChange={(e)=>this.handleInput(e)} />
                                    <label htmlFor="radio-3" className="radio-custom-label">Mrs</label>
                              </div>
                        </div>
                        <InputGroup className="login">
                              <InputGroupAddon addonType="prepend">
                                    <div className="labelIcon" style={{ backgroundImage: "url(" + nameIcon + ")" }}></div>
                              </InputGroupAddon>
                              <Input className="login" name="username" placeholder="username" />
                        </InputGroup>
                        <InputGroup className="login">
                              <InputGroupAddon addonType="prepend">
                                    <div className="labelIcon" style={{ backgroundImage: "url(" + passwordIcon + ")" }}></div>
                              </InputGroupAddon>
                              <Input className="login" name="password" placeholder="password" type="password" />
                        </InputGroup>
                        <InputGroup className="login">
                              <InputGroupAddon addonType="prepend">
                                    <div className="labelIcon" style={{ backgroundImage: "url(" + emailIcon + ")" }}></div>
                              </InputGroupAddon>
                              <Input className="login" name="email" placeholder="email" type="email" />
                        </InputGroup>
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                              <InputGroup className="login" style={{ width: '65%' }}>
                                    <InputGroupAddon addonType="prepend">
                                          <div className="labelIcon" style={{ backgroundImage: "url(" + phoneIcon + ")" }}></div>
                                    </InputGroupAddon>
                                    <Input className="login" onChange={this.handleInput} name="phone" placeholder="phone" onFocus={this.changeBtnColor} onBlur={() => this.setState({
                                          OtpBtnActive: false
                                    })} />
                                    <InputGroupAddon addonType="append">
                                          <button onClick={this.sendOTP} style={{
                                                backgroundColor: '#fff',
                                                margin: "8% 1px",
                                                fontSize: '1vw',
                                                width: '100%',
                                                border: this.state.OtpBtnActive ? " 1px solid #cf2717" : '1px solid #d4d4d4',
                                                color: this.state.OtpBtnActive ? '' : '#d4d4d4'
                                          }}>Send OTP</button></InputGroupAddon>
                              </InputGroup>
                              <InputGroup className="login" style={{ marginLeft: '5%', width: '35%' }}>
                                    <Input className="login" placeholder="otp" />
                              </InputGroup>

                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', marginTop: 10 }}>
                              <div style={{ width: 'auto', fontSize: 14 }}>
                                    <input id="check-1" className="check-custom" name="check-group" type="checkbox" />
                                    <label htmlFor="check-1" className="check-custom-label">Accept the terms</label>
                              </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}><button className="button_red" style={{ width: '30%' }}>Signup</button></div>
                  </div>
            );
      }
}

export default SignUpForm;