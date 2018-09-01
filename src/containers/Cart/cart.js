import React, { Component } from 'react';
import { Table } from 'reactstrap';
import './cart.css';
import '../../App.css';
import '../HomePage/home.css'
import Header from '../../components/Header/header';
import Slider from "react-slick";
import { Link } from 'react-router-dom';
import save from '../../assets/save.png';
import store from '../../assets/Store.png';
import withRouter from 'react-router-dom/withRouter';
import { DELIVERY_CHARGE, CREATE_NEW_CART } from '../../utis/D2';
import axios from 'axios'
import Axios from 'axios';


class CartList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalAmount: undefined,
            totalFullAmount: undefined,
            savedAmt: undefined,
            delivery_fee: undefined, cartEmpty: false
        }
        // this.next = this.next.bind(this);
        // this.previous = this.previous.bind(this);
    }

    componentWillMount() {
        let userData = localStorage.getItem('userDetails');
        if (userData == null) {
            window.location.href = "/login"
        }
        this.getLocalData();
    }

    // next() {
    //     this.Slider.slickNext();
    // }
    // previous() {
    //     this.Slider.slickPrev();
    // }
    handleChange(type, index) {
        let counts = this.state.counter;
        if (type == 'dec') {
            if (counts[index] > 0) {
                counts[index] = this.state.counter[index] - 1;
            }
        }
        else {
            counts[index] = this.state.counter[index] + 1;
        }
        this.setState({ counter: counts });

    }


    storeCart(type, i) {
        let cartObj = this.state.cartObj;
        if (type === 'incr') {
            console.log('1')
            cartObj[i].product_quantity = this.state.cartObj[i].product_quantity + 1;
            // this.setState({
            //       indexing:this.state.indexing + 1
            // })
        }
        else if (type === 'decr') {

            if (cartObj[i].product_quantity > 1) {
                cartObj[i].product_quantity = this.state.cartObj[i].product_quantity - 1;
            }
            else {
                cartObj.splice(i, 1);
            }

            // console.log(cartObj)
            // cartObj[i].product_quantity = undefined




        }
        else if (type == 'clear') {
            cartObj.splice(i, 1);
        }
        else
            this.setState({
                cartObj: cartObj,
            })
        localStorage.setItem('cartObj', JSON.stringify(cartObj));
        // storeReduxData({ 'cartObj': cartObj, 'cartObjCount': cartObjCount })
        this.getLocalData();
    }

    getLocalData() {
        let cartObj = localStorage.getItem('cartObj');
        console.log(JSON.parse(cartObj));
        if (JSON.parse(cartObj) != null) {


            let totalAmount = 0;
            let totalFullAmount = 0;
            let savedAmt = 0;
            let amt;
            for (let i = 0; i < JSON.parse(cartObj).length; i++) {

                amt = JSON.parse(cartObj)[i].productData.saleprice / 100;
                let fullamt = JSON.parse(cartObj)[i].productData.mrp / 100
                let qty = JSON.parse(cartObj)[i].product_quantity
                totalFullAmount = (fullamt * qty) + totalFullAmount
                totalAmount = (amt * qty) + totalAmount
                console.log(totalAmount, totalFullAmount);
                savedAmt = totalFullAmount - totalAmount
            }

            this.setState({
                cartObj: JSON.parse(cartObj),
                totalAmount: totalAmount,
                totalFullAmount: totalFullAmount,
                savedAmt: savedAmt
            })
            this.getDeliveryCharge();
        }
        else {
            this.setState({
                cartEmpty: true
            })
        }
    }
    getDeliveryCharge() {
        let details = {
            "stores": "[651]"
        };
        let loginDetails = JSON.parse(localStorage.getItem('userToken'))
        let formBody = [];
        for (let property in details) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        axios({
            method: 'POST',
            url: DELIVERY_CHARGE,
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded',
                "Authorization": 'Bearer ' + loginDetails.access_token
            },
            data: formBody
        })
            .then((value) => {
                let del_charge = value.data[0].delivery_charge;
                let str = del_charge.indexOf('INR');
                let val = parseInt(del_charge.slice(0, str - 1))
                this.setState({
                    delivery_fee: val
                })
            })
            .catch((errr) => {
                this.getRefreshToken(loginDetails, "getDeliveryCharge")
                console.log(errr.response)
            })


    }
    getRefreshToken(val, type) {
        console.log(val.refresh_token)
        axios({
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
                this[type]();
                // this.checkout();
            })
            .catch((err) => {
                console.log(err)
            })
    }
    create_cart() {
        let user = JSON.parse(localStorage.getItem('userDetails'))
        let location_dc = JSON.parse(localStorage.getItem('location_dc'))
        let userToken = JSON.parse(localStorage.getItem('userToken'))
        let loc = JSON.parse(localStorage.getItem('location'))
        let storeOne = [];
        for (let i = 0; i < this.state.cartObj.length; i++) {
            storeOne[i] = {
                "cartCount": this.state.cartObj[i].product_quantity,
                "lineItemId": "0",
                "productId": this.state.cartObj[i].productData.pid,
                "storeId": location_dc.StoreID

            }
        }
        let k11_cart = storeOne;
        axios({
            url: CREATE_NEW_CART,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + userToken.access_token,
                'Accept': 'application/json'
            },
            data: {
                "uid": user.user.uid,
                "order_type": "web",
                "delivery_centre": location_dc.DistributionCentreId,
                "latitude": loc.lat,
                "longitude": loc.lng,
                'k11_cart': k11_cart
            }

            // data:JSON.stringify(details)

        })
            .then((data) => {
                console.log(data.data, '1111');
                window.location = '/checkout?order_id=' + data.data[0].order_id;
                // Actions.address_time({ total: this.state.totalAmount, totalFullAmount: this.state.totalFullAmount, order_id: data.data[0].order_id, uid: uid });
                // Actions.add_address();
            })
            .catch((error) => {
                console.log(error.response, '3')
                this.getRefreshToken(userToken, "postDatas")
            })
    }

    redirect(){
       window.location.href = "/"
    }

    render() {
        const deals_settings = {
            dots: false,
            infinite: true,
            slidesToShow: 2,
            slidesToScroll: 1,
            arrows: false,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                    }
                },
                {
                    breakpoint: 800,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                    }
                },
            ]
        };
        return (

            <div>
                <div>
                    <Header change={this.state.change} cartIcon={false}/>
                </div>

                {this.state.cartObj ? (this.state.cartObj.length > 0 ? (
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'row', padding: '5', margin: '25px 0 0 10%' }}>
                            <div><Link to="/">Home</Link></div>
                            <div style={{ margin: '0 5px' }}>/</div>
                            <div><Link className="bread_crum_red" to="#">Cart</Link></div>
                        </div>
                        <div style={{ width: '80%', margin: '10px auto 0' }}>
                            <h5>Your Grocery Bag</h5>
                        </div>

                        {/* {this.state.data.map((data, index) => {
                        return( */}
                        <div style={{ width: '80%', margin: '0 auto 25px', border: '1px solid #dedede', marginTop: 10 }}>
                            <div style={{ width: '100%', backgroundColor: '#f7f7f7', height: 35, display: 'flex', alignItems: 'center', borderBottom: '1px solid #dedede' }}>
                                <div ><img src={store}></img></div>
                                <div>
                                    Header for the store
                        </div>
                            </div>
                            <div style={{ height: '100%', paddingBottom: 10 }}>
                                <table className="table table-fixed" style={{ margin: 10 }} >

                                    <thead>



                                        <tr style={{ display: 'flex' }}>
                                            <th className="col-sm-5">Product Info</th>
                                            <th className="col-sm-2">Unit Price</th>
                                            <th className="col-sm-2">Quantity</th>
                                            <th className="col-sm-1">Price</th>
                                            <th className="col-sm-1">Savings</th>
                                            <th className="col-sm-1"></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            this.state.cartObj ?
                                                (this.state.cartObj.map((item, index) => {
                                                    console.log(item)
                                                    return (

                                                        <tr style={{ display: 'flex', alignItems: 'center', }} key={index}>
                                                            <td className="col-sm-5">
                                                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                                    <div style={{ border: '1px solid #f7f7f7', height: 75, width: 75 }}>
                                                                        <img src={item.productData.image_url} width='100%' />
                                                                    </div>
                                                                    <div style={{ marginLeft: 10 }}>
                                                                        <div style={{ color: '#d4d4d4' }}>{item.productData.title}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="col-sm-2">
                                                                <div>₹ {item.productData.on_sale === true ? item.productData.saleprice / 100 : item.productData.mrp / 100}</div>
                                                                <div style={{ textDecoration: "line-through", fontSize: 14, color: '#d4d4d4', marginLeft: 5 }}>₹{item.productData.mrp / 100}</div>
                                                            </td>
                                                            <td className="col-sm-2">
                                                                <div style={{ display: 'flex', alignContent: 'center', flexDirection: 'row' }}>
                                                                    <div style={{ height: 30, width: 30, alignContent: 'center', backgroundColor: '#cf2127', border: '1px solid #cf2717' }}>
                                                                        <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#fff' }} onClick={() => this.storeCart('decr', index)}>-</div>
                                                                    </div>
                                                                    <div style={{ height: 30, width: 30, alignContent: 'center', backgroundColor: '#fff', border: '1px solid #cf2717' }}>
                                                                        <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#cf2127' }}>{item.product_quantity}</div>
                                                                    </div>
                                                                    <div style={{ height: 30, width: 30, alignContent: 'center', backgroundColor: '#cf2127', border: '1px solid #cf2717' }}>
                                                                        <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#fff' }} onClick={() => this.storeCart('incr', index)}>+</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="col-sm-1">₹{item.productData.on_sale === true ? item.productData.saleprice / 100 * item.product_quantity : item.productData.mrp / 100 * item.product_quantity}</td>
                                                            <td className="col-sm-1">₹{item.productData.on_sale === true ? item.productData.mrp / 100 - item.productData.saleprice / 100 : 0}</td>
                                                            <td className="col-sm-1" onClick={() => this.storeCart('clear')}>x</td>
                                                        </tr>


                                                    )
                                                })) : ''
                                        }

                                    </tbody>


                                </table>
                            </div>
                        </div>

                        <div style={{ width: '80%', margin: '0 auto', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <div style={{ width: '60%', alignContent: 'center', position: 'relative' }}>

                            </div>
                            <div style={{ width: '40%', marginTop: 35 }}>
                                <div style={{ width: '100%' }}>
                                    <div className="payment_info_wrpr" style={{ width: '100%', marginTop: 0 }}>
                                        <div style={{ width: '100%', height: 5, backgroundColor: "#cf2717" }}></div>
                                        <div className="payment_info_block">
                                            <div className="payment_info_desc_wrpr">
                                                <div className="payment_info_bold">Store Subtotal</div>
                                                <div className="payment_info_bold">₹ {this.state.totalAmount}</div>
                                            </div>
                                            <div className="payment_info_desc_wrpr">
                                                <div>Delivery Charges</div>
                                                <div className="payment_info_green">₹ {this.state.delivery_fee}</div>
                                            </div>
                                        </div>
                                        <div className="payment_info_desc_wrpr horizontal_border">
                                            <div className="payment_info_bold payment_info_red">Order Total</div>
                                            <div className="payment_info_bold payment_info_red">₹ {this.state.totalAmount + this.state.delivery_fee}</div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center',backgroundColor: '#f5f5f5' }}>
                                            <div><img style={{ margin: 'auto' }} src={save}></img></div>
                                            <div><button className="button_red button_grey">Your total Savings <p>₹ {this.state.savedAmt}</p></button></div>
                                        </div>
                                        {/* <div style={{ display: !this.state.paymentModal ? '' : 'none' }}>
                                    <button className="button_red" onClick={() => this.readyPayment()}>Make Payment</button>
                                </div> */}

                                    </div>
                                </div>
                                {/* <div style={{ width: '100%', fontSize: 12, marginTop: 5 }}>ⓘ Coupons & Bank Offers can be applied in payment page</div> */}
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', height: 50, marginTop: 10 }}>
                                    <div style={{ width: '40%', marginRight: 10 }}>
                                        <button onClick={()=>window.location.href="/"} className="search_btn" style={{ borderRadius: 0, backgroundColor: '#fff', color: '#cf2717', border: '1px solid #cf2717' }} >Continue Shopping </button>
                                    </div>
                                    <div style={{ width: 'auto' }}>
                                        <button onClick={() => this.create_cart()} className="search_btn" style={{ borderRadius: 0 }}><div >Proceed to Checkout</div> </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (<div style={{ width: '100%', height: '100vh',alignContent:'center',justifyContent:'center',alignItems:'center',display:'flex',flexDirection:'column' }}>
                <div>You have no items in the cart</div>
                <div style={{marginTop:25}}>
                <button className="search_btn" style={{ borderRadius: 0 }} onClick={()=>this.redirect()}>Continue Shopping </button>
                </div>
                </div>)
                )
                    : (<div style={{ width: '100%', height: '100vh',alignContent:'center',justifyContent:'center',alignItems:'center',display:'flex',flexDirection:'column' }}>
                    <div>You have no items in the cart</div>
                    <div style={{marginTop:25}}>
                    <button className="search_btn" style={{ borderRadius: 0 }} onClick={()=>this.redirect()}>Continue Shopping </button>
                    </div>
                    </div>)
                });
              
 
            </div>
        )
          
    }
}

export default CartList;