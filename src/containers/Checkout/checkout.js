import React, { Component } from 'react';
import { Collapse, CardBody, Card, Input, FormGroup, Label, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import './checkout.css';
import classnames from 'classnames';
import PaymentComponent from '../../components/Payment/payment';
import FooterComponent from '../../components/Footer/footer';
import kiranalogo from '../../assets/Kirana logo.png';
import Axios from 'axios';
import { GET_ADDRESS_BY_DC } from '../../utis/D2';
import { create } from 'apisauce'
import home from '../../assets/home icon@2x.png'
import office from '../../assets/office icon@2x.png'
import other from '../../assets/others icon@2x.png'
import home_grey from '../../assets/home icon-gray.png'
import office_grey from '../../assets/office-icon-gray.png'
import other_grey from '../../assets/others-icon-gray.png'

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
            dateSelected: 0,
            timeSelected: -1,

        };

    }
    toggleDate(id, date) {
        this.setState({
            dateSelected: id,
            dateValue: date, timeSelected: 0,
            timeValue: this.state.timeSlotArr[id][0]
        })
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
            areaVal: loc.formattedAddress,
            areaPincode: loc.postalCode
        })
        if (user != null) {
            console.log(user)
            this.getAddress(user.access_token);
            this.getTimeSlots();

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
        let loc_dc = JSON.parse(localStorage.getItem('location_dc'))
        let lat = (loc.lat).toString()
        let lng = (loc.lng).toString()
        let address_polygon = loc_dc.AddressPolygon
        Axios({
            method: 'POST',
            url: 'https://d2.kirana11.com/kirana11_api/customer_app_api_resources/get_k11_customer_address.json',
            headers: {
                "Content-Type": 'application/json',
                "Authorization": "Bearer " + token
            },
            data: {
                "latitude": lat,
                "longitude": lng,
                address_polygon: address_polygon
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
                this.getRefreshToken(undefined, "saveAddress", 1)
            })
    }

    add_address_to_order(item, i) {
        this.setState({
            addressSelected: i
        })
        let url = window.location.href;
        let url_string = url;
        let urlStr = new URL(url_string);
        let order_id = urlStr.searchParams.get("order_id");
        let usr = JSON.parse(localStorage.getItem('userToken'))
        console.log(order_id)
        this.setState({
            order_id: order_id
        })
        let details = {
            'order_id': order_id,
            'address_id': item.address_id
        }
        let formBody = [];
        for (let property in details) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        Axios({
            method: 'post',
            url: 'https://d2.kirana11.com/kirana11_api/orders/order_address_update',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + usr.access_token
            },
            data: formBody
        })
            .then((data) => {
                console.log(data.data, "data");
                this.toggle(1);
            })
            .catch((err) => {
                console.log(err.response.status, "err");
                if (err.response.status == 403) {
                    this.getRefreshToken(usr, 'add_address_to_order', item)
                }
            })
    }

    getTimeSlots() {
        console.log('here at timeslots')
        let usr = JSON.parse(localStorage.getItem('userToken'))
        let loc_dc = JSON.parse(localStorage.getItem('location_dc'))
        let url = window.location.href;
        let url_string = url;
        let urlStr = new URL(url_string);
        let order_id = urlStr.searchParams.get("order_id");
        let details = {
            "order_id": order_id,
            "dc_id": loc_dc.DistributionCentreId
        }
        let formBody = [];
        for (let property in details) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }

        formBody = formBody.join("&");
        Axios('https://d2.kirana11.com/kirana11_api/customer_app_api_resources/get_homedelivery_slots.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                "Authorization": "Bearer " + usr.access_token
            },
            data: formBody
        })
            .then((data) => {
                console.log('here @axios success')
                console.log(data.data, "data1111")
                let dataVal = Object.values(data.data[0]);
                console.log(dataVal);
                let dat = dataVal[0].dates;
                let dateToSend = [];
                console.log(dat, "dat");
                console.log(Object.values(dat), 'd2')
                for (let i = 0; i < Object.values(dat).length; i++) {
                    console.log(Object.values(dat)[i].date)
                    dateToSend.push(Object.values(dat)[i].date);
                }
                let key_arr = Object.keys(dat);
                console.log(key_arr, "key_arr")
                // for(let i=0;i<dat.length;i++){
                //     console.log(Object.values(dat[i]),'val');

                // }
                let value_arr = Object.values(dat)
                console.log(value_arr, 'val_arr');
                let time_arr = [];
                for (let i = 0; i < value_arr.length; i++) {
                    // console.log(Object.values(dat[i]),'val');
                    time_arr.push(Object.values(value_arr[i].slots))
                }
                console.log(time_arr)
                this.setState({
                    timeSlotArr: time_arr,
                    dateArray: key_arr,
                    dateSelected: 0,
                    timeSelected: 0,
                    dateValue: key_arr[0],
                    timeValue: time_arr[0][0],
                    dateToSend: dateToSend
                })
                this.props.selectedData('date', this.state.dateArray[this.state.dateSelected], this.state.dateSelected)
                let test = Object.values(this.state.timeSlotArr[0])
                console.log(test[0], "test", this.state.timeSlotArr[0])
                this.props.selectedData('time', test[this.state.timeSelected], this.state.timeSelected)
            })
            .catch((err) => {
                console.log(err.response);
                // this.getRefreshToken(usr.access_token);
            })


    }
    setDeliverySlots() {
        console.log(this.state.dateValue, this.state.timeValue, this.state.dateToSend[this.state.dateSelected]);
        let usr = JSON.parse(localStorage.getItem('userToken'))
        // let loc_dc = JSON.parse(localStorage.getItem('location_dc'))
        let url = window.location.href;
        let url_string = url;
        let urlStr = new URL(url_string);
        let order_id = urlStr.searchParams.get("order_id");
        localStorage.setItem('order_id', JSON.stringify({ 'order_id': order_id }))



        const api = create({
            baseURL: 'https://d2.kirana11.com/kirana11_api/orders/delivery_type_update',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + usr.access_token
            },
        })
        api.post('https://d2.kirana11.com/kirana11_api/orders/delivery_type_update',
            {
                "orders": [{
                    "delivery_date": this.state.dateToSend[this.state.dateSelected],
                    "delivery_time": this.state.timeValue,
                    "delivery_type": "delivery",
                    "order_id": order_id
                }]
            }
        )
            .then((datas) => {

                this.getCartInfo();
                console.log('111')
                console.log(datas, '11121');


                // Actions.payment({ total: this.state.total, order_id: val.data[0].order_id, totalFullAmount: this.state.totalFullAmount })
            })
            .catch((err) => {
                console.log(err, '11')
            })
    }

    getCartInfo() {
        console.log('here@del_ch')
        let usr = JSON.parse(localStorage.getItem('userToken'))
        Axios({
            method: 'GET',
            url: 'https://d2.kirana11.com/kirana11_api/customer_app_api_resources.json',
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": 'application/x-www-form-urlencoded',
                "Authorization": 'Bearer ' + usr.access_token
            }
        })
            .then((data) => {
                console.log(data.data);
                let keys = Object.values(data.data.group_total.data.components);
                this.setState({
                    amountToPay: data.data.group_total.amount
                })
                for (let i = 0; i < keys.length; i++) {
                    if (keys[i].name == "base_price") {
                        this.setState({
                            subTotal: parseInt(keys[i].price.amount)
                        })
                    }
                    else if (keys[i].name == "discount") {
                        console.log(keys[i].price.amount, keys[i])
                        this.setState({

                            discount: parseInt(keys[i].price.amount)
                        })
                    }
                    else if (keys[i].name == "flat_rate_delivery_charges") {
                        this.setState({
                            delivery_fee: parseInt(keys[i].price.amount)
                        })
                    }
                    else if (keys[i].name == "kirana11_discount") {
                        this.setState({
                            couponAmt: parseInt(keys[i].price.amount)
                        })
                    }

                    this.getPaymentList();
                }
                this.toggle(2);
            })
            .catch((err) => {
                console.log(err);
                this.getRefreshToken(usr.access_token, "getCartInfo")
            })


        // })
        // .catch((err) => {
        //     console.log(err)
        // })

    }
    getPaymentList() {
        let usr = JSON.parse(localStorage.getItem('userToken'))
        fetch('https://d2.kirana11.com/kirana11_api/get_k11_payment_methods.json', {
            method: 'GET',
            headers: {
                //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                "Authorization": "Bearer " + usr.access_token
            }
        })
            .then((val => val.json())

            )
            .then((data) => {
                this.setState({
                    paymentModes: data
                })
            })
            .catch((err) => {
                this.getRefreshToken(usr.access_token, "getPaymentList")
            })
    }
    clearForm() {
        this.setState({
            activeTab: '',
            blg_name: '',
            street_name: '',
            landmark: '',
            type: '',
            name: '',
        })
        this.addressFormActive()
    }
    redirect() {
        window.location.href = "/"
    }

    render() {
        return (
            <div className="checkout_container">
                <div className="headerTwo" style={{ padding: '2px 0' }}>
                    <div style={{ display: 'flex' }}><img style={{ margin: 'auto' }} height="35" src={kiranalogo} onClick={() => this.redirect()}></img></div>
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
                                        <div style={{ display: 'flex', flexDirection: "row", width: '100%', flexWrap: 'wrap' }}>
                                            {this.state.addressData ? this.state.addressData.map((item, ind) => {
                                                console.log(item)
                                                return (
                                                    <div className="addressWrpr" style={{ borderRightWidth: ((ind + 1) % 3 == 0 || ind + 1 === this.state.addressData.length) ? 0 : 1 }}>

                                                        <div style={{ fontWeight: '500', textTransform: 'capitalize' }}>{item.name}</div>
                                                        <div>{item.address_name}</div>
                                                        <div>{item.address_1}</div>
                                                        <div>{item.landmark}</div>
                                                        <div style={{ width: '60%' }}>{item.area}</div>
                                                        <div><button className={this.state.addressSelected === ind ? "button_red" : 'button_white'} onClick={() => this.add_address_to_order(item, ind)}>{this.state.addressSelected === ind ? "Selected" : 'Deliver to this Address'}</button></div>
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
                                                <Label htmlFor="building_name">Name</Label>
                                                <Input onChange={(e) => { this.setState({ name: e.target.value, buttonActive: false }) }} value={this.state.name} />
                                            </FormGroup>
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
                                                    <input type="radio" id="home" className="address" name="add_type" value="home" onChange={(e) => { this.setState({ type: e.target.value }) }} />
                                                    <label className="add_type" htmlFor="home">
                                                        <div style={{ width: '30%' }}>
                                                            <img src={this.state.type == 'home' ? home : home_grey} width='25' />
                                                        </div>
                                                        <div style={{ width: '60%' }}>Home</div>
                                                    </label>
                                                </div>
                                                <div style={{ width: '30%' }}>
                                                    <input type="radio" id="work" className="address" name="add_type" value="work" onChange={(e) => { this.setState({ type: e.target.value }) }} />
                                                    <label className="add_type" htmlFor="work">
                                                        <div style={{ width: '30%' }}>
                                                            <img src={this.state.type == 'work' ? office : office_grey} width='25' />
                                                        </div>
                                                        <div style={{ width: '60%' }}>Work
                                                    </div>
                                                    </label>
                                                </div>
                                                <div style={{ width: '30%' }}>
                                                    <input type="radio" id="other" className="address" name="add_type" value="other" onChange={(e) => { this.setState({ type: e.target.value }) }} />
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
                                        <button type="button" className="button_white" style={{ marginRight: 10 }} onClick={() => this.clearForm()}>Cancel</button>
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
                                            {this.state.dateArray ? this.state.dateArray.map((date, index) => {
                                                return (
                                                    <NavItem key={index}>
                                                        <NavLink
                                                            className={classnames({ active: this.state.dateSelected === index })}
                                                            onClick={() => { this.toggleDate(index, date) }}>
                                                            {date}
                                                        </NavLink>
                                                    </NavItem>
                                                )
                                            }) : ''}
                                        </Nav>
                                        <TabContent activeTab={this.state.dateSelected}>

                                            <TabPane tabId={this.state.dateSelected}>

                                                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'flex-start' }}>
                                                    {this.state.timeSlotArr ? this.state.timeSlotArr[this.state.dateSelected].map((time, i) => {
                                                        console.log(this.state.timeSlotArr[0], 'time')
                                                        return (
                                                            <div key={i} style={{ width: '30%', height: 75 }} onClick={() => this.setState({
                                                                timeSelected: i, timeValue: time
                                                            })}>
                                                                <input type="radio" id={i} className="address delivery" name='delivery' checked={this.state.timeSelected == i ? true : false} />
                                                                <label className="add_type" htmlFor={i}>
                                                                    <div>{time}
                                                                    </div>
                                                                </label>
                                                            </div>
                                                        )
                                                    }) : ''
                                                    }


                                                </div>

                                            </TabPane>


                                        </TabContent>
                                        <div style={{ marginTop: 25 }}>
                                            <button onClick={() => this.setDeliverySlots()} className="button_red" style={{ padding: '5px 50px' }} >Confirm</button>
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
                                    {this.state.paymentModes ? (
                                        <PaymentComponent paymentModes={this.state.paymentModes ? this.state.paymentModes : ''} cartInfo={this.state.paymentModes ? { subTotal: this.state.subTotal, discount: this.state.discount, delivery_fee: this.state.delivery_fee, couponAmt: this.state.couponAmt, amountToPay: this.state.amountToPay, order_id: this.state.order_id } : ''} />
                                    ) : ''}
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