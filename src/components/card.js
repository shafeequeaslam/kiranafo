import React, { Component } from 'react';
import '../containers/HomePage/home.css';
import '../containers/PLP/plp.css'
import { Col, Row, FormGroup, Input } from 'reactstrap';
import addtocart from '../assets/cart-icon.png';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import { config } from '../firebase/firebase';
import firebase from 'firebase';

let cartObj = undefined;

class CardComponent extends Component {
      constructor(props) {
            super(props);
            if (!firebase.apps.length) {
                  this.app = firebase.initializeApp(config);
            }
            else
                  this.app = firebase;


            //console.log(this.props.item, "12121")
            this.state = {
                  itemData: this.props.item,
                  activeButton: 0,
                  product_quantity: []
            };
            this.setActiveBtn = this.setActiveBtn.bind(this);
      }

      componentWillMount() {
            //console.log(this.state.itemData);
            this.getDatas()

      }
      getDatas() {
            if (this.props.type === "deals" || this.props.type === "cat_deals") {
                  //console.log(this.props, 'Deals')
                  let val = localStorage.getItem('cartObj');
                  this.mapToCart_deals(JSON.parse(val));
                  this.setState({
                        product_deal_details: undefined
                  })
                  this.setState({
                        product_deal_details: this.props.productDeals
                  })
                  console.log(this.props.productDeals, "1212");
                  this.database = this.app.database().ref('stock/' + this.props.productDeals.inner_hits.products.hits.hits[0]._source.pid + '/stock');
                  this.database.on('value', snap => {
                        console.log(snap.val());
                        this.setState({
                              [this.props.productDeals.inner_hits.products.hits.hits[0]._source.pid]: snap.val()
                        })
                        // this.setState({
                        //       [pid]: parseInt(snap.val())
                        // })
                  })

            }
            else {
                  //console.log('here');
                  for (let i = 0; i < this.state.itemData.inner_hits.products.hits.hits.length; i++) {
                        let pid = this.state.itemData.inner_hits.products.hits.hits[i]._source.pid;
                        console.log(pid);
                        this.database = this.app.database().ref('stock/' + pid + '/stock');
                        this.database.on('value', snap => {
                              this.setState({
                                    [pid]: snap.val()
                              })
                        })

                  }

                  console.log(this.state[this.state.itemData.inner_hits.products.hits.hits[0]._source.pid], "1112")
                  let val = localStorage.getItem('cartObj');
                  this.mapToCart(JSON.parse(val))
            }
      }

      componentWillReceiveProps(nextProps, prevProps) {
            // this.setState({
            //       product_deal_details: undefined
            // })
            console.log("121212", nextProps)
            this.getDatas()
            // setTimeout(()=>{this.getDatas()},10)
      }
      mapToCart_deals(val) {
            //console.log(val, this.props.productDeals, "after items click")
            if (val != null) {

                  if (this.props.productDeals.inner_hits.products.hits.hits[0]) {
                        //console.log('121')
                        let a = val.length;
                        // let b = this.state.productDetails[0]._source.products.length;

                        for (let i = 0; i < a; i++) {
                              //console.log(this.props.productDeals.inner_hits.products.hits.hits[0]._source.pid)
                              if (val[i].productData.pid == this.props.productDeals.inner_hits.products.hits.hits[0]._source.pid) {
                                    let pr_q = this.state.product_deal_quantity;
                                    pr_q = val[i].product_quantity
                                    //console.log(pr_q, 'pr')
                                    this.setState({
                                          product_deal_quantity: pr_q
                                    })
                              }


                        }


                        cartObj = val
                  }

            }
            else {
                  cartObj = undefined


            }
      }
      store_deal_Cart(type) {
            //console.log(this.state.product_deal_details, type);
            // this.setState({
            //       unchangeState: false
            // })
            if (cartObj) {
                  //console.log(cartObj)
                  let pid = this.state.product_deal_details.inner_hits.products.hits.hits[0]._source.pid;
                  //console.log(this.state.product_deal_details.inner_hits.products.hits.hits[0]._source, pid, 'pid')

                  let found = cartObj.filter(function (el) {
                        //console.log(el, 'el')
                        return el.productData.pid === pid
                  })[0];
                  if (found) {
                        if (type === 'incr') {
                              //console.log('1')
                              if(this.state[pid] > found.product_quantity) {
                              found.product_quantity = found.product_quantity + 1;
                              let pr_q = this.state.product_deal_quantity;
                              if (pr_q) {
                                    pr_q = found.product_quantity
                              }
                              else
                                    pr_q = 1
                              this.setState({
                                    product_deal_quantity: pr_q,
                              })
                        }
                              else{
                                    alert('You have exceeded the maximum quantity for the product')
                              }
                        }
                        if (type === 'decr') {
                              //console.log('11', found.product_quantity)
                              console.log('1');
                              if (found.product_quantity > 1) {
                                    console.log('2');
                                    found.product_quantity = found.product_quantity - 1;
                                    let pr_q = this.state.product_deal_quantity;
                                    pr_q = found.product_quantity

                                    this.setState({
                                          product_deal_quantity: pr_q,
                                    })
                              }

                              else {
                                    //console.log('here 0')
                                    for (let j = 0; j < cartObj.length; j++) {
                                          console.log('3');
                                          if (cartObj[j].productData.pid === found.productData.pid) {
                                                cartObj.splice(j, 1);
                                                let pr_q = this.state.product_deal_quantity;
                                                pr_q = undefined;
                                                this.setState({
                                                      product_deal_quantity: pr_q
                                                })
                                          }
                                    }

                              }

                              // 

                        }
                  }
                  if (!found) {
                        let pr_q = this.state.product_deal_quantity;
                        // if (!pr_q) {
                        //     pr_q = [];
                        // }
                        pr_q = 1
                        this.setState({
                              product_deal_quantity: pr_q,
                        })
                        //return the new length here cause that is what you did
                        cartObj.push({
                              productData: this.state.product_deal_details.inner_hits.products.hits.hits[0]._source,
                              product_quantity: pr_q
                        });
                  }
                  //console.log(cartObj)

                  localStorage.setItem('cartObj', JSON.stringify(cartObj));
            }

            else {
                  //console.log('ewew')
                  let obj = [
                        {
                              productData: this.state.product_deal_details.inner_hits.products.hits.hits[0]._source,
                              product_quantity: 1
                        }
                  ]
                  this.setState({
                        product_deal_quantity: 1
                  })
                  cartObj = obj;
                  //console.log(obj)
                  localStorage.setItem('cartObj', JSON.stringify(obj));

            }
            this.setState({
                  cartObj: cartObj,

            })
            this.props.change()
      }


      mapToCart(val) {
            //console.log(val, this.state.itemData.inner_hits.products.hits.hits, "after items click")
            if (val != null) {
                  if (this.state.itemData.inner_hits.products.hits.hits) {
                        //console.log('121')
                        let a = val.length;
                        let b = this.state.itemData.inner_hits.products.hits.hits.length;

                        for (let i = 0; i < a; i++) {
                              for (let j = 0; j < b; j++) {
                                    //console.log(this.state.itemData.inner_hits.products.hits.hits[j]._source.pid)
                                    if (val[i].productData.pid == this.state.itemData.inner_hits.products.hits.hits[j]._source.pid) {
                                          let pr_q = this.state.product_quantity;
                                          pr_q[j] = val[i].product_quantity
                                          //console.log(pr_q, 'pr')
                                          this.setState({
                                                product_quantity: pr_q
                                          })
                                    }


                              }




                        }
                        cartObj = val
                  }

            }
            else {
                  cartObj = undefined


            }
      }

      storeCart(type) {
            //console.log(this.state.itemData.inner_hits.products.hits.hits[this.state.activeButton], type);
            // this.setState({
            //       unchangeState: false
            // })
            if (cartObj) {
                  let pid = this.state.itemData.inner_hits.products.hits.hits[this.state.activeButton]._source.pid;

                  let found = cartObj.filter(function (el) {
                        return el.productData.pid == pid
                  })[0];
                  if (found) {
                        if (type === 'incr') {
                              if(this.state[pid] > found.product_quantity){
                               found.product_quantity = found.product_quantity + 1;
                              let pr_q = this.state.product_quantity;
                              if (pr_q[this.state.activeButton]) {
                                    pr_q[this.state.activeButton] = found.product_quantity
                              }
                              else
                                    pr_q[this.state.activeButton] = 1
                              this.setState({
                                    product_quantity: pr_q,
                              })
                        }
                        else{
                              alert('You have exceeded the maximum quantity for the product')
                        }
                        }
                        if (type === 'decr') {
                              //console.log('11', found.product_quantity)
                              if (found.product_quantity > 1) {
                                    found.product_quantity = found.product_quantity - 1;
                                    let pr_q = this.state.product_quantity;
                                    pr_q[this.state.activeButton] = found.product_quantity

                                    this.setState({
                                          product_quantity: pr_q,
                                    })
                              }

                              else {
                                    //console.log('here 0')
                                    for (let j = 0; j < cartObj.length; j++) {
                                          if (cartObj[j].productData.pid === found.productData.pid) {
                                                cartObj.splice(j, 1);
                                                let pr_q = this.state.product_quantity;
                                                pr_q[this.state.activeButton] = undefined;
                                                this.setState({
                                                      product_quantity: pr_q
                                                })
                                          }
                                    }

                              }

                              // 

                        }
                  }
                  if (!found) {
                        let pr_q = this.state.product_quantity;
                        if (!pr_q) {
                              pr_q = [];
                        }
                        pr_q[this.state.activeButton] = 1
                        this.setState({
                              product_quantity: pr_q,
                        })
                        //return the new length here cause that is what you did
                        cartObj.push({
                              productData: this.state.itemData.inner_hits.products.hits.hits[this.state.activeButton]._source,
                              product_quantity: 1
                        });
                  }
                  //console.log(cartObj)

                  localStorage.setItem('cartObj', JSON.stringify(cartObj));
            }

            else {
                  //console.log('ewew')
                  let obj = [
                        {
                              productData: this.state.itemData.inner_hits.products.hits.hits[this.state.activeButton]._source,
                              product_quantity: 1
                        }
                  ]
                  cartObj = obj;
                  localStorage.setItem('cartObj', JSON.stringify(obj));

            }
            this.setState({
                  cartObj: cartObj
            })
            this.props.change()

      }


      setActiveBtn(i) {
            //console.log(i.target.value)
            this.setState({ activeButton: i.target.value })
      }

      render() {

            return (
                  (!this.props.type || this.props.type != "deals" && this.props.type != "cat_deals") ?
                        (
                              <Col sm="3" key={this.props.index}>
                                    <div className="deal_cards" style={{ position: 'relative' }}>
                                          <Link to={{ pathname: '/product_desc', search: '?productId=' + this.state.itemData ? this.state.itemData._source.nid : '', state: { 'item': this.state.itemData ? this.state.itemData : '', "type": 'nid' } }}  >
                                                <div className="card_img">
                                                      <img src={this.state.itemData ? this.state.itemData.inner_hits.products.hits.hits[this.state.activeButton]._source.image_url : ''} height='100%' />
                                                </div>
                                          </Link>
                                          <Link to={{ pathname: '/product_desc', search: '?productId=' + this.state.itemData ? this.state.itemData._source.nid : '', state: { 'item': this.state.itemData ? this.state.itemData : '', "type": 'nid' } }}  >
                                                <div className="card_title_lineOne">{this.state.itemData ? this.state.itemData.inner_hits.products.hits.hits[this.state.activeButton]._source.title : ''}</div>
                                          </Link>
                                          {/* <div className="card_title_lineOne"
                          text={product.title}
                          maxLine='2'
                          ellipsis='...'
                          trimRight
                          basedOn='words'
                      /> */}
                                          {/* <div className="card_title_lineTwo">Lorem Ipsum</div> */}
                                          <div className="card_qty_container">
                                                {this.state.itemData ? this.state.itemData.inner_hits.products.hits.hits.length > 1 ?
                                                      (<FormGroup>
                                                            <Input type="select" name="select" id="exampleSelect" onChange={(e) => this.setActiveBtn(e)}>

                                                                  {this.state.itemData.inner_hits.products.hits.hits.map((select, ind) => {
                                                                        //console.log(select, 'select')
                                                                        return (
                                                                              <option key={ind} value={ind}>{select._source.variant_type}</option>
                                                                        )

                                                                  })
                                                                  }

                                                            </Input>
                                                      </FormGroup>) :
                                                      (
                                                            <div style={{ width: '100%', fontSize: 16, marginTop: 5, textAlign: 'center' }}>{this.state.itemData ? this.state.itemData.inner_hits.products.hits.hits[this.state.activeButton]._source.variant_type : ''}</div>
                                                      )
                                                      : ""}
                                          </div>
                                          <div className="card_price_container">
                                                <div style={{ width: 'auto', fontSize: 16, color: '#bbc0c7', marginRight: 10, textDecorationStyle: 'solid', textDecorationLine: 'line-through', textDecorationColor: '#bbc0c7' }}>₹{this.state.itemData ? this.state.itemData.inner_hits.products.hits.hits[this.state.activeButton]._source.mrp / 100 : ""}</div>
                                                <div style={{ width: 'auto', color: 'black', fontSize: 18, textAlign: 'left' }}>₹{this.state.itemData ? this.state.itemData.inner_hits.products.hits.hits[this.state.activeButton]._source.on_sale === true ? this.state.itemData.inner_hits.products.hits.hits[this.state.activeButton]._source.saleprice / 100 : this.state.itemData.inner_hits.products.hits.hits[this.state.activeButton]._source.mrp / 100 : ""}</div>
                                          </div>
                                          {/* <div className="card_button_container">
                          <button className="card_button">Add to 🛒</button>
                      </div> */}
                                          <div className="card_button_container">
                                                {
                                                      this.state[this.state.itemData.inner_hits.products.hits.hits[this.state.activeButton]._source.pid] > 0 ? (
                                                            this.state.product_quantity ?
                                                                  (
                                                                        this.state.product_quantity[this.state.activeButton] ? (
                                                                              <div className="card_button_container">
                                                                                    <button className="card_button card_btn_plus" onClick={() => this.storeCart('decr')}>-
                                                                  </button>
                                                                                    <div className="card_btn_num"> {this.state.product_quantity[this.state.activeButton]}</div>
                                                                                    <button className="card_button card_btn_plus" onClick={() => this.storeCart('incr')}>+
                                                                  </button>
                                                                              </div>
                                                                        ) : (
                                                                                    <div className="card_button_container" style={{ display: 'flex' }} onClick={() => this.storeCart('incr')}>
                                                                                          <button className="card_button">Add to<img style={{ border: 'none', display: 'inline' }} src={addtocart} height="20" /></button>
                                                                                    </div>
                                                                              )
                                                                  )
                                                                  :
                                                                  (
                                                                        <div className="card_button_container" style={{ display: 'flex' }} onClick={() => this.storeCart('incr')}>
                                                                              <button className="card_button">Add to<img style={{ border: 'none', display: 'inline' }} src={addtocart} height="20" /></button>
                                                                        </div>
                                                                  )
                                                      ) : (
                                                                  <div className="card_button_container" style={{ display: 'flex' }}>
                                                                        <button className="card_button" disabled>Out of Stock</button>
                                                                  </div>
                                                            )
                                                }
                                          </div>
                                    </div>
                              </Col>
                        ) : (
                              this.props.type == 'deals' ? (
                                    <div className={this.props.plp ? "col-sm-3" : ''} style={{ position: 'relative' }}>

                                          <div className="deal_cards">
                                                <Link to={{ pathname: '/product_desc', search: '?product=' + this.state.product_deal_details ? this.state.product_deal_details.inner_hits.products.hits.hits[0]._source.pid : '', state: { 'item': this.state.product_deal_details ? this.state.product_deal_details.inner_hits.products.hits.hits[0] : '', 'type': "pid" } }}>
                                                      <div className="card_img" style={{ backgroundImage: "url(" + this.state.product_deal_details ? this.state.product_deal_details.inner_hits.products.hits.hits[0]._source.image_url + ")" : '' }}></div>
                                                      <div className="card_title_lineOne">{this.state.product_deal_details ? this.state.product_deal_details.inner_hits.products.hits.hits[0]._source.title : ""}</div>
                                                </Link>
                                                <div className="card_price_container">
                                                      <div style={{ width: 'auto', fontSize: 16, color: '#bbc0c7', marginRight: 10, textDecorationStyle: 'solid', textDecorationLine: 'line-through', textDecorationColor: '#bbc0c7' }}>₹{this.state.product_deal_details ? this.state.product_deal_details.inner_hits.products.hits.hits[0]._source.mrp / 100 : ''}</div>
                                                      <div style={{ width: 'auto', color: 'black', fontSize: 18, textAlign: 'left' }}>₹{this.state.product_deal_details ? this.state.product_deal_details.inner_hits.products.hits.hits[0]._source.on_sale === true ? this.state.product_deal_details.inner_hits.products.hits.hits[0]._source.saleprice / 100 : this.state.product_deal_details.inner_hits.products.hits.hits[0]._source.mrp / 100 : ''}</div>
                                                </div>
                                                {
                                                      this.state[this.state.product_deal_details.inner_hits.products.hits.hits[0]._source.pid] > 0 ?
                                                            (
                                                                  this.state.product_deal_quantity ?
                                                                        (
                                                                              <div className="card_button_container">
                                                                                    <button className="card_button card_btn_plus" onClick={() => this.store_deal_Cart('decr')}>-
                                                                  </button>
                                                                                    <div className="card_btn_num"> {this.state.product_deal_quantity}</div>
                                                                                    <button className="card_button card_btn_plus" onClick={() => this.store_deal_Cart('incr')}>+
                                                                  </button>
                                                                              </div>
                                                                        )
                                                                        :
                                                                        (
                                                                              <div className="card_button_container" style={{ display: 'flex' }} onClick={() => this.store_deal_Cart('incr')}>
                                                                                    <button className="card_button">Add to<img style={{ border: 'none', display: 'inline' }} src={addtocart} height="20" /></button>
                                                                              </div>
                                                                        )
                                                            ) : (
                                                                  <div className="card_button_container" style={{ display: 'flex' }}>
                                                                        <button className="card_button" disabled>Out of Stock</button>
                                                                  </div>
                                                            )
                                                }
                                          </div>
                                    </div>
                              ) : (
                                          <Col sm="3" key={this.props.index}>
                                                <div className="deal_cards" style={{ position: 'relative' }}>
                                                      <Link to={{ pathname: '/product_desc', search: '?product=' + this.state.product_deal_details ? this.state.product_deal_details.inner_hits.products.hits.hits[0]._source.pid : '', state: { 'item': this.state.product_deal_details ? this.state.product_deal_details.inner_hits.products.hits.hits[0] : '', 'type': "pid" } }}>
                                                            <div className="card_img" style={{ backgroundImage: "url(" + this.state.product_deal_details ? this.state.product_deal_details.inner_hits.products.hits.hits[0]._source.image_url + ")" : '' }}></div>
                                                            <div className="card_title_lineOne">{this.state.product_deal_details ? this.state.product_deal_details.inner_hits.products.hits.hits[0]._source.title : ''}</div>
                                                      </Link>
                                                      <div className="card_price_container">
                                                            <div style={{ width: 'auto', fontSize: 16, color: '#bbc0c7', marginRight: 10, textDecorationStyle: 'solid', textDecorationLine: 'line-through', textDecorationColor: '#bbc0c7' }}>₹{this.state.product_deal_details ? this.state.product_deal_details.inner_hits.products.hits.hits[0]._source.mrp / 100 : ''}</div>
                                                            <div style={{ width: 'auto', color: 'black', fontSize: 18, textAlign: 'left' }}>₹{this.state.product_deal_details ? this.state.product_deal_details.inner_hits.products.hits.hits[0]._source.on_sale === true ? this.state.product_deal_details.inner_hits.products.hits.hits[0]._source.saleprice / 100 : this.state.product_deal_details.inner_hits.products.hits.hits[0]._source.mrp / 100 : ''}</div>
                                                      </div>
                                                      {
                                                            this.state[this.state.product_deal_details.inner_hits.products.hits.hits[0]._source.pid] > 0 ? (


                                                                  this.state.product_deal_quantity ?
                                                                        (
                                                                              <div className="card_button_container">
                                                                                    <button className="card_button card_btn_plus" onClick={() => this.store_deal_Cart('decr')}>-
                                                              </button>
                                                                                    <div className="card_btn_num"> {this.state.product_deal_quantity}</div>
                                                                                    <button className="card_button card_btn_plus" onClick={() => this.store_deal_Cart('incr')}>+
                                                              </button>
                                                                              </div>
                                                                        )
                                                                        :
                                                                        (
                                                                              <div className="card_button_container" style={{ display: 'flex' }} onClick={() => this.store_deal_Cart('incr')}>
                                                                                    <button className="card_button">Add to<img style={{ border: 'none', display: 'inline' }} src={addtocart} height="20" /></button>
                                                                              </div>
                                                                        )
                                                            ) : (
                                                                        <div className="card_button_container" style={{ display: 'flex' }}>
                                                                              <button className="card_button" disabled>Out of Stock</button>
                                                                        </div>
                                                                  )
                                                      }
                                                </div>
                                          </Col>
                                    )
                        )

            );
      }
}

export default CardComponent;