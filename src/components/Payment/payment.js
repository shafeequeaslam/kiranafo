import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import Axios from 'axios';

class PaymentComponent extends Component {
    constructor(props) {
        super(props);
        console.log(this.props, "props")
        this.state = {
            addCoupon: true,
            couponAmt: false,
            delivery_fee: this.props.cartInfo.delivery_fee,
            paymentModal: false,
            discount: this.props.cartInfo.discount,
            activeTab: '1',
            confirmOrder: false,
            payment: null,
            amountToPay: this.props.cartInfo.amountToPay,
            subTotal: this.props.cartInfo.subTotal,
            order_id:this.props.order_id


        }
    }
    componentWillMount() {
        console.log(this.props, "props, from 12121")
    }
    toggleTab(val) {
        this.setState({
            activeTab: val
        })
    }
    addCoupon() {
        this.setState({
            addCoupon: !this.state.addCoupon,
        })
    }
    couponApplied() {
        this.setState({
            couponApplied: true,
            paymentModal: false,
        })
    }
    readyPayment() {
        this.setState({
            paymentModal: true,
        })
    }
    makePayment(methodData) {
        console.log('here')
        let usr = JSON.parse(localStorage.getItem('userToken'))
        let loc_dc =JSON.parse(localStorage.getItem('location_dc'))
        if (this.state.activeTab === "2") {
            console.log('here11')
            let details = {
                'payment_id': 'cod',
                'order_id': this.state.order_id,
                'payment_type': 'commerce_cod',
                'status': 'pending',
                'store_ids': loc_dc.StoreID
            }
            let formBody = [];
            for (let property in details) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");

            Axios({
                url: 'https://d2.kirana11.com/kirana11_api/orders/checkout_completion_update.json',
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + usr.access_token
                },
                data: formBody
            })
                .then((data) => {
                    
                    if (data.data[0] === "SUCCESS") {
                        console.log("1212");
                        localStorage.removeItem('cartObj')
                        // Actions.order_successful({ "order_id": order_id });
                        window.location = '/thanks?order_id=' + this.props.cartInfo.order_id;
                    }
                })
                .catch((err) => {
                    console.log(err.response)
                    this.getRefreshToken(usr.tokenVal, "make_payment");
                })
        }
        else if (this.state.activeTab === "1") {
            let usr=JSON.parse(localStorage.getItem('userToken'))
            let instance_id = methodData.instance_id;
            console.log(instance_id);
            let details = {
                  'instance_id': instance_id,
                  'order_id': this.props.cartInfo.order_id
            }
            let formBody = [];
            for (let property in details) {
                  let encodedKey = encodeURIComponent(property);
                  let encodedValue = encodeURIComponent(details[property]);
                  formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            Axios({
                  url: 'https://d2.kirana11.com/kirana11_api/customer_app_api_resources/set_k11_payment_method',
                  method: 'post',
                  headers: {
                        'Authorization': 'Bearer ' + usr.access_token
                  },
                  data: formBody
            })
                  // .then((res=>res.json()))
                  .then((data) => {
                        console.log(data.data, 'data');
                       window.location.href="https://d2.kirana11.com/k11-payment-redirect?refresh_token=" + usr.refresh_token + "&order_id=" + this.props.cartInfo.order_id 

                  })
                  .catch((err) => {
                        this.getRefreshToken(usr.tokenVal, "makePayment")
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
            <div>
                <div>
                    <button onClick={() => this.addCoupon()} className="button_white" style={{ display: this.state.addCoupon ? '' : 'none', padding: '5px 10px' }}>Add Coupon</button>
                </div>
                <div style={{ display: !this.state.addCoupon ? '' : 'none' }} className="coupon_select_wrpr">
                    <div onClick={() => this.addCoupon()} className="coupon_wrpr_close">x</div>
                    <div className="flex_row">
                        <div className="input-group" style={{ width: '50%' }}>
                            <input placeholder="Search Products" type="text" className="coupon_input form-control" style={{ borderRadius: 0 }} />
                        </div>
                        <div>
                            <button className='search_btn'>Apply</button>
                        </div>
                    </div>
                    <div className="coupon-listing_wrpr">
                        <div className="coupon-list">
                            <div className="coupon-icon"></div>
                            <div className="coupon-desc-wrpr">
                                <div className="coupon-header">Kirana 11</div>
                                <div className="coupon-desc">Get 11% off on your order </div>
                            </div>
                            <div className="coupon-apply">
                                <button className="button_white" onClick={() => this.couponApplied()}>Apply</button>
                            </div>
                        </div>

                        <div className="coupon-list">
                            <div className="coupon-icon"></div>
                            <div className="coupon-desc-wrpr">
                                <div className="coupon-header">Kirana 11</div>
                                <div className="coupon-desc">Get 11% off on your order </div>
                            </div>
                            <div className="coupon-apply">
                                <button className="button_white">Apply</button>
                            </div>
                        </div>
                        <div className="coupon-list">
                            <div className="coupon-icon"></div>
                            <div className="coupon-desc-wrpr">
                                <div className="coupon-header">Kirana 11</div>
                                <div className="coupon-desc">Get 11% off on your order </div>
                            </div>
                            <div className="coupon-apply">
                                <button className="button_white" >Apply</button>
                            </div>
                        </div>
                        <div className="coupon-list">
                            <div className="coupon-icon"></div>
                            <div className="coupon-desc-wrpr">
                                <div className="coupon-header">Kirana 11</div>
                                <div className="coupon-desc">Get 11% off on your order </div>
                            </div>
                            <div className="coupon-apply">
                                <button className="button_white">Apply</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="payment_info_wrpr">
                    <div style={{ width: '100%', height: 5, backgroundColor: "#cf2717" }}></div>
                    <div className="payment_info_block">
                        <div className="payment_info_desc_wrpr">
                            <div className="payment_info_bold">Store Subtotal</div>
                            <div className="payment_info_bold">₹ {this.state.subTotal}</div>
                        </div>
                        <div className="payment_info_desc_wrpr" style={{ display: this.state.couponAmt ? '' : 'none' }}>
                            <div className="payment_info_green">Coupons Applied</div>
                            <div className="payment_info_green">₹ {this.state.couponAmt}</div>
                        </div>
                        {/* <div className="payment_info_desc_wrpr" style={{ display: this.state.couponApplied ? '' : 'none' }}>
                            <div className="payment_info_green">Bank Offers Applied</div>
                            <div className="payment_info_green">₹ 100</div>
                        </div> */}
                        <div className="payment_info_desc_wrpr">
                            <div>Delivery Charges</div>
                            <div className="payment_info_green">₹ {this.state.delivery_fee}</div>
                        </div>
                    </div>
                    <div className="payment_info_desc_wrpr horizontal_border">
                        <div className="payment_info_bold payment_info_red">Amount Payable</div>
                        <div className="payment_info_bold payment_info_red">₹ {this.state.amountToPay}</div>
                    </div>
                    <div>
                        <button className="button_red button_grey">Your total Savings <p>₹ {this.state.discount}</p></button>
                    </div>
                    <div style={{ display: !this.state.paymentModal ? '' : 'none' }}>
                        <button className="button_red" onClick={() => this.readyPayment()}>Make Payment</button>
                    </div>

                </div>
                <div className="payment_tabs" style={{ display: this.state.paymentModal ? '' : 'none' }}>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={() => { this.toggleTab('1'); }}>
                                Cash/Wallet/NetBanking
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={() => { this.toggleTab('2'); }}>
                                Cash on Delivery
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <div style={{ borderTopWidth: 1 }} className="payment_gates_wrpr">
                                {this.props.paymentModes ? this.props.paymentModes.map((mode, index) => {
                                    return(
                                    <div className="payment_gateway">
                                        <input type="radio" id="phone_pay" name="pay_gates" onChange={() => this.setState({ payment: index })} />
                                        <label htmlFor="phone_pay">
                                            <div className="pay_img">
                                                <img src={mode.method_icon} height='100%' width='100%' />
                                            </div>
                                        </label>
                                    </div>
                                    )

                                }) : ''}
                            </div>






                        </TabPane>
                        <TabPane tabId="2" className="cod">
                            <div className="cod_img">
                            </div>
                            <div className="cod_text">
                                Please pay ₹ {this.state.amountToPay} to delivery executive when order is delivered
                            </div>
                            <div className="cod_text cod_relative">
                                or
                                        <div className="cod_abs left_abs"></div>
                                <div className="cod_abs right_abs"></div>
                            </div>
                        </TabPane>
                    </TabContent>
                    <div>
                        <button className="button_red full_width" disabled={(this.state.activeTab === '2' || this.state.payment != null) ? false : true} onClick={() => this.makePayment(this.props.paymentModes[this.state.payment])}>
                            PAY SECURELY ₹{this.state.amountToPay}
                        </button>
                    </div>
                </div>


            </div >
        );
    }
}

export default PaymentComponent;