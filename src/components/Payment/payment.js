import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

class PaymentComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addCoupon: true,
            couponApplied: false,
            paymentModal: false,
            activeTab: '1',
            confirmOrder:false,
            payment:null
        }
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
                            <div className="payment_info_bold">Store Subtitle</div>
                            <div className="payment_info_bold">₹ 2500</div>
                        </div>
                        <div className="payment_info_desc_wrpr" style={{ display: this.state.couponApplied ? '' : 'none' }}>
                            <div className="payment_info_green">Coupons Applied</div>
                            <div className="payment_info_green">₹ 200</div>
                        </div>
                        <div className="payment_info_desc_wrpr" style={{ display: this.state.couponApplied ? '' : 'none' }}>
                            <div className="payment_info_green">Bank Offers Applied</div>
                            <div className="payment_info_green">₹ 100</div>
                        </div>
                        <div className="payment_info_desc_wrpr">
                            <div>Delivery Charges</div>
                            <div className="payment_info_green">Free</div>
                        </div>
                    </div>
                    <div className="payment_info_desc_wrpr horizontal_border">
                        <div className="payment_info_bold payment_info_red">Amount Payable</div>
                        <div className="payment_info_bold payment_info_red">₹ 2200</div>
                    </div>
                    <div>
                        <button className="button_red button_grey">Your total Savings <p>₹ 220</p></button>
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
                                <div className="payment_gateway">
                                    <input type="radio" id="phone_pay" name="pay_gates" onChange={()=>this.setState({payment:1})} />
                                    <label htmlFor="phone_pay">
                                        <div className="pay_img phonepay"></div>
                                    </label>
                                </div>
                                <div className="payment_gateway">
                                    <input type="radio" id="razor_pay" name="pay_gates" onChange={()=>this.setState({payment:2})} />
                                    <label htmlFor="razor_pay">
                                        <div className="pay_img razorpay"></div>
                                    </label>
                                </div>
                                <div className="payment_gateway">
                                    <input type="radio" id="pay_u" name="pay_gates" onChange={()=>this.setState({payment:3})}/>
                                    <label htmlFor="pay_u">
                                        <div className="pay_img payu"></div>
                                    </label>
                                </div>
                                <div className="payment_gateway">
                                    <input type="radio" id="freecharge" name="pay_gates" onChange={()=>this.setState({payment:4})}/>
                                    <label htmlFor="freecharge">
                                        <div className="pay_img freecharge"></div>
                                    </label>
                                </div>
                            </div>

                        </TabPane>
                        <TabPane tabId="2" className="cod">
                            <div className="cod_img">
                            </div>
                            <div className="cod_text">
                            Please pay ₹2500 to delivery executive when order is delivered
                            </div>
                            <div className="cod_text cod_relative">
                                        or
                                        <div className="cod_abs left_abs"></div>
                                        <div className="cod_abs right_abs"></div>
                            </div>
                            <div className="cod_pay">
                            <div className="cod_paytm"></div>
                            <div className="cod_mobikwik"></div>
                            </div>
                            <div className="cod_text">
                            Please using Paytm or Mobikwik at the time of delivery
                            </div>
                        </TabPane>
                    </TabContent>
                    <div>
                        <button className="button_red full_width" disabled={(this.state.activeTab==='2' || this.state.payment != null) ? false : true  }><Link to={(this.state.activeTab==='2' || this.state.payment != null) ? "/thanks" : "#"  }>CONFIRM AND PLACE ORDER</Link></button>
                    </div>
                </div>


            </div >
        );
    }
}

export default PaymentComponent;