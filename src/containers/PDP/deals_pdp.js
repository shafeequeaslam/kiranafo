import React, { Component } from 'react';
import Sidebar from '../../components/Sidebar/sidebar';
import Slider from "react-slick";
import { Col, Row, FormGroup, Input } from 'reactstrap'
import Header from '../../components/Header/header';
import { PRODUCT_BY_PID_FETCH } from '../../utis/API';
import desription from '../../assets/product-description@2x.png';
import source from '../../assets/product-source@2x.png';
import prodspeciality from '../../assets/speciality@2x.png';
import produsage from '../../assets/usage@2x.png';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import addtocart from '../../assets/cart-icon.png';
import './pdp.css'

const baseUrl = "https://img1.kirana11.com/files/public/styles/pdp_page/public/690225101127.jpg?QVNo3W2uiXKqvOOp0dIb7vJKAs8HRIwb&itok=S4L6DAC0";
this.im_arr = undefined;
let cartObj = undefined;
class DealsProductDescription extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product_quantity: [],
            im_arr: [],
            activeButton: 0
        };
    }

    componentDidMount = () => {
        console.log(this.props)
            // this.setState({
            //     productId: parseInt(this.props.location.state.item._source.nid),
            //     type_fetch: this.props.location.state.type,

            // });
            this.loadProductDetails();
        
    }

    loadProductDetails = (data) => {
        console.log("LogProductDetails", parseInt(this.props.location.state.item));
        
    }
    mapToCart(val) {
        console.log(val, this.state.productDetails[0]._source.products, "after items click")
        if (val != null) {

            if (this.state.productDetails[0]._source.products) {
                console.log('121')
                let a = val.length;
                let b = this.state.productDetails[0]._source.products.length;

                for (let i = 0; i < a; i++) {
                    for (let j = 0; j < b; j++) {
                        console.log(this.state.productDetails[0]._source.products[j].pid)
                        if (val[i].productData.pid == this.state.productDetails[0]._source.products[j].pid) {
                            let pr_q = this.state.product_quantity;
                            pr_q[j] = val[i].product_quantity
                            console.log(pr_q, 'pr')
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
        console.log(this.state.productDetails[0]._source.products[this.state.activeButton], type);
        // this.setState({
        //       unchangeState: false
        // })
        if (cartObj) {
            console.log(cartObj)
            let pid = this.state.productDetails[0]._source.products[this.state.activeButton].pid;
            console.log(this.state.productDetails[0], pid, 'pid')

            let found = cartObj.filter(function (el) {
                console.log(el, 'el')
                return el.productData.pid === pid
            })[0];
            if (found) {
                if (type === 'incr') {
                    console.log('1')
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
                if (type === 'decr') {
                    console.log('11', found.product_quantity)
                    if (found.product_quantity > 1) {
                        found.product_quantity = found.product_quantity - 1;
                        let pr_q = this.state.product_quantity;
                        pr_q[this.state.activeButton] = found.product_quantity

                        this.setState({
                            product_quantity: pr_q,
                        })
                    }

                    else {
                        console.log('here 0')
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
                    productData: this.state.productDetails[0]._source.products[this.state.activeButton],
                    product_quantity: 1
                });
            }
            console.log(cartObj)

            localStorage.setItem('cartObj', JSON.stringify(cartObj));
        }

        else {
            console.log('ewew')
            let obj = [
                {
                    productData: this.state.productDetails[0]._source.products[this.state.activeButton],
                    product_quantity: 1
                }
            ]
            console.log(obj)
            localStorage.setItem('cartObj', JSON.stringify(obj));

        }
        this.setState({
            cartObj: cartObj
        })

    }
    setActiveBtn(i) {
        console.log(i.target.value)
        this.setState({ activeButton: i.target.value, im_arr: [] })
        let im_arr = [];
        // for (let i = 0; i < productDetails.length; i++) {
        im_arr.push(this.state.productDetails[0]._source.products[i.target.value].image_url);
        if (this.state.productDetails[0]._source.products[i.target.value].sub_images) {
            for (let j = 0; j < this.state.productDetails[0]._source.products[i.target.value].sub_images.length; j++) {
                // console.log(this.state.productDetails[0]._source.products[i].sub_images[j].image_url)
                im_arr.push(this.state.productDetails[0]._source.products[i.target.value].sub_images[j].image_url)
            }

            // im_arr=[...im_arr,...Object.values(productDetails[0]._source.products[i].sub_images)];
        }
        this.setState({ im_arr: im_arr })
    }

    render() {
        let img_arr = this.state.im_arr;
        let settings = {
            customPaging: function (i) {
                return (
                    <a>
                        <img src={`${img_arr[i]}`} />
                    </a>
                );
            },
            dots: true,
            dotsClass: "slick-dots slick-thumb",
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
        };
        return (
            <main className="pdpImg">
                <div>
                    <Header />
                </div>
                <div style={{ backgroundImage: 'url("https://img1.kirana11.com/files/public/categoryfruits-vegetables-fed-14.jpg?ETlDb15Go2_HfTGERE41L1CGWtSTHxHg")' }} className="heroContainer">
                </div>
                <div style={{ display: 'flex', width: '90%', margin: '50px auto' }}>
                    {/* <div className="col-sm-3" style={{ padding: 0 }}>
                        <Sidebar />
                    </div> */}

                    <div className="col-sm-12">
                        <Row>
                            <Col sm="5" style={{ border: "1px solid #f7f7f7" }} >
                                <Slider {...settings} >
                                    {this.state.im_arr ? (
                                        this.state.im_arr.map((img, id) => {
                                            console.log(img, "img");
                                            return (
                                                <div>
                                                    <img src={img} />
                                                </div>
                                            )
                                        })) : ''}


                                </Slider>
                            </Col>
                            <Col sm="7">
                                <div style={{ fontSize: 20, color: '#787878' }}>
                                    {this.state.productDetails ? this.state.productDetails[0]._source.brand_name : ''}
                                </div>
                                <div style={{ fontSize: 20, color: '#cf2717' }}>
                                    {this.state.productDetails ? this.state.productDetails[0]._source.title : ''}
                                </div>
                                <div className="card_qty_container">
                                    {this.state.productDetails ? this.state.productDetails[0]._source.products.length > 1 ?
                                        (<FormGroup>
                                            <Input type="select" name="select" id="exampleSelect" onChange={(e) => this.setActiveBtn(e)}>

                                                {this.state.productDetails[0]._source.products.map((select, ind) => {
                                                    console.log(select, 'select')
                                                    return (
                                                        <option key={ind} value={ind}>{select.variant_type}</option>
                                                    )

                                                })
                                                }

                                            </Input>
                                        </FormGroup>) :
                                        (
                                            <div style={{ width: '100%', fontSize: 16 }}>{this.state.productDetails[0]._source.products[this.state.activeButton].variant_type}</div>
                                        ) : (
                                            ""
                                        )
                                    }
                                </div>
                                <div style={{ backgroundColor: '#e4e2e5', height: 25, width: '100%', textIndent: 10, fontWeight: '700' }}>
                                    Sold by
                                </div>
                                <div className="mrp_container">
                                    <div><p style={{ fontWeight: '700', fontSize: 14, display: 'inline' }}>MRP</p>

                                        <p style={{ display: 'inline', textDecoration: 'line-through', marginLeft: 10 }}>₹{this.state.productDetails ? this.state.productDetails[0]._source.products[this.state.activeButton].mrp / 100 : ''}</p>

                                    </div>
                                    <div>₹{this.state.productDetails ? this.state.productDetails[0]._source.products[this.state.activeButton].on_sale === true ? this.state.productDetails[0]._source.products[this.state.activeButton].saleprice / 100 : this.state.productDetails[0]._source.products[this.state.activeButton].mrp / 100 : ''}</div>
                                </div>


                                <div className="card_button_container">
                                    {

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
                                    }
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Col sm="3" style={{ display: this.state.productDetails ? this.state.productDetails[0]._source.shelf_life ? "" : 'none' : 'none', borderRight: '1px solid #ccc' }}>
                                        <div style={{ color: '#427846' }}> *Shelf Life</div>
                                        <div style={{ color: '#898989' }}> {this.state.productDetails ? ReactHtmlParser(this.state.productDetails[0]._source.shelf_life) : ''}</div>
                                    </Col>
                                    <Col sm="9" style={{ display: this.state.productDetails ? this.state.productDetails[0]._source.shelf_life ? "" : 'none' : 'none', marginLeft: 10 }}>

                                        <div style={{ color: '#427846' }}> *Storage Recommendations</div>
                                        <div style={{ color: '#898989' }}>  {this.state.productDetails ? ReactHtmlParser(this.state.productDetails[0]._source.storage_recommendations) : ''}</div>
                                    </Col>
                                </div>
                            </Col>
                        </Row>
                        <div style={{ padding: 10, marginTop: 75, }}>
                            <div style={{ height: 50, backgroundColor: '#e4e2e5', alignItems: 'center', display: this.state.productDetails ? this.state.productDetails[0]._source.product_description ? "flex" : 'none' : 'none', }}>
                                <div style={{ display: 'flex' }}><img style={{ marginLeft: 5, height: 25 }} src={desription}></img></div>
                                <div style={{ padding: 10, fontSize: 16, fontWeight: 'bold' }}>Product Description</div>
                            </div>
                            <div style={{ display: this.state.productDetails ? this.state.productDetails[0]._source.product_description ? "" : 'none' : 'none', padding: '10px 10px 25px', fontSize: 14 }}>{this.state.productDetails ? ReactHtmlParser(this.state.productDetails[0]._source.product_description) : ''}</div>

                            <div style={{ display: this.state.productDetails ? this.state.productDetails[0]._source.speciality ? "flex" : 'none' : 'none', height: 50, backgroundColor: '#e4e2e5', alignItems: 'center', }}>
                                <div style={{ display: 'flex' }}><img style={{ marginLeft: 5, height: 25 }} src={prodspeciality}></img></div>
                                <div style={{ padding: 10, fontSize: 16, fontWeight: 'bold' }}> Speciality</div>
                            </div>

                            <div style={{ display: this.state.productDetails ? this.state.productDetails[0]._source.speciality ? "" : 'none' : 'none', padding: '10px 10px 25px', fontSize: 14 }}>{this.state.productDetails ? ReactHtmlParser(this.state.productDetails[0]._source.speciality) : ''}</div>

                            <div style={{ display: this.state.productDetails ? this.state.productDetails[0]._source.usage ? "flex" : 'none' : 'none', height: 50, backgroundColor: '#e4e2e5', alignItems: 'center', }}>
                                <div style={{ display: 'flex' }}><img style={{ marginLeft: 5, height: 25 }} src={produsage}></img></div>
                                <div style={{ padding: 10, fontSize: 16, fontWeight: 'bold' }}> Usage</div>
                            </div>
                            <div style={{ display: this.state.productDetails ? this.state.productDetails[0]._source.usage ? "" : 'none' : 'none', padding: '10px 10px 25px', fontSize: 14 }}>{ReactHtmlParser(this.state.productDetails ? this.state.productDetails[0]._source.usage : "")}</div>


                            <div style={{ display: this.state.productDetails ? this.state.productDetails[0]._source.product_source ? "flex" : 'none' : 'none', height: 50, backgroundColor: '#e4e2e5', alignItems: 'center', }}>
                                <div style={{ display: 'flex' }}><img style={{ marginLeft: 5, height: 25 }} src={source}></img></div>
                                <div style={{ padding: 10, fontSize: 16, fontWeight: 'bold' }}> Product Source</div>
                            </div>
                            <div style={{ display: this.state.productDetails ? this.state.productDetails[0]._source.product_source ? "" : 'none' : 'none', padding: '10px 10px 25px', fontSize: 14 }}>{ReactHtmlParser(this.state.productDetails ? this.state.productDetails[0]._source.product_source : "")}</div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

export default DealsProductDescription;