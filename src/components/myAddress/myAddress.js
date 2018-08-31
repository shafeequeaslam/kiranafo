import React, { Component } from 'react';
import Axios from 'axios';
import Header from '../Header/header';
import { Collapse, CardBody, Card, Input, FormGroup, Label, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import Sidebar from '../Sidebar/sidebar';
import AccSidebar from '../Sidebar/acc_sidebar';
import './myAddress.css'

class MyAddress extends Component {
      constructor(props) {
            super(props);
            this.state = {
                  activeForm: false
            };
      }
      componentDidMount() {
            let user = JSON.parse(localStorage.getItem('userToken'));
            let loc = JSON.parse(localStorage.getItem('location'))
            this.setState({
                  areaVal: loc.name,
                  areaPincode: loc.postalCode
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


            let loc = JSON.parse(localStorage.getItem('location'))
            let lat = (loc.lat).toString()
            let lng = (loc.lng).toString()
            Axios({
                  method: 'POST',
                  url: 'https://d2.kirana11.com/kirana11_api/customer_app_api_resources/get_k11_customer_address.json',
                  headers: {
                        "Content-Type": 'application/json',
                        "Authorization": "Bearer " + token
                  },
                  data: {
                        "latitude": lat,
                        "longitude": lng
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
      editAddress(id) {
            this.setState({
                  activeForm: !this.state.activeForm,
                  editAddress:id
            })
      }

      deleteAddress(id){
            let usr=JSON.parse(localStorage.getItem('userToken'))
            Axios({
                  url:'https://d2.kirana11.com/kirana11_api/user_addressbook_api_resources/'+id+'.json',
                  method:'DELETE',
                  headers:{
                      'Content-Type':'application/x-www-form-urlencoded',
                      'Authorization':'Bearer '+usr.access_token
                  },
                  data:{
                      "address_id":id
                      }
              })

              .then((data)=>{
                    this.getAddress();
              })
              .catch((err)=>{
                    this.getRefreshToken(usr,'deleteAddress',id)
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

                              <div className="col-sm-9 address_listing" style={{ border: "1px solid #f7f7f7", maxHeight: 500, overflowY: 'scroll', }}>
                                    <div style={{ flexDirection: "row", width: '100%', flexWrap: 'wrap', display: this.state.activeForm ? 'none' : 'flex' }}>
                                          {this.state.addressData ? this.state.addressData.map((item, ind) => {
                                                console.log(item)
                                                return (
                                                      <div className="addressWrpr" style={{ border: '1px solid #f1f1f1' }}>
                                                            <div className="address_container">
                                                                  <div style={{ fontWeight: '500', textTransform: 'capitalize' }}>{item.address_type}</div>
                                                                  <div>{item.address_1}</div>
                                                                  <div>{item.landmark}</div>
                                                                  <div style={{ width: '60%' }}>{item.area}</div>
                                                            </div>
                                                            <div className="address_btn_container"><button className="button_red" onClick={() => this.editAddress(item)}>Edit</button>

                                                                  <button className="button_red" style={{ marginLeft: 10 }} onClick={() => this.deleteAddress(item.address_id)}>Delete</button></div>
                                                      </div>
                                                )
                                          }) : ''}


                                    </div>

                                    <div style={{ display: this.state.activeForm ? '' : 'none' }}>
                                          <div>Edit Address</div>
                                          <form style={{ marginTop: 20 }}>
                                                {/* <FormGroup className="checkout-form">
                                                <Label htmlFor="building_name">Name</Label>
                                                <Input onChange={(e) => this.setState({ name: e.target.value })} />
                                            </FormGroup> */}
                                                <FormGroup className="checkout-form">
                                                      <Label htmlFor="building_name">Building No./Name</Label>
                                                      <Input onChange={(e) => { this.setState({ blg_name: e.target.value }) }} />
                                                </FormGroup>
                                                <FormGroup className="checkout-form">
                                                      <Label htmlFor="street_name">Street Name</Label>
                                                      <Input onChange={(e) => this.setState({ street_name: e.target.value })}/>
                                                </FormGroup>
                                                <FormGroup className="checkout-form">
                                                      <Label htmlFor="landmark">Landmark</Label>
                                                      <Input onChange={(e) => this.setState({ landmark: e.target.value })} />
                                                </FormGroup>
                                                <div className="form-area-disabled">
                                                      <FormGroup className="checkout-form">
                                                            <Label htmlFor="area">Area</Label>
                                                            <Input disabled value={this.state.areaVal} />
                                                      </FormGroup>
                                                      <FormGroup className="checkout-form">
                                                            <Label htmlFor="pincode">Pincode</Label>
                                                            <Input disabled value={this.state.areaPincode} />
                                                      </FormGroup>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'row', width: '30%', justifyContent: 'space-between' }}>
                                                      <div style={{ width: '30%' }}>
                                                            <input type="radio" id="home" className="address" name="add_type" value="home" onChange={(e) => { this.setState({ type: e.target.value }) }} />
                                                            <label className="add_type" htmlFor="home">
                                                                  <div style={{ width: '30%' }}>

                                                                  </div>
                                                                  <div style={{ width: '60%' }}>Home
                                                    </div>
                                                            </label>
                                                      </div>
                                                      <div style={{ width: '30%' }}>
                                                            <input type="radio" id="work" className="address" name="add_type" value="work" onChange={(e) => { this.setState({ type: e.target.value }) }} />
                                                            <label className="add_type" htmlFor="work">
                                                                  <div style={{ width: '30%' }}>

                                                                  </div>
                                                                  <div style={{ width: '60%' }}>Work
                                                    </div>
                                                            </label>
                                                      </div>
                                                      <div style={{ width: '30%' }}>
                                                            <input type="radio" id="other" className="address" name="add_type" value="other" onChange={(e) => { this.setState({ type: e.target.value }) }} />
                                                            <label className="add_type" htmlFor="other">
                                                                  <div style={{ width: '30%' }}>

                                                                  </div>
                                                                  <div style={{ width: '60%' }}>Other
                                                    </div>
                                                            </label>
                                                      </div>
                                                </div>

                                          </form>
                                          <button type="button" onClick={() => this.addressFormActive()} className="button_white" style={{ marginRight: 10 }}>Clear</button>
                                          <button onClick={() => this.saveAddress(1)} className="button_red" >Continue</button>
                                    </div>
                              </div>
                        </div>
                  </main>
            );
      }
}

export default MyAddress;