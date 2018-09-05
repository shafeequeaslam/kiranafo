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
            cardcount:[],
            addCoupon: true,
            couponAmt: undefined,
            delivery_fee: this.props.cartInfo.delivery_fee,
            paymentModal: false,
            discount: this.props.cartInfo.discount?this.props.cartInfo.discount: 0,
            activeTab: '1',
            confirmOrder: false,
            payment: null,
            amountToPay: this.props.cartInfo.amountToPay,
            subTotal: this.props.cartInfo.subTotal,
            order_id:this.props.order_id


        }
    }
    componentWillMount() {
        let usr=JSON.parse(localStorage.getItem('userDetails'))
        console.log(this.props, "props, from 12121");
        Axios({
            method: 'get',
            url: "http://dev.dms.avenue11.com/api/v2/coupon/user?uid="+usr.user.uid+"&agent=MOBILE&general=1",
            headers: {
                  'Content-Type': 'application/json'
            },
            
      })
            .then((val) => {
                console.log(val)
                  this.setState({
                        couponData:val.data,
                        cardcount:[val.data.length]
                  })
            })
            .catch((err) => {
                  console.log(err);
            })
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
    _handleKeyPress(e){
        if (e.key === 'Enter') {
            this.couponApplied();
          }
    }
    couponApplied(item) {
        let code;
        if(!item){
            code = this.state.coupon_q
        }
        else
        code = item.code
        let url = window.location.href;
        let url_string = url;
        let urlStr = new URL(url_string);
        let order_id = urlStr.searchParams.get("order_id");
        let userToken = JSON.parse(localStorage.getItem('userToken'));
        Axios({
            url:'https://cms.avenue11.com/kirana11_api/discount_coupon_apply',
            method:'post',
            headers:{
                'Authorization':'Bearer '+userToken.access_token,
                'Content-Type':'application/json'
            },
            data:{
                order_id:order_id,
                coupon_code:code
            }
        })
        .then((data)=>{
            console.log(data.data);
           
            this.getCartInfo()
        })
        .catch((err)=>{
            console.log(err.response)
            this.getRefreshToken(userToken,"couponApplied",item)
        })
        
    }
    getCartInfo() {
        console.log('here@del_ch')
        let usr = JSON.parse(localStorage.getItem('userToken'))
                Axios({
                    method: 'GET',
                    url: 'https://cms.avenue11.com/kirana11_api/customer_app_api_resources.json',
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
                                    subTotal: undefined
                                })
                                setTimeout(()=>{
                                    this.setState({
                                        subTotal: parseInt(keys[i].price.amount)
                                    })
                                },100)
                                
                            }
                            else if (keys[i].name == "discount") {
                                this.setState({
                                    discount: undefined
                                })
                                setTimeout(()=>{
                                    this.setState({
                                        discount: parseInt(keys[i].price.amount)
                                    })
                                },100)
                                
                            }
                            else if (keys[i].name == "flat_rate_delivery_charges") {
                                this.setState({
                                    delivery_fee: undefined
                                })
                                setTimeout(()=>{
                                    this.setState({
                                        delivery_fee: parseInt(keys[i].price.amount)
                                    })
                                },100)
                               
                            }
                            else if (keys[i].name == "kirana11_discount") {
                                this.setState({
                                    couponAmt: undefined
                                })
                                setTimeout(()=>{
                                    this.setState({
                                        couponAmt: parseInt(keys[i].price.amount)
                                    })
                                },100)
                              
                            }

                            
                        }
                        this.setState({
                            couponApplied: true,
                            // appliedCouponData:item,
                            paymentModal: false,
                            addCoupon: !this.state.addCoupon
                        })
                    })
                    .catch((err) => {
                        console.log(err);
                        this.getRefreshToken(usr.access_token,"getCartInfo")
                    })


            // })
            // .catch((err) => {
            //     console.log(err)
            // })
        
    }
    readyPayment() {
        this.setState({
            paymentModal: true,
        })
    }
    makePayment(methodData) {
        console.log(methodData)
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
                url: 'https://cms.avenue11.com/kirana11_api/orders/checkout_completion_update.json',
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
                  url: 'https://cms.avenue11.com/kirana11_api/customer_app_api_resources/set_k11_payment_method',
                  method: 'post',
                  headers: {
                        'Authorization': 'Bearer ' + usr.access_token
                  },
                  data: formBody
            })
                  // .then((res=>res.json()))
                  .then((data) => {
                        console.log(data.data, 'data');
                       window.location.href="https://cms.avenue11.com/k11-payment-redirect?refresh_token=" + usr.refresh_token + "&order_id=" + this.props.cartInfo.order_id 

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
                if (err.response.status == 400) {
                    localStorage.removeItem('userDetails');
                    localStorage.removeItem('cartObj');
                    localStorage.removeItem('userToken')

                    window.location.replace('/login');
                }
                console.log(err.response, 'auth_err')
            })
    }
    setpayment(id){
        console.log('here1212');
        this.setState({
            payment:id
        })
    }

   


    render() {
        return (
            <div>
                {/* <div>
                    <button onClick={() => this.addCoupon()} className="button_white" style={{ display: this.state.addCoupon ? '' : 'none', padding: '5px 10px' }}>Add Coupon</button>
                </div> */}
                <div style={{ display: !this.state.addCoupon ? '' : 'none' }} className="coupon_select_wrpr">
                    <div onClick={() => this.addCoupon()} className="coupon_wrpr_close">x</div>
                    <div className="flex_row">
                        <div className="input-group" style={{ width: '50%' }}>
                            <input placeholder="Add Coupon" type="text" className="coupon_input form-control" style={{ borderRadius: 0 }} onChange={(e)=>this.setState({coupon_q:e.target.value})}  onKeyPress={(e)=>this._handleKeyPress(e)}/>
                        </div>
                        <div>
                            <button className='search_btn' onClick={() => {this.couponApplied()}}>Apply</button>
                        </div>
                    </div>
                    <div className="coupon-listing_wrpr">
                    { this.state.couponData ? this.state.couponData.map((item,id) => {
                      return (
                        <div className="coupon-list">
                            <div className="coupon-icon"></div>
                            <div className="coupon-desc-wrpr">
                                <div className="coupon-header">  {item.code}</div>
                                <div className="coupon-desc">{item.footer} </div>
                            </div>
                            <div className="coupon-apply">
                                <button style={{backgroundColor: item.footer==='Expired'?'#e2e0e0':''}} className="button_white" onClick={() => {this.couponApplied(item)}} disabled={item.footer==='Expired'?true:false}>Apply</button>
                            </div>
                        </div>

                        )}):''} 

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
                            <div className="payment_info_green">₹ {this.state.couponAmt?this.state.couponAmt:''}</div>
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
                        {console.log(this.state.discount)}
                        <button className="button_red button_grey">Your total Savings <p>₹ {this.state.discount}</p></button>
                    </div>
                    {/* <div style={{ display: !this.state.paymentModal ? '' : 'none' }}>
                        <button className="button_red" onClick={() => this.readyPayment()}>Make Payment</button>
                    </div> */}

                </div>
                <div className="payment_tabs">
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
                                    <div className="payment_gateway" onClick={() => this.setpayment(index)}>
                                        <input type="radio" id={index+1} name="pay_gates" value={mode.method_name} checked={this.state.payment  === index}  />
                                        <label htmlFor={index+1} >
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
                            {/* <div className="cod_text cod_relative">
                                or
                                        <div className="cod_abs left_abs"></div>
                                <div className="cod_abs right_abs"></div>
                            </div> */}
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