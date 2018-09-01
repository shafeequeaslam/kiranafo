import React, { Component } from 'react';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap'
import nameIcon from '../../assets/name-icon@2x.png'
import passwordIcon from '../../assets/password-icon@2x.png'
import { Link } from 'react-router-dom'
import withRouter from 'react-router/withRouter';
import Axios from 'axios';
import { GET_DC_CENTER } from '../../utis/D2';

class LoginForm extends Component {
      constructor(props) {
            super(props);
            this.state = {
                  email: '',
                  password: '',
                  formErrors: { email: '', password: '' },
                  emailValid: false,
                  passwordValid: false,
                  formValid: false,
                  redirectPath: "/"
            }
      }
     
      handleInput(e) {
            const name = e.target.name;
            const value = e.target.value;
            this.setState({ [name]: value },
                  () => { this.validateField(name, value) });
      }
      validateField(fieldName, value) {
            let fieldValidationErrors = this.state.formErrors;
            let emailValid = this.state.emailValid;
            let passwordValid = this.state.passwordValid;

            switch (fieldName) {
                  case 'email':
                        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                        fieldValidationErrors.email = emailValid ? '' : '';
                        break;
                  case 'password':
                        passwordValid = value.length >= 6;
                        fieldValidationErrors.password = passwordValid ? '' : ' is too short';
                        break;
                  default:
                        break;
            }
            this.setState({
                  formErrors: fieldValidationErrors,
                  emailValid: emailValid,
                  passwordValid: passwordValid
            }, this.validateForm);
      }
      validateForm() {
            this.setState({ formValid: this.state.emailValid && this.state.passwordValid });
      }
      submitForm() {
            let postData = {
                  grant_type: 'password',
                  client_id: 'client',
                  username: this.state.email,
                  password: this.state.password
            }
            fetch('https://d2.kirana11.com/oauth2/token', {
                  method: 'POST',
                  body:JSON.stringify(postData),
                  headers: {
                        'Content-Type': 'application/json',
                  },
            })
            .then(res=>res.json())
            .then(data=>{
                  console.log(data)
                  if(data.error){
                        alert("Invalid username and password");
                  }
                  else{
                         localStorage.setItem("userToken", JSON.stringify(data));
                        this.getUserData();
                        
                  }
                  
            });
      }

      getUserData = () => {
            const userAccessToken = JSON.parse(localStorage.getItem("userToken"));
            console.log(userAccessToken,'111');
            fetch("https://d2.kirana11.com/kirana11_api/get_k11_user_profile.json", {
                  method: "GET",
                  headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer '+userAccessToken["access_token"]
                  }
            })
            .then(res=>res.json())
            .then((userDetails)=>{
                  console.log(userDetails)
                  localStorage.setItem("userDetails", JSON.stringify(userDetails));
            
                  let location = JSON.parse(localStorage.getItem("location"));
                  let usr = JSON.parse(localStorage.getItem("userDetails"));
                  let params = new URLSearchParams();
                  if(location != null){
                  params.append('address', location.formattedAddress);
                  params.append('latitude', location.lat);
                  params.append('longitude', location.lng);
                  params.append('source', 'web');
                  params.append('uid', usr.user.uid);
                  // console.log(datas)


                  Axios({
                      method: 'POST',
                      url: GET_DC_CENTER,
                      headers: {
                          'Content-Type': 'application/x-www-form-urlencoded',
                      },
                      data: params

                  })

                      .then((value) => {

                          if (value.data.serving_area.length > 0) {
                              console.log(value, 'data11');
                              localStorage.setItem('location_dc', JSON.stringify(value.data.serving_area[0]))
                              //   AsyncStorage.setItem('userLocation', JSON.stringify({ 'description': json.results[0].formatted_address, 'location': location, 'pincode': pincode }))
                              //   this.props.getFooterActive(0);
                              //   Actions.home();
                             

                          }
                          else {
                              alert("This area is not yet serviceable");
                              localStorage.removeItem('location');
                          }

                      })
                      .catch((err) => {
                          console.log(err.response, 'err')
                      })
                  window.location.href = '/'
                  }
            })
      }
      render() {
            return (
                  <div style={{ width: '98%', margin: '0 auto' }}>
                        <InputGroup className="login">
                              <InputGroupAddon addonType="prepend"><div className="labelIcon" style={{ backgroundImage: "url(" + nameIcon + ")" }}></div></InputGroupAddon>
                              <Input className="login" placeholder="username" name="email" value={this.state.email} onChange={(e) => this.handleInput(e)} />
                        </InputGroup>
                        <InputGroup className="login">
                              <InputGroupAddon addonType="prepend">
                                    <div className="labelIcon" style={{ backgroundImage: "url(" + passwordIcon + ")" }}></div>
                              </InputGroupAddon>
                              <Input className="login" placeholder="password" type="password" name="password" value={this.state.password} onChange={(e) => this.handleInput(e)} />
                        </InputGroup>

                        <div> <a href="/forgot_pwd" style={{ marginLeft: 35, fontSize: 12, marginTop: 10 }}>Forgot Password?</a></div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}><button className="button_red" style={{ width: '30%' }} onClick={() => this.submitForm()}>Login</button></div>
                  </div>
            );
      }
}

export default withRouter(LoginForm);