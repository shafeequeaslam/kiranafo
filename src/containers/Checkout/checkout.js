import React, { Component } from 'react';
import { Collapse, CardBody, Card, Input, FormGroup, Label, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import './checkout.css';
import classnames from 'classnames';
import PaymentComponent from '../../components/Payment/payment';
import FooterComponent from '../../components/Footer/footer';
import kiranalogo from '../../assets/Kirana logo.png';
import Axios from 'axios';
import { GET_ADDRESS_BY_DC } from '../../utis/D2'

class CheckoutContainer extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            collapse: 1,
            changeActive: [false, false, false],
            numberActive: [false, false, false],
            addBtn: true,
            address: undefined,
            formActive: false,
            activeTab: '1',
            name: '',
            blg_name: '',
            street_name: '',
            landmark: '',
            delivery_slots: [
                {
                    name: 'Tomorrow',
                    timeSlots: ['10am to 12pm', '1pm to 3pm', '3pm to 5pm', '5pm to 7pm']
                },
                {
                    name: 'Day After',
                    timeSlots: ['10am to 1pm', '1pm to 3pm', '3pm to 5pm', '5pm to 7pm']
                }
            ]

        };

    }
    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
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
        if(!id){
            let user = JSON.parse(localStorage.getItem('userToken'));
            token = user.access_token
        }
        else{
            token = id;
        }
        
        
        let loc = JSON.parse(localStorage.getItem('location'))
        let lat = (loc.lat).toString()
        let lng = (loc.lng).toString()
        console.log(lat.lng)
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
    toggle(id) {
        if (id < 3) {
            this.setState({ collapse: this.state.collapse + 1 });
        }
        let change = this.state.changeActive;
        let numAct = this.state.numberActive;
        change[id - 1] = true,
            numAct[id - 1] = true,
            this.setState({
                changeActive: change,
                numberActive: numAct
            })
    }
    addressFormActive() {
        this.setState({
            formActive: !this.state.formActive,
            addBtn: !this.state.addBtn
        })
    }
    collapseActive(id) {
        let numAct = this.state.numberActive;
        numAct[id - 1] = false,
            this.setState({
                collapse: id,
                numberActive: numAct
            });
    }
    saveAddress(id) {
        console.log(this.state.name, this.state.blg_name, this.state.areaPincode, this.state.landmark, this.state.street_name)
        let location = JSON.parse(localStorage.getItem('location'));
        let usr = JSON.parse(localStorage.getItem('userDetails'));
        let location_dc =JSON.parse(localStorage.getItem('location_dc'));
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

        Axios('https://d2.kirana11.com/kirana11_api/user_addressbook_api_resources', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                "Authorization": "Bearer " + user.access_token
            },
            data: formBody
        })
           
            .then((data) => {
                console.log(data, 'here')
                this.addressFormActive();
                this.getAddress();
                // Actions[route].call({order_id:this.props.order_id});
               
            })
            .catch((error) => {
                console.log(error, '3')
                this.getRefreshToken(undefined,"saveAddress",1)
            })
    }

    addAddressToCart(){
        
    }

    render() {
        return (
            <div className="checkout_container">
                <div className="headerTwo">
                    <div style={{ display: 'flex' }}><img style={{ margin: 'auto' }} src={kiranalogo}></img></div>
                    <div className="tele-wrpr">
                        <div className="tele-icon"></div>
                        <div className="tele-num">1800-120-0110</div>
                    </div>
                </div>
                <div className="red_line"></div>
                <div className="checkout_wrpr">
                    <div style={{ marginBottom: 5 }}>

                        <div className="card_header_wrpr">
                            <div style={{ display: this.state.numberActive[0] ? 'flex' : 'none' }} className="card_icon"></div>
                            <div style={{ display: this.state.numberActive[0] ? 'none' : 'flex' }} className="card_number">1</div>
                            <div style={{ width: '60%' }}>Select Address</div>
                            <div style={{ width: "calc(40% - 25px)", justifyContent: 'flex-end', display: 'flex', marginRight: '2%' }}><button onClick={() => this.collapseActive(1)} style={{ display: this.state.changeActive[0] ? '' : 'none' }} className="change_btn">Change</button></div>

                        </div>

                        <Collapse isOpen={this.state.collapse == 1}>
                            <Card className="checkout_card">
                                <CardBody>
                                    <div>
                                        <button onClick={() => this.addressFormActive()} className="button_white" style={{ display: this.state.addBtn ? '' : 'none', padding: '5px 10px' }}>Add Address</button>
                                    </div>
                                    <div style={{ display: this.state.formActive ? 'none' : '' }}>
                                        <div style={{ display: 'flex', flexDirection: "row", width: '100%',flexWrap:'wrap' }}>
                                            {this.state.addressData ? this.state.addressData.map((item, ind) => {
                                                console.log(item)
                                                return (
                                                    <div className="addressWrpr" style={{borderRightWidth:((ind+1) % 3 == 0 || ind+1 === this.state.addressData.length) ? 0:1}}>
                                                        <div style={{ fontWeight: '500',textTransform:'capitalize' }}>{item.address_type}</div>
                                                        <div>{item.address_1}</div>
                                                        <div>{item.landmark}</div>
                                                        <div style={{width:'60%'}}>{item.area}</div>
                                                        <div><button className="button_red" onClick={() => this.toggle(1)}>Deliver to this Address</button></div>
                                                    </div>
                                                )
                                            }) : ''}


                                        </div>
                                    </div>
                                    <div style={{ display: this.state.formActive ? '' : 'none' }}>
                                        <div>Enter Delivery Address</div>
                                        <form style={{ marginTop: 20 }}>
                                            {/* <FormGroup className="checkout-form">
                                                <Label htmlFor="building_name">Name</Label>
                                                <Input onChange={(e) => this.setState({ name: e.target.value })} />
                                            </FormGroup> */}
                                            <FormGroup className="checkout-form">
                                                <Label htmlFor="building_name">Building No./Name</Label>
                                                <Input onChange={(e) => { this.setState({ blg_name: e.target.value }), console.log(e) }} />
                                            </FormGroup>
                                            <FormGroup className="checkout-form">
                                                <Label htmlFor="street_name">Street Name</Label>
                                                <Input onChange={(e) => this.setState({ street_name: e.target.value })} />
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
                                                    <input type="radio" id="home" className="address" name="add_type" value="home" onChange={(e) => {this.setState({type:e.target.value})}} />
                                                    <label className="add_type" htmlFor="home">
                                                        <div style={{ width: '30%' }}>
                                                            
                                                        </div>
                                                        <div style={{ width: '60%' }}>Home
                                                    </div>
                                                    </label>
                                                </div>
                                                <div style={{ width: '30%' }}>
                                                    <input type="radio" id="work" className="address" name="add_type" value="work" onChange={(e) => {this.setState({type:e.target.value})}}/>
                                                    <label className="add_type" htmlFor="work">
                                                        <div style={{ width: '30%' }}>
                                                            
                                                        </div>
                                                        <div style={{ width: '60%' }}>Work
                                                    </div>
                                                    </label>
                                                </div>
                                                <div style={{ width: '30%' }}>
                                                    <input type="radio" id="other" className="address" name="add_type" value="other" onChange={(e) => {this.setState({type:e.target.value})}}/>
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
                                </CardBody>

                            </Card>
                        </Collapse>
                    </div>
                    <div style={{ marginBottom: 5 }}>
                        <div className="card_header_wrpr">
                            <div style={{ display: this.state.numberActive[1] ? 'flex' : 'none' }} className="card_icon"></div>
                            <div style={{ display: this.state.numberActive[1] ? 'none' : 'flex' }} className="card_number">2</div>
                            <div style={{ width: '60%' }}>Select Delivery Slots</div>
                            <div style={{ width: "calc(40% - 25px)", justifyContent: 'flex-end', display: 'flex', marginRight: '2%' }}><button onClick={() => this.collapseActive(2)} style={{ display: this.state.changeActive[1] ? '' : 'none' }} className="change_btn">Change</button></div>

                        </div>
                        <Collapse isOpen={this.state.collapse == 2}>
                            <Card className="checkout_card">
                                <CardBody>
                                    <div className="delivery_tabs">


                                        <Nav tabs>
                                            {this.state.delivery_slots.map((data, index) => {
                                                return (
                                                    <NavItem key={index}>
                                                        <NavLink
                                                            className={classnames({ active: this.state.activeTab === (index + 1).toString() })}
                                                            onClick={() => { this.toggleTab((index + 1).toString()) }}>
                                                            {data.name}
                                                        </NavLink>
                                                    </NavItem>
                                                )
                                            })}
                                        </Nav>

                                        <TabContent activeTab={this.state.activeTab}>
                                            {this.state.delivery_slots.map((data, index) => {
                                                return (
                                                    <TabPane tabId={(index + 1).toString()} key={index}>

                                                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                                            {data.timeSlots.map((time, i) => {
                                                                return (
                                                                    <div key={i} style={{ width: '30%' }}>
                                                                        <input type="radio" id={data.name + 'slot' + i} className="address delivery" name='delivery' />
                                                                        <label className="add_type" htmlFor={data.name + 'slot' + i}>
                                                                            <div>{time}
                                                                            </div>
                                                                        </label>
                                                                    </div>
                                                                )
                                                            })
                                                            }


                                                            {/* <div style={{ width: '24%' }}>
                                                            <input type="radio" id="slotTwo" className="address delivery" name="delivery" defaultChecked={true} />
                                                            <label className="add_type" htmlFor="slotTwo">
                                                                <div >Time Slot Two
                                                    </div>
                                                            </label>
                                                        </div> */}
                                                            {/* <div style={{ width: '24%' }}>
                                                            <input type="radio" id="slotThree" className="address delivery" name="delivery" />
                                                            <label className="add_type" htmlFor="slotThree">
                                                                <div>Time Slot Three
                                                    </div>
                                                            </label>
                                                        </div> */}
                                                            {/* <div style={{ width: '24%' }}>
                                                            <input type="radio" id="slotFour" className="address delivery" name="delivery" />
                                                            <label className="add_type" htmlFor="slotFour">

                                                                <div>Time Slot Four
                                                    </div>
                                                            </label>
                                                        </div> */}

                                                        </div>

                                                    </TabPane>
                                                )
                                            })}

                                        </TabContent>
                                        <div style={{ marginTop: 25 }}>
                                            <button onClick={() => this.toggle(2)} className="button_red" >Continue</button>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                            {/* <button onClick={() => this.toggle(2)}>Open Next</button> */}
                        </Collapse>
                    </div>
                    <div style={{ marginBottom: 5 }}>
                        <div className="card_header_wrpr">
                            <div style={{ display: this.state.numberActive[2] ? 'none' : 'flex' }} className="card_number">3</div>
                            <div style={{ width: '60%' }}>Payment</div>
                            {/* <div style={{ width: "calc(40% - 25px)", justifyContent: 'flex-end', display: 'flex', marginRight: '2%' }}><button onClick={() => this.collapseActive(1)} color="primary" style={{ display: this.state.changeActive[0] ? '' : 'none' }}>Change1</button></div> */}

                        </div>
                        {/* <button onClick={() => this.collapseActive(3)} color="primary" style={{ marginBottom: '1rem', width: '100%',display:this.state.changeActive[2] ? '':'none' }}>Change3</button> */}
                        <Collapse isOpen={this.state.collapse == 3}>
                            <Card className="checkout_card">
                                <CardBody>
                                    <PaymentComponent />
                                </CardBody>
                                {/* <button onClick={() => this.toggle(3)}>Open Next</button> */}
                            </Card>
                        </Collapse>
                    </div>
                </div>
                <div style={{ marginTop: 25 }}>
                    <FooterComponent />
                </div>
            </div>
        );
    }
}

export default CheckoutContainer;