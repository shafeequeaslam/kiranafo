import React, { Component } from 'react';
import Axios from 'axios';
import Header from '../Header/header';
import Sidebar from '../Sidebar/sidebar';
import AccSidebar from '../Sidebar/acc_sidebar';
import './myAddress.css'

class MyAddress extends Component {
      constructor(props) {
            super(props);
            this.state = {};
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

                              <div className="col-sm-9 address_listing" style={{border:"1px solid #f7f7f7",maxHeight:500,overflowY:'scroll' }}>
                                    <div style={{ display: 'flex', flexDirection: "row", width: '100%', flexWrap: 'wrap' }}>
                                          {this.state.addressData ? this.state.addressData.map((item, ind) => {
                                                console.log(item)
                                                return (
                                                      <div className="addressWrpr" style={{ border:'1px solid #f1f1f1'}}>
                                                            <div className="address_container">
                                                            <div style={{ fontWeight: '500', textTransform: 'capitalize' }}>{item.address_type}</div>
                                                            <div>{item.address_1}</div>
                                                            <div>{item.landmark}</div>
                                                            <div style={{ width: '60%' }}>{item.area}</div>
                                                            </div>
                                                            <div className="address_btn_container"><button className="button_red" onClick={() => this.add_address_to_order(item)}>Edit</button>
                                                            
                                                            <button className="button_red" style={{marginLeft:10}} onClick={() => this.add_address_to_order(item)}>Delete</button></div>
                                                      </div>
                                                )
                                          }) : ''}


                                    </div>
                              </div>
                        </div>
                  </main>
            );
      }
}

export default MyAddress;