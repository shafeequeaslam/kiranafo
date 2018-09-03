import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import classnames from 'classnames';
import './myorders.css';
import Header from '../Header/header';
import Sidebar from '../Sidebar/sidebar';
import Axios from 'axios';
import AccSidebar from '../Sidebar/acc_sidebar';
import { Z_FILTERED } from 'zlib';
import checked from '../../assets/check.png'



class MyOrders extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: 1,
            OtpBtnActive: false,
            isLoggedIn: true, closedOrders: undefined,
            modal: false
        };
        this.changeBtnColor = this.changeBtnColor.bind(this);
    }
    componentDidMount() {
        this.getData();
    }
    getData() {
        let usr = JSON.parse(localStorage.getItem('userToken'))
        Axios({
            method: 'get',
            url: 'https://d2.kirana11.com/kirana11_api/get-orders-list.json',
            headers: {
                'Authorization': 'Bearer ' + usr.access_token
            }
        })
            .then((data) => {
                console.log(data.data, '12122');
                let openOrders = [];
                let closedOrders = [];
                for (let i = 0; i < data.data.length; i++) {
                    if (data.data[i].order_status === "Pending" || data.data[i].order_status === "Processing") {
                        openOrders.push(data.data[i]);
                    }
                    else {
                        closedOrders.push(data.data[i])
                    }
                }

                console.log(closedOrders, openOrders, '12121');

                if (closedOrders.length == 0) {
                    closedOrders = undefined;
                }
                if (openOrders.length == 0) {
                    openOrders = undefined;
                }
                setTimeout(() => {
                    this.setState({
                        openOrders: openOrders,
                        closedOrders: closedOrders
                    })
                }, 100)
            })
            .catch((err) => {
                console.log(err.response)
                // this.getRefreshToken(usr,"getData")
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
    changeBtnColor() {
        this.setState({
            OtpBtnActive: true
        })
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
                modal: false
            });
        }
    }
    download(id) {
        let usr = JSON.parse(localStorage.getItem('userToken'))
       let url="https://d2.kirana11.com/k11-pdf-redirect?refresh_token="+usr.refresh_token+"&order_id=" + id;
        window.open(url, 'Download')
    }

    modalOpen() {
        this.setState({
            modal: !this.state.modal
        })
    }

    openOrders(id) {
        Axios({
            url: 'https://d2.kirana11.com/kirana11_api/order_resources/get_order_list.json',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "order_id": id
            }
        })
            .then((data) => {
                this.modalOpen()
                this.setState({
                    orderDetails: undefined
                })
                console.log(data.data);
                let str = data.data.order_details.address;
                let indices = [];
                let string=[]
                for (let i = 0; i < str.length; i++) {
                    if (str[i] === ",") 
                    indices.push(i);
                }
                for(let i=0;i<indices.length;i++){
                    if(i == 0){
                        string.push(str.slice(0,indices[i]))
                    }
                    else{
                        string.push(str.slice(indices[i-1] + 1,indices[i]))
                    }
                }
                setTimeout(()=>{
                    this.setState({
                        orderDetails: data.data.order_details,
                        address:string
                    })
                },100)
                
            })
            .catch((err) => {
                console.log(err.response,err)
            })
    }

    render() {
        // if(this.state.isLoggedIn){
        //     return(
        //         <Redirect to="/home" />
        //     )
        // }
        return (
            <main>
                <div>
                    <Header />
                </div>
                <div style={{ display: 'flex', width: '90%', margin: '50px auto' }}>
                    <div className="col-sm-3" style={{ padding: 0 }}>
                        <AccSidebar activeType={0} />
                    </div>

                    <div className="col-sm-9" style={{ maxHeight: 500 }}>
                        <div >
                            <div style={{ width: '100%', margin: '0 auto' }}>
                                <div style={{ width: '100%', display: 'flex', fontSize: 24, color: '#666' }}>
                                    My orders
                      </div>

                                <Nav>
                                    <NavItem style={{ width: 120 }}>
                                        <NavLink style={{ textAlign: 'center' }}
                                            active={this.state.activeTab === 1}
                                            className="login"
                                            onClick={() => { this.toggle(1); }}>
                                            Open Orders
                                    </NavLink>
                                    </NavItem>
                                    <NavItem style={{ width: 120, marginLeft: 5 }}>
                                        <NavLink style={{ textAlign: 'center' }}
                                            className={classnames(["login", { active: this.state.activeTab === 2 }])}
                                            onClick={() => { this.toggle(2); }}
                                        >
                                            Closed Orders
                                    </NavLink>
                                    </NavItem>

                                </Nav>
                                <div className="tab_content_container order_details_container" style={{ display: this.state.modal === false ? 'none' : '' }}>
                                    <div className="order_details_header">Order {this.state.orderDetails ? this.state.orderDetails.order_number : ""}</div>
                                    <div className="order_det_close" onClick={() => this.modalOpen()}>X</div>
                                    <table className="table table-fixed card_details_table" >

                                        <thead>



                                            <tr style={{ display: 'flex', borderBottom: "1px solid #f7f7f7" }}>
                                                <th className="col-sm-8"> Item</th>
                                                <th className="col-sm-2">Quantity</th>
                                                <th className="col-sm-2">Total</th>
                                            </tr>
                                        </thead>
                                        {this.state.orderDetails ? this.state.orderDetails.items.map((order, index) => {
                                            return (

                                                <tbody>



                                                    <tr style={{ display: 'flex' }} key={index}>
                                                        <td className="col-sm-8" onClick={() => this.openOrders(order.order_number)}>
                                                            <div>{order.title}</div>
                                                        </td>
                                                        <td className="col-sm-2">
                                                            <div>{parseInt(order.quantity) }</div>
                                                        </td>
                                                        <td className="col-sm-2">
                                                            <div>{order.total}</div>
                                                            {/* <div>{order.delivery_timings}</div> */}
                                                        </td>


                                                    </tr>



                                                </tbody>


                                            )
                                        }) :

                                            ""}
                                    </table>
                                    <div className="subTotal_details">
                                        <div style={{ width: "40%" }}>
                                            <div className="subTotal_details_wrpr">
                                                <div>Subtotal</div>
                                                <div>{this.state.orderDetails ? this.state.orderDetails.subtotal : ''}</div>
                                            </div>
                                            <div className="subTotal_details_wrpr">
                                                <div>Delivery Charges</div>
                                                <div>{this.state.orderDetails ? this.state.orderDetails.delivery_charges : ''}</div>
                                            </div>
                                            <div className="subTotal_details_wrpr">
                                                <div style={{ fontWeight: 600 }}>Order total</div>
                                                <div>{this.state.orderDetails ? this.state.orderDetails.total_order_amount : ''}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="order_ex_data">
                                        <div className="order_det_header">Shipping Address</div>
                                        <div className="order_det_desc">
                                            {this.state.address?this.state.address.map((addr,id)=>{
                                                return(
                                                <div key={id}>{addr}</div>
                                                )
                                            }):''}
                                        </div>
                                    </div>
                                    <div className="order_ex_data _flex">
                                        <div className="order_det_header">Delivery Date and Time :</div>
                                        <div className="order_det_desc" style={{marginLeft:10}}>
                                            {this.state.orderDetails?this.state.orderDetails.delivery_date_timings:''}
                                        </div>
                                    </div>
                                </div>
                                <div className="tab_content_container" style={{ display: this.state.modal === true ? 'none' : '' }}>
                                    <TabContent activeTab={this.state.activeTab}>
                                        <TabPane tabId={1}>
                                            {this.state.openOrders ? this.state.openOrders.map((order, index) => {
                                                return (
                                                    <div className="card_orders">
                                                        <table className="table table-fixed card_orders_table" >

                                                            <thead>



                                                                <tr style={{ display: 'flex' }}>
                                                                    <th className="col-sm-2"> Order number</th>
                                                                    <th className="col-sm-2">Status</th>
                                                                    <th className="col-sm-4">Estimated Delivery Time</th>
                                                                    {/* <th className="col-sm-3">Delivery Address</th> */}
                                                                    <th className="col-sm-2">Order Value</th>
                                                                    <th className="col-sm-2"></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>



                                                                <tr style={{ display: 'flex' }} key={index}>
                                                                    <td className="col-sm-2">
                                                                        <div>{order.order_number}</div>
                                                                    </td>
                                                                    <td className="col-sm-2">
                                                                        <div>{order.order_status}</div>
                                                                    </td>
                                                                    <td className="col-sm-4">
                                                                        <div>{order.delivery_date}</div>
                                                                        <div>{order.delivery_timings}</div>
                                                                    </td>
                                                                    <td className="col-sm-2">
                                                                        <div>{order.total_order_amount}</div>
                                                                    </td>
                                                                    <td className="col-sm-2">
                                                                        <div>
                                                                            <button className="button_red btn_green" onClick={() => this.openOrders(order.order_number)}>Order Details</button>
                                                                            <button className="button_red btn_green" >Cancel Order</button>
                                                                        </div>
                                                                    </td>
                                                                </tr>



                                                            </tbody>

                                                        </table>
                                                        <div className="order_status_markers">
                                                            <div>
                                                                <div className="marker" style={{backgroundImage:order.order_status === ('Pending'||'Processing')?'url('+checked+')':''}}></div>
                                                                <div className="text_marker">Order Placed</div>
                                                            </div>
                                                            <div>
                                                                <div className="marker" style={{backgroundImage:order.order_status === ('Processing')?'url('+checked+')':''}}></div>
                                                                <div className="text_marker">Order out for delivery</div>
                                                            </div>
                                                            <div>
                                                                <div className="marker"></div>
                                                                <div className="text_marker">Order has been delivered</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }) : ""}

                                            <div style={{ display: this.state.openOrders ? 'none' : "" }}>You have not placed any orders with us yet</div>

                                        </TabPane>
                                        <TabPane tabId={2}>
                                            <table className="table table-fixed" style={{ display: this.state.closedOrders ? '' : "none" }} >

                                                <thead>



                                                    <tr style={{ display: 'flex', borderBottom: "1px solid #f7f7f7" }}>
                                                        <th className="col-sm-2"> Order number</th>
                                                        <th className="col-sm-3">Status</th>
                                                        <th className="col-sm-3">Ordered Date</th>
                                                        <th className="col-sm-2">Order Value</th>
                                                        <th className="col-sm-2">Invoice PDF</th>
                                                    </tr>
                                                </thead>
                                                {this.state.closedOrders ? this.state.closedOrders.map((order, index) => {
                                                    return (

                                                        <tbody>



                                                            <tr style={{ display: 'flex' }} key={index}>
                                                                <td className="col-sm-2 order_num" onClick={() => this.openOrders(order.order_number)}>
                                                                    <div>{order.order_number}</div>
                                                                </td>
                                                                <td className="col-sm-3">
                                                                    <div>{order.order_status}</div>
                                                                </td>
                                                                <td className="col-sm-3">
                                                                    <div>{order.delivery_date}</div>
                                                                    {/* <div>{order.delivery_timings}</div> */}
                                                                </td>
                                                                <td className="col-sm-2">
                                                                    <div>{order.total_order_amount}</div>
                                                                </td>
                                                                <td className="col-sm-2">
                                                                    <a className="invoice" href={'https://d2.kirana11.com/invoice-pdf/'+order.order_number} download>{order.order_number}</a>
                                                                </td>

                                                            </tr>



                                                        </tbody>


                                                    )
                                                }) :

                                                    ""}
                                            </table>
                                            <div style={{ display: this.state.closedOrders ? 'none' : '' }}>You have not placed any orders with us yet</div>
                                        </TabPane>
                                    </TabContent>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

export default MyOrders;


