import React, { Component } from 'react';
import { Table } from 'reactstrap';
import '../../App.css';
import emptycart from './empty-shopping-cart.png';
import '../../containers/HomePage/home.css'
import Header from '../../components/Header/header';
import Slider from "react-slick";
import { Link } from 'react-router-dom';
import save from '../../assets/save.png';
import store from '../../assets/Store.png';
import withRouter from 'react-router-dom/withRouter';
import { DELIVERY_CHARGE, CREATE_NEW_CART } from '../../utis/D2';
import axios from 'axios'
import Axios from 'axios';
import './minicart.css';
import close_icon from '../../assets/close icon gary@2x.png';
import { config } from '../../firebase/firebase';
import firebase from 'firebase';

const width = window.screen.width;



class Minicart extends Component  {
constructor(props) {
        super(props);
        if (!firebase.apps.length) {
            this.app = firebase.initializeApp(config);
      }
      else
            this.app = firebase;
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
        else
        this.getLocalData();
    }
    componentWillReceiveProps(){
        let userData = localStorage.getItem('userDetails');
        if (userData == null) {
            window.location.href = "/login"
        }
        else
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

            if(this.props.revChange){this.props.revChange()}
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
            // this.getDeliveryCharge();
        }
        else {
            this.setState({
                cartEmpty: true
            })
        }
    }
    // getDeliveryCharge() {
    //     let details = {
    //         "stores": "[651]"
    //     };
    //     let loginDetails = JSON.parse(localStorage.getItem('userToken'))
    //     let formBody = [];
    //     for (let property in details) {
    //         let encodedKey = encodeURIComponent(property);
    //         let encodedValue = encodeURIComponent(details[property]);
    //         formBody.push(encodedKey + "=" + encodedValue);
    //     }
    //     formBody = formBody.join("&");
    //     axios({
    //         method: 'POST',
    //         url: DELIVERY_CHARGE,
    //         headers: {
    //             "Content-Type": 'application/x-www-form-urlencoded',
    //             "Authorization": 'Bearer ' + loginDetails.access_token
    //         },
    //         data: formBody
    //     })
    //         .then((value) => {
    //             let del_charge = value.data[0].delivery_charge;
    //             let str = del_charge.indexOf('INR');
    //             let val = parseInt(del_charge.slice(0, str - 1))
    //             this.setState({
    //                 delivery_fee: val
    //             })
    //         })
    //         .catch((errr) => {
    //             this.getRefreshToken(loginDetails, "getDeliveryCharge")
    //             console.log(errr.response)
    //         })


    // }
    getRefreshToken(val, type) {
        console.log(val.refresh_token)
        axios({
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

    redirectTo(data) {
        if(data){
            console.log(data)
            window.location.href = "/"
        }
        else
        window.location.href = "/cart"
    }

    
    render() {
        
        return (
        <div>
           {this.state.cartObj ? (this.state.cartObj.length > 0 ? (
            <div style={{ width:'100%',height: 'auto',fontSize:12}}>
                                <table className="table table-fixed" style={{ margin: 5 }} >

                                    <thead className="minicart_table_head">

                                    <tr style={{ display: 'flex' }}>
                                            <th  className="col-md-3 col-sm-4">Title</th>
                                            <th className="col-md-2 hidden-sm">Store</th>
                                            <th className="col-sm-2">Unit Price</th>
                                            <th className="col-md-2 col-sm-3">Quantity</th>
                                            <th className="col-sm-2">Total</th>
                                            
                                            <th className="col-sm-1"></th>
                                        </tr>
                                    </thead>


                                    <tbody className="minicart_table_body">

                                    {
                                            this.state.cartObj ?
                                                (this.state.cartObj.map((item, index) => {
                                                    return (
                                         <tr style={{ display: 'flex', alignItems: 'center', }} key={index}>
                                                            <td className="col-md-3 col-sm-4">
                                                                <div style={{ display: 'flex', justifyContent:'space-between',flexDirection: 'row', alignItems: 'center' }}>
                                                                    <div style={{ border: '1px solid #f7f7f7', height: 50, width: 50,marginRight:5 }} className="hidden-sm">
                                                                        <img src={item.productData.image_url} width='100%' />
                                                                    </div>
                                                                    <div style={{width:width>460?"70%":"100%",fontSize:width>460? 12:10}}>{item.productData.title}</div>
                                                                </div>
                                                            </td>
                                                            <td className="col-md-2 hidden-sm">
                                                                <div>My Grocer</div>
                                                            </td>
                                                            <td className="col-sm-2">
                                                                <div>₹ {item.productData.on_sale === true ? item.productData.saleprice / 100 : item.productData.mrp / 100}</div>
                                                                <div style={{ textDecoration: "line-through", fontSize: 14, color: '#d4d4d4', marginLeft: 5 }}>₹{item.productData.mrp / 100}</div>
                                                            </td>
                                                            <td className="col-md-2 col-sm-3">
                                                                <div style={{ display: 'flex', alignContent: 'center', flexDirection: 'row' }}>
                                                                    <div className="mini_add">
                                                                        <div className="mini_add_data" onClick={() => this.storeCart('decr', index)}>-</div>
                                                                    </div>
                                                                    <div className="mini_add mini_value">
                                                                        <div className="mini_add_data mini_value_data">{item.product_quantity}</div>
                                                                    </div>
                                                                    <div className="mini_add">
                                                                        <div className="mini_add_data" onClick={() => this.storeCart('incr', index)}>+</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="col-sm-2">₹ {item.productData.on_sale === true ? item.productData.saleprice*item.product_quantity/ 100 : item.productData.mrp*item.product_quantity/ 100}</td>
                                                            
                                                            <td className="col-sm-1" onClick={() => this.storeCart('clear')}><img src={close_icon} height='15'/></td>
                                                        </tr>
                                                        )})):''}


                                    </tbody>
                                </table>
                                <div >
                                <button onClick={() => this.redirectTo()} className="mini_cart_btn">
                                <div className="mini_cart_footer">View Cart and Checkout</div>
                                <div>₹{this.state.totalAmount}</div>
                                </button>
                                </div>
                            </div>

                            ):
                            
        (<div className="empty-cart" >
            
              <img src={emptycart} height='150px'></img>
              <div>
              <div className='empty-text'>YOUR GROCERY BAG IS EMPTY</div>
              <div><button className="button_white" onClick={()=>this.redirectTo('home')}>Fill it with something</button></div>
           </div>
         
         </div> )):(<div className="empty-cart">
            
            <img src={emptycart} height='150px'></img>
            <div>
            <div className='empty-text'>YOUR GROCERY BAG IS EMPTY</div>
            <div><button className="button_white" onClick={()=>this.redirectTo('home')}>Fill it with something</button></div>
         </div>
       
       </div> )}

                    </div>
        );
    }
}

export default Minicart;


