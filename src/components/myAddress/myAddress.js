import React, { Component } from 'react';
import Axios from 'axios';
import Header from '../Header/header';
import { Collapse, CardBody, Card, Input, FormGroup, Label, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import Sidebar from '../Sidebar/sidebar';
import AccSidebar from '../Sidebar/acc_sidebar';
import './myAddress.css';
import home from '../../assets/home icon@2x.png'
import office from '../../assets/office icon@2x.png'
import other from '../../assets/others icon@2x.png'
import home_grey from '../../assets/home icon-gray.png'
import office_grey from '../../assets/office-icon-gray.png'
import other_grey from '../../assets/others-icon-gray.png'
class MyAddress extends Component {
      constructor(props) {
            super(props);
            this.state = {
                  activeForm: false,
                  buttonActive: true
            };
      }
      componentDidMount() {
            let user = JSON.parse(localStorage.getItem('userToken'));
            let loc = JSON.parse(localStorage.getItem('location'))
            this.setState({
                  presentLocation: loc.formattedAddress,
                  presentpincode: loc.postalCode
            })
            if (user != null) {
                  console.log(user)
                  this.getAddress(user.access_token);

            }



      }

      getAddress(id) {
            let token;
            if (!id) {
                  let user = JSON.parse(localStorage.getItem('userToken'));
                  token = user.access_token
            }
            else {
                  token = id;
            }


            let usr = JSON.parse(localStorage.getItem('userDetails'))

            Axios({
                  method: 'POST',
                  url: 'https://cms.avenue11.com/kirana11_api/customer_app_api_resources/get_k11_customer_all_address.json',
                  headers: {
                        "Content-Type": 'application/json',
                        "Authorization": "Bearer " + token
                  },
                  data: {
                        uid: usr.user.uid
                  }
            })
                  .then((value) => {
                        this.setState({
                              addressData: undefined
                        })
                        console.log(value, 'value_address')
                        this.setState({
                              addressData: value.data
                        })
                  })
                  .catch((err) => {
                        console.log(err.response, 'err')
                        this.getRefreshToken(undefined, "getAddress");
                  })

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
                  url: 'https://cms.avenue11.com/oauth2/token',
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
                        if (err.response && err.response.status == 400) {
                              localStorage.removeItem('userDetails');
                              localStorage.removeItem('cartObj');
                              localStorage.removeItem('userToken')

                              window.location.replace('/login');
                        }
                        console.log(err.response, 'auth_err')
                  })
      }
      editAddress(id) {
            console.log(id);
            this.setState({

                  blg_name: id.address_1,
                  street_name: id.street,
                  landmark: id.landmark,
                  type: id.address_name,
                  areaPincode: id.postal_code,
                  areaVal: id.area,
                  edit: true,
                  buttonActive: false
            })
            this.setState({
                  activeForm: !this.state.activeForm, editAddressId: id.address_id
            })
      }
      openaddAddress() {
            this.setState({
                  edit: false,
                  activeForm: !this.state.activeForm,
                  areaVal: this.state.presentLocation,
                  areaPincode: this.state.presentpincode
            })
      }
      saveAddress() {
            if (this.state.edit == false) {
                  console.log(this.state.name, this.state.blg_name, this.state.areaPincode, this.state.landmark, this.state.street_name)
                  if (this.state.name && this.state.type && this.state.blg_name && this.state.areaPincode && this.state.landmark && this.state.street_name) {
                        let location = JSON.parse(localStorage.getItem('location'));
                        let usr = JSON.parse(localStorage.getItem('userDetails'));
                        let location_dc = JSON.parse(localStorage.getItem('location_dc'));
                        let details = {
                              "address_1": this.state.blg_name,
                              "administrative_area": "KA",
                              "area": location.formattedAddress,
                              "street": this.state.street_name,
                              "landmark": this.state.landmark,
                              "locality": "Bangalore",
                              "name": this.state.type,
                              "name_line": this.state.name,
                              "postal_code": this.state.areaPincode,
                              "address_polygon": location_dc.AddressPolygon,
                              "uid": usr.user.uid
                        };
                        console.log(details)
                        let user = JSON.parse(localStorage.getItem('userToken'))
                        let formBody = [];
                        for (let property in details) {
                              let encodedKey = encodeURIComponent(property);
                              let encodedValue = encodeURIComponent(details[property]);
                              formBody.push(encodedKey + "=" + encodedValue);
                        }
                        formBody = formBody.join("&");

                        Axios('https://cms.avenue11.com/kirana11_api/user_addressbook_api_resources', {
                              method: 'POST',
                              headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                                    "Authorization": "Bearer " + user.access_token
                              },
                              data: formBody
                        })

                              .then((data) => {
                                    console.log(data, 'here')
                                    this.setState({
                                          activeForm: !this.state.activeForm
                                    });
                                    this.getAddress();
                                    // Actions[route].call({order_id:this.props.order_id});

                              })
                              .catch((error) => {
                                    console.log(error, '3')
                                    this.getRefreshToken(undefined, "saveAddress", 1)
                              })
                  }
                  else {
                        alert("Please fill in all the details")
                  }

            }
            else {
                  let location = JSON.parse(localStorage.getItem('location'));
                  let location_dc = JSON.parse(localStorage.getItem('location_dc'));
                  let user = JSON.parse(localStorage.getItem('userToken'))
                  let details = {
                        "address_1": this.state.blg_name,
                        "administrative_area": "KA",
                        "area": location.formattedAddress,
                        "street": this.state.street_name,
                        "landmark": this.state.landmark,
                        "locality": "Bangalore",
                        "name": this.state.type,
                        "name_line": this.state.name,
                        "postal_code": this.state.areaPincode,
                        "address_polygon": location_dc.AddressPolygon,
                        "address_id": this.state.editAddressId
                  }


                  let formBody = [];
                  for (let property in details) {
                        let encodedKey = encodeURIComponent(property);
                        let encodedValue = encodeURIComponent(details[property]);
                        formBody.push(encodedKey + "=" + encodedValue);
                  }
                  formBody = formBody.join("&");

                  Axios('https://cms.avenue11.com/kirana11_api/user_addressbook_api_resources/' + this.state.editAddressId + '.json', {
                        method: 'PUT',
                        headers: {
                              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                              "Authorization": "Bearer " + user.access_token
                        },
                        data: formBody
                  })

                        .then((data) => {
                              this.setState({
                                    edit: false, editAddressId: undefined,
                                    activeForm: !this.state.activeForm, buttonActive: true
                              })
                              setTimeout(() => {
                                    this.getAddress();
                              }, 100)

                        })
                        .catch((error) => {
                              this.getRefreshToken(undefined, "saveAddress")
                        })

            }

      }

      deleteAddress(id) {
            console.log('here')
            let usr = JSON.parse(localStorage.getItem('userToken'))
            Axios({
                  url: 'https://cms.avenue11.com/kirana11_api/user_addressbook_api_resources/' + id + '.json',
                  method: 'DELETE',
                  headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Bearer ' + usr.access_token
                  },
                  data: {
                        "address_id": id
                  }
            })

                  .then((data) => {
                        this.getAddress();
                  })
                  .catch((err) => {
                        this.getRefreshToken(usr, 'deleteAddress', id)
                  })
      }
      clearForm() {
            this.setState({
                  activeTab: '',
                  blg_name: '',
                  street_name: '',
                  name: '',
                  landmark: '',
                  type: '',
                  activeForm: !this.state.activeForm,
                  buttonActive: true


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
                                    <AccSidebar activeType={2} />
                              </div>

                              <div className="col-sm-9 address_listing" >
                              <div style={{ width: '100%', display: 'flex', fontSize: 24, color: '#666' }}>
                                    My Address
                      </div>
                                    <div style={{ border: "1px solid #f7f7f7", maxHeight: 500, paddingBottom: 10, overflowY: 'scroll', }}>
                                          <div style={{ flexDirection: "row", width: '100%', flexWrap: 'wrap', display: this.state.activeForm ? 'none' : 'flex' }}>
                                                {this.state.addressData ? this.state.addressData.map((item, ind) => {
                                                      console.log(item)
                                                      return (
                                                            <div className="addressWrpr" style={{ border: '1px solid #f1f1f1' }}>
                                                                  <div className="address_container">
                                                                        <div style={{ fontWeight: '500', textTransform: 'capitalize' }}>{item.name}</div>
                                                                        <div>{item.address_name}</div>
                                                                        <div>{item.address_1}</div>
                                                                        <div>{item.landmark}</div>
                                                                        <div style={{ width: '90%' }}>{item.area}</div>
                                                                  </div>
                                                                  
                                                                  <div className="address_btn_container">
                                                                  <div className="click_transparent" onClick={() => this.editAddress(item)}>Edit</div>

                                                                        <div className="click_transparent" style={{ marginLeft: 10 }} onClick={() => this.deleteAddress(item.address_id)}>Delete</div>
                                                                        </div>
                                                            </div>
                                                      )
                                                }) : ''}


                                          </div>

                                          <div style={{ display: this.state.activeForm ? '' : 'none' }} className="add_form">
                                                <div className="header_text">{this.state.edit === true ? 'Edit Address' : 'Add Address'}</div>
                                                <form style={{ marginTop: 20 }}>
                                                      {/* <FormGroup className="checkout-form">
                                                <Label htmlFor="building_name">Name</Label>
                                                <Input onChange={(e) => this.setState({ name: e.target.value })} />
                                            </FormGroup> */}
                                                      <FormGroup className="checkout-form">
                                                            <Label htmlFor="building_name">Name</Label>
                                                            <Input onChange={(e) => { this.setState({ name: e.target.value, buttonActive: false }) }} value={this.state.name} />
                                                      </FormGroup>
                                                      <FormGroup className="checkout-form">
                                                            <Label htmlFor="building_name">Building No./Name</Label>
                                                            <Input onChange={(e) => { this.setState({ blg_name: e.target.value, buttonActive: false }) }} value={this.state.blg_name} />
                                                      </FormGroup>
                                                      <FormGroup className="checkout-form">
                                                            <Label htmlFor="street_name">Street Name</Label>
                                                            <Input onChange={(e) => this.setState({ street_name: e.target.value, buttonActive: false })} value={this.state.street_name} />
                                                      </FormGroup>
                                                      <FormGroup className="checkout-form">
                                                            <Label htmlFor="landmark">Landmark</Label>
                                                            <Input onChange={(e) => this.setState({ landmark: e.target.value, buttonActive: false })} value={this.state.landmark} />
                                                      </FormGroup>
                                                      <div className="form-area-disabled">
                                                            <FormGroup className="checkout-form">
                                                                  <Label htmlFor="area">Area</Label>
                                                                  <Input disabled value={this.state.areaVal} value={this.state.areaVal} />
                                                            </FormGroup>
                                                            <FormGroup className="checkout-form">
                                                                  <Label htmlFor="pincode">Pincode</Label>
                                                                  <Input disabled value={this.state.areaPincode} value={this.state.areaPincode} />
                                                            </FormGroup>
                                                      </div>
                                                      <div style={{ display: 'flex', flexDirection: 'row', width: '30%', justifyContent: 'space-between' }}>
                                                            <div style={{ width: '30%' }}>
                                                                  <input type="radio" id="home" className="address" name="add_type" value="home" onChange={(e) => { this.setState({ type: e.target.value }) }} checked={this.state.type == 'home' ? true : false} />
                                                                  <label className="add_type" htmlFor="home">
                                                                        <div style={{ width: '30%' }}>
                                                                              <img src={this.state.type == 'home' ? home : home_grey} width='25' />
                                                                        </div>
                                                                        <div style={{ width: '60%' }}>Home
                                                    </div>
                                                                  </label>
                                                            </div>
                                                            <div style={{ width: '30%' }}>
                                                                  <input type="radio" id="work" className="address" name="add_type" value="work" onChange={(e) => { this.setState({ type: e.target.value }) }} checked={this.state.type == 'work' ? true : false} />
                                                                  <label className="add_type" htmlFor="work">
                                                                        <div style={{ width: '30%' }}>
                                                                              <img src={this.state.type == 'work' ? office : office_grey} width='25' />
                                                                        </div>
                                                                        <div style={{ width: '60%' }}>Work
                                                                        </div>
                                                                  </label>
                                                            </div>
                                                            <div style={{ width: '30%' }}>
                                                                  <input type="radio" id="other" className="address" name="add_type" value="other" onChange={(e) => { this.setState({ type: e.target.value }) }} checked={this.state.type == 'other' ? true : false} />
                                                                  <label className="add_type" htmlFor="other">
                                                                        <div style={{ width: '30%' }}>
                                                                              <img src={this.state.type == 'other' ? other : other_grey} width='25' />
                                                                        </div>
                                                                        <div style={{ width: '60%' }}>Other
                                                                  </div>
                                                                  </label>
                                                            </div>
                                                      </div>

                                                </form>
                                                <button type="button" onClick={() => this.clearForm()} className="button_white" style={{ marginRight: 10 }}>Cancel</button>
                                                <button onClick={() => this.saveAddress()} className="button_red" disabled={this.state.buttonActive} style={{ backgroundColor: this.state.buttonActive == true ? '#d4d4d4' : '#cf2717' }}>Continue</button>
                                          </div>
                                    </div>

                                    <div>
                                          <button type="button" onClick={() => this.openaddAddress()} className="button_white" style={{ marginTop: 10, display: this.state.activeForm == true ? 'none' : '' }}>Add Address</button>
                                    </div>
                              </div>

                        </div>
                  </main>
            );
      }
}

export default MyAddress;