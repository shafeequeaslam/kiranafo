import React, { Component } from 'react';
import Sidebar from '../../components/Sidebar/sidebar';
import Slider from "react-slick";
import { Col, Row, FormGroup, Input } from 'reactstrap'
import Header from '../../components/Header/header';
import { PRODUCT_BY_PID_FETCH, PRODUCT_BY_NID_FETCH } from '../../utis/API';
import desription from '../../assets/product-description@2x.png';
import source from '../../assets/product-source@2x.png';
import prodspeciality from '../../assets/speciality@2x.png';
import produsage from '../../assets/usage@2x.png';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import addtocart from '../../assets/cart-icon.png';
import { PRODUCT_WITH_CATEGORIES_FETCH, SEARCH_RESULTS_FULL } from "../../utis/API";
import './pdp.css';
import { Link } from 'react-router-dom';
import { config } from '../../firebase/firebase';
import firebase from 'firebase';
import FooterComponent from '../../components/footer-components/Footer/containers/footer';
import ReactImageMagnify from 'react-image-magnify';



const baseUrl = "https://img1.kirana11.com/files/public/styles/pdp_page/public/690225101127.jpg?QVNo3W2uiXKqvOOp0dIb7vJKAs8HRIwb&itok=S4L6DAC0";
this.im_arr = undefined;
let cartObj = undefined;
class ProductDescription extends Component {

    constructor(props) {
        super(props);
        if (!firebase.apps.length) {
            this.app = firebase.initializeApp(config);
        }
        else
            this.app = firebase;

        this.state = {
            product_quantity: [],
            product_deal_quantity: undefined,
            im_arr: [],
            activeButton: 0,
            levelOne: undefined,
            levelTwo: undefined,
            levelThree: undefined
        };
    }

    componentDidMount = () => {
        //console.log(this.props)
        // this.setState({
        //     productId: parseInt(this.props.location.state.item._source.nid),
        //     type_fetch: this.props.location.state.type,

        // });

        this.loadProductDetails();

    }
    setrevChange(){
        this.setState({
            revchange: undefined
        })
        this.setState({
            revchange: true
        }) 
        setTimeout(()=>{
            let val = JSON.parse(localStorage.getItem('cartObj'));
        setTimeout(()=>{
            if(this.state.product_loaded==="1"){
                this.mapToCart_deals(val,"refresh");
            }
            else if(this.state.product_loaded==="0")
            this.mapToCart(val,"refresh");
        },200)
        
        },500)
        
        
    
    }

    loadProductDetails = (data) => {
        // //console.log("LogProductDetails", parseInt(this.props.location.state.item._source.nid));
        let url = undefined;
        let id;
        if (data) {
            id = data;

        }
        // //console.log(this.props.location.state.type)
        if (this.props.location.state) {
            if (this.props.location.state.type == 'nid') {
                url = "nid"
                id = this.props.location.state.item._source.nid
                //console.log('here1')
            }
            else if (this.props.location.state.type == 'pid') {
                url = "pid"
            }
        }
        else if (!this.props.location.state) {
            let urlHere = window.location.href;
            let url_string = urlHere;
            let urlStr = new URL(url_string);
            if(
                urlStr.searchParams.get("pid")!=null
            )
            url="pid"
            else
            url = "nid"
            id = urlStr.searchParams.get("product");
        }

        if (url == "nid") {
            console.log('here')
            fetch(PRODUCT_BY_NID_FETCH + id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
                .then(res => res.json())
                .then((productDetails) => {
                    let im_arr = [];
                    // for (let i = 0; i < productDetails.length; i++) {
                    im_arr.push(productDetails[0]._source.products[this.state.activeButton].image_url);
                    if (productDetails[0]._source.products[this.state.activeButton].sub_images) {
                        for (let j = 0; j < productDetails[0]._source.products[this.state.activeButton].sub_images.length; j++) {
                            // //console.log(productDetails[0]._source.products[i].sub_images[j].image_url)
                            im_arr.push(productDetails[0]._source.products[this.state.activeButton].sub_images[j].image_url)
                        }

                        // im_arr=[...im_arr,...Object.values(productDetails[0]._source.products[i].sub_images)];
                    }
                    for (let i = 0; i < productDetails[0]._source.products.length; i++) {
                        let pid = productDetails[0]._source.products[this.state.activeButton].pid;
                        console.log(pid);
                        this.database = this.app.database().ref('stock/' + pid + '/stock');
                        this.database.on('value', snap => {
                            console.log(pid,snap.val())
                            this.setState({
                                [pid]: snap.val()
                            })
                        })
                    }
                    //console.log(im_arr);
                    this.im_arr = im_arr
                    this.setState({
                        product_data: productDetails[0]._source,
                        productDetails: productDetails,
                        im_arr: im_arr,
                        product_loaded:"0",
                        sidebarState: true
                    })

                    let val = localStorage.getItem('cartObj');
                   

                    setTimeout(() => {
                        this.mapToCart(JSON.parse(val))
                        if (this.state.product_data) {
                            console.log(this.state.product_data);
                            fetch(PRODUCT_WITH_CATEGORIES_FETCH, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json'
                                }
                            })
                                .then(res => res.json())
                                .then((deals) => {
                                    console.log("Deals", deals);
                                    let dat = deals[0]._source.main_category_tree
                                    for (let i = 0; i < dat.length; i++) {
                                        if (dat[i].tid == this.state.product_data.parent_parent_category) {
                                            localStorage.setItem('pdpMenuLevel1', JSON.stringify(dat[i]));
                                            for (let j = 0; j < dat[i].sub_category_tree.length; j++) {
                                                if (dat[i].sub_category_tree[j].tid == this.state.product_data.parent_category) {
                                                    localStorage.setItem('pdpMenuLevel2', JSON.stringify(dat[i].sub_category_tree[j]));
                                                    for (let k = 0; k < dat[i].sub_category_tree[j].variant_category_tree.length; k++) {
                                                        if (dat[i].sub_category_tree[j].variant_category_tree[k].tid == this.state.product_data.category_id) {
                                                            localStorage.setItem('pdpMenuLevel3', JSON.stringify([dat[i].sub_category_tree[j].variant_category_tree[k]]));
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    console.log('here')
                                    let levelOne = JSON.parse(localStorage.getItem('pdpMenuLevel1'));
                                    let levelTwo = JSON.parse(localStorage.getItem('pdpMenuLevel2'));
                                    let levelThree = JSON.parse(localStorage.getItem('pdpMenuLevel3'));

                                    setTimeout(() => {
                                        if (levelOne && levelTwo && levelThree != null)
                                            this.setState({
                                                levelOne: levelOne,
                                                levelTwo: levelTwo,
                                                levelThree: levelThree
                                            })
                                    }, 500)
                                }, (error) => {
                                    console.error(error)
                                });
                        }
                    }, 500)

                }, (error) => {
                    console.error(error)
                });
        }

        else if (url == "pid") {
            //console.log(this.props.location.state.item, "item");
            let im_arr = [];
            // for (let i = 0; i < productDetails.length; i++) {
            im_arr.push(this.props.location.state.item._source.image_url);
            if (this.props.location.state.item._source.sub_images) {
                for (let j = 0; j < this.props.location.state.item._source.sub_images.length; j++) {
                    // //console.log(this.state.productDetails[0]._source.products[i].sub_images[j].image_url)
                    im_arr.push(this.props.location.state.item._source.sub_images[j].image_url)
                }

                // im_arr=[...im_arr,...Object.values(productDetails[0]._source.products[i].sub_images)];
            }

            let pid = this.props.location.state.item._source.pid;
            console.log(pid);
            this.database = this.app.database().ref('stock/' + pid + '/stock');
            this.database.on('value', snap => {
                console.log(pid,snap.val())
                this.setState({
                    [pid]: snap.val()
                })
            })
            this.setState({
                product_deal_details: this.props.location.state.item._source,
                im_arr: im_arr,
                product_loaded:"1"
            })
            let val = localStorage.getItem('cartObj');
            this.mapToCart_deals(JSON.parse(val))
        }


    }
    mapToCart_deals(val,type) {
        //console.log(val, this.props.location.state.item._source, "after items click")
        if(!type){
        if (val) {

            if (this.props.location.state.item._source) {
                //console.log('121')
                let a = val.length;
                // let b = this.state.productDetails[0]._source.products.length;

                for (let i = 0; i < a; i++) {
                    //console.log(this.props.location.state.item._source.pid)
                    if (val[i].productData.pid == this.props.location.state.item._source.pid) {
                        let pr_q = this.state.product_deal_quantity;
                        //console.log(val[i].product_quantity);
                        pr_q = val[i].product_quantity
                        this.setState({
                            product_quantity: undefined
                        })
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
    else{
            this.setState({
                product_quantity: undefined
            })
            cartObj = undefined
    }
    }
    store_deal_Cart(type) {
        this.setState({
            change: undefined
        })
        //console.log(this.state.product_deal_details, type);
        // this.setState({
        //       unchangeState: false
        // })
        if (cartObj) {
            let pid = this.state.product_deal_details.pid;
            //console.log(this.state.product_deal_details, pid, 'pid')

            let found = cartObj.filter(function (el) {
                return el.productData.pid === pid
            })[0];
            if (found) {
                if (type === 'incr') {
                    //console.log('1')
                    if(this.state[pid] > found.product_quantity){
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
                    if (found.product_quantity > 1) {
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
                    productData: this.state.product_deal_details,
                    product_deal_quantity: 1
                });
            }
            //console.log(cartObj)

            localStorage.setItem('cartObj', JSON.stringify(cartObj));
        }

        else {
            //console.log('ewew')
            let obj = [
                {
                    productData: this.state.product_deal_details,
                    product_quantity: 1
                }
            ]
            //console.log(obj)
            cartObj = obj;
            localStorage.setItem('cartObj', JSON.stringify(obj));

        }
        this.setState({
            cartObj: cartObj,
            change: true
        })
    }

    mapToCart(val,type) {
        console.log(val)
        if(!type){
        if (val != null) {
            if (this.state.productDetails[0]._source.products) {
                let a = val.length;
                let b = this.state.productDetails[0]._source.products.length;
               
                for (let i = 0; i < a; i++) {
                    for (let j = 0; j < b; j++) {
                        console.log(this.state.productDetails[0]._source.products[j].pid,val[i])
                        if (val[i].productData.pid == this.state.productDetails[0]._source.products[j].pid) {
                            let pr_q = this.state.product_quantity;
                            pr_q[j] = val[i].product_quantity
                            console.log(pr_q)
                            this.setState({
                                product_quantity: undefined
                            })
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
    else{
        this.setState({
            product_quantity: undefined
        })
        cartObj = undefined
    }
    }

    storeCart(type) {
        this.setState({
            change: undefined
        })
        //console.log(this.state.productDetails[0]._source.products[this.state.activeButton], type);
        // this.setState({
        //       unchangeState: false
        // })
        if (cartObj) {
            //console.log(cartObj)
            let pid = this.state.productDetails[0]._source.products[this.state.activeButton].pid;
            //console.log(this.state.productDetails[0], pid, 'pid')

            let found = cartObj.filter(function (el) {
                //console.log(el, 'el')
                return el.productData.pid === pid
            })[0];
            if (found) {
                if (type === 'incr') {
                    //console.log('1')
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
                    productData: this.state.productDetails[0]._source.products[this.state.activeButton],
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
                    productData: this.state.productDetails[0]._source.products[this.state.activeButton],
                    product_quantity: 1
                }
            ]
            //console.log(obj)
            cartObj = obj;
            localStorage.setItem('cartObj', JSON.stringify(obj));

        }
        this.setState({
            cartObj: cartObj,
            change: true
        })

    }
    setActiveBtn(i) {
        //console.log(i.target.value)
        this.setState({ activeButton: i.target.value, im_arr: [] })
        let im_arr = [];
        // for (let i = 0; i < productDetails.length; i++) {
        im_arr.push(this.state.productDetails[0]._source.products[i.target.value].image_url);
        if (this.state.productDetails[0]._source.products[i.target.value].sub_images) {
            for (let j = 0; j < this.state.productDetails[0]._source.products[i.target.value].sub_images.length; j++) {
                // //console.log(this.state.productDetails[0]._source.products[i].sub_images[j].image_url)
                im_arr.push(this.state.productDetails[0]._source.products[i.target.value].sub_images[j].image_url)
            }

            // im_arr=[...im_arr,...Object.values(productDetails[0]._source.products[i].sub_images)];
        }
        this.setState({ im_arr: im_arr })
    }
    filterData(a, b) {
        console.log(a, b);
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
                    <Header change={this.state.change} location_header={(data)=>this.setState({overflowState:data})} revChange={() => this.setrevChange()}/>
                </div>

                <div style={{ display: 'flex', width: '98%', margin: '50px auto' }}>


                    {/* <div className="col-sm-3" style={{ padding: 0 }}>
                        <Sidebar />
                    </div> */}
                    {
                        this.state.productDetails ? (
                            <div className="col-sm-12">
                                <div style={{ display: 'flex', flexDirection: 'row', padding: '5', margin: '25px 0', width: '100%' }}>
                                    <div ><Link to="/" className="bread_crum_red">Home</Link></div>
                                    <div style={{ margin: '0 5px' }} style={{search:this.state.levelOne? "":'none'}}>/</div>
                                    <Link to={{ pathname: '/listing', search:this.state.levelOne ? '?categoryId=' + this.state.levelOne.tid :'', state: { 'item': this.state.levelOne ? this.state.levelOne:'', level: 1 } }}  className="bread_crum_red"> {this.state.levelOne ? this.state.levelOne.name : ''}</Link>
                                    {/* <div></div> */}

                                    <div style={{ margin: '0 5px' }} style={{search:this.state.levelOne&&this.state.levelTwo ? "":'none'}}>/</div>
                                    <Link to={{ pathname: '/listing', search:this.state.levelTwo ? '?categoryId=' + this.state.levelTwo.tid :'', state: { 'item': this.state.levelOne ? this.state.levelOne:'', level: 2 } }}  className="bread_crum_red"> {this.state.levelOne && this.state.levelTwo ? this.state.levelTwo.name : ""}</Link>
                                    
                                    <div style={{ margin: '0 5px' }} style={{search: this.state.levelOne&&this.state.levelTwo&&this.state.levelThree ? "":'none'}}>/</div>
                                    <Link to={{ pathname: '/listing', search:this.state.levelThree ? '?categoryId=' + this.state.levelThree[0].tid :'', state: { 'item': this.state.levelOne ? this.state.levelOne:'', level: 3 } }}  className="bread_crum_red" onClick={()=>{
                                        alert(this.state.levelThree.tid)
                                    }}> { this.state.levelOne && this.state.levelTwo && this.state.levelThree ? ReactHtmlParser(this.state.levelThree[0].name) : ''}</Link>
                                    
                                    <div style={{ margin: '0 5px' }} style={{search:this.state.levelOne && this.state.levelTwo && this.state.levelThree&&this.state.product_data ? "":'none'}}>/</div>
                                    <div >{this.state.levelOne && this.state.levelTwo && this.state.levelThree && this.state.product_data ? this.state.product_data.title : ''}</div>

                                </div>


                                <div className="col-sm-12">
                                    <Row>
                                        <div className="col-sm-3" style={{ padding: 0 }}>
                                            <Sidebar menuItems={this.state.levelThree ? this.state.levelThree : ''} category_name={this.state.levelTwo ? this.state.levelTwo.name : ''} dataId={(id, index) => this.filterData(id, index)} />
                                        </div>
                                        <div className="col-sm-9">
                                            <Row>
                                                <Col sm="5" style={{ border: "1px solid #f7f7f7" }} >
                                                    <Slider {...settings} >
                                                        {this.state.im_arr ? (
                                                            this.state.im_arr.map((img, id) => {
                                                                //console.log(img, "img");
                                                                return (
                                                                    <ReactImageMagnify enlargedImageContainerStyle ={{position:'absolute',right:0,top:100,height:500,width:500,border:'1px solid'}}{...{
                                                                        smallImage: {
                                                                            alt: 'Wristwatch by Ted Baker London',
                                                                            isFluidWidth: true,
                                                                            src: img
                                                                        },
                                                                        largeImage: {
                                                                            src: img,
                                                                            width: 1200,
                                                                            height: 1800,
                                                                            position:'absolute',
                                                                            left:'100%',
                                                                            top:200,
                                                                            zIndex:5
                                                                        },
                                                                        enlargedImageContainerDimensions: {
                                                                            width: '200%',
                                                                            height: '100%',
                                                                            left:'100%',
                                                                            right:'100%'
                                                                        }
                                                                    }} />
                                                                    // <div>
                                                                    //     <img src={img} />
                                                                    // </div>
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
                                                                        //console.log(select, 'select')
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
                                                            this.state[this.state.productDetails[0]._source.products[this.state.activeButton].pid] > 0 ?
                                                                (
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
                                    </Row>
                                </div>

                            </div>

                        ) :
                            (
                                this.state.product_deal_details ? (
                                    <div className="col-sm-12">
                                        <Row>
                                            <Col sm="5" style={{ border: "1px solid #f7f7f7" }} >
                                                <Slider {...settings} >
                                                    {this.state.im_arr ? (
                                                        this.state.im_arr.map((img, id) => {
                                                            //console.log(img, "img");
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
                                                    {this.state.product_deal_details.brand_name}
                                                </div>
                                                <div style={{ fontSize: 20, color: '#cf2717' }}>
                                                    {this.state.product_deal_details.title}
                                                </div>
                                                <div className="card_qty_container">
                                                    <div style={{ width: '100%', fontSize: 16 }}>{this.state.product_deal_details.variant_type}</div>
                                                </div>
                                                <div style={{ backgroundColor: '#e4e2e5', height: 25, width: '100%', textIndent: 10, fontWeight: '700' }}>
                                                    Sold by
                                                </div>
                                                <div className="mrp_container">
                                                    <div><p style={{ fontWeight: '700', fontSize: 14, display: 'inline' }}>MRP</p>

                                                        <p style={{ display: 'inline', textDecoration: 'line-through', marginLeft: 10 }}>₹{this.state.product_deal_details.mrp / 100}</p>

                                                    </div>
                                                    <div>₹{this.state.product_deal_details.on_sale === true ? this.state.product_deal_details.saleprice / 100 : this.state.product_deal_details.mrp / 100}</div>
                                                </div>


                                                {/* <div className="card_button_container"> */}
                                                {
                                                    this.state[this.state.product_deal_details.pid] > 0 ?
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
                                                {/* </div> */}
                                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                    <Col sm="3" style={{ display: this.state.product_deal_details.shelf_life ? "" : 'none', borderRight: '1px solid #ccc' }}>
                                                        <div style={{ color: '#427846' }}> *Shelf Life</div>
                                                        <div style={{ color: '#898989' }}> {ReactHtmlParser(this.state.product_deal_details.shelf_life)}</div>
                                                    </Col>
                                                    <Col sm="9" style={{ display: this.state.product_deal_details.shelf_life ? "" : 'none', marginLeft: 10 }}>

                                                        <div style={{ color: '#427846' }}> *Storage Recommendations</div>
                                                        <div style={{ color: '#898989' }}>  {this.state.productDetails ? ReactHtmlParser(this.state.productDetails[0]._source.storage_recommendations) : ''}</div>
                                                    </Col>
                                                </div>
                                            </Col>
                                        </Row>
                                        <div style={{ padding: 10, marginTop: 75, }}>
                                            <div style={{ height: 50, backgroundColor: '#e4e2e5', alignItems: 'center', display: this.state.product_deal_details.product_description ? "flex" : 'none', }}>
                                                <div style={{ display: 'flex' }}><img style={{ marginLeft: 5, height: 25 }} src={desription}></img></div>
                                                <div style={{ padding: 10, fontSize: 16, fontWeight: 'bold' }}>Product Description</div>
                                            </div>
                                            <div style={{ display: this.state.product_deal_details.product_description ? "" : 'none', padding: '10px 10px 25px', fontSize: 14 }}>{this.state.productDetails ? ReactHtmlParser(this.state.productDetails[0]._source.product_description) : ''}</div>

                                            <div style={{ display: this.state.product_deal_details.speciality ? "flex" : 'none', height: 50, backgroundColor: '#e4e2e5', alignItems: 'center', }}>
                                                <div style={{ display: 'flex' }}><img style={{ marginLeft: 5, height: 25 }} src={prodspeciality}></img></div>
                                                <div style={{ padding: 10, fontSize: 16, fontWeight: 'bold' }}> Speciality</div>
                                            </div>

                                            <div style={{ display: this.state.product_deal_details.speciality ? "" : 'none', padding: '10px 10px 25px', fontSize: 14 }}>{this.state.productDetails ? ReactHtmlParser(this.state.productDetails[0]._source.speciality) : ''}</div>

                                            <div style={{ display: this.state.product_deal_details.usage ? "flex" : 'none', height: 50, backgroundColor: '#e4e2e5', alignItems: 'center', }}>
                                                <div style={{ display: 'flex' }}><img style={{ marginLeft: 5, height: 25 }} src={produsage}></img></div>
                                                <div style={{ padding: 10, fontSize: 16, fontWeight: 'bold' }}> Usage</div>
                                            </div>
                                            <div style={{ display: this.state.product_deal_details.usage ? "" : 'none', padding: '10px 10px 25px', fontSize: 14 }}>{ReactHtmlParser(this.state.product_deal_details.usage)}</div>


                                            <div style={{ display: this.state.product_deal_details.product_source ? "flex" : 'none', height: 50, backgroundColor: '#e4e2e5', alignItems: 'center', }}>
                                                <div style={{ display: 'flex' }}><img style={{ marginLeft: 5, height: 25 }} src={source}></img></div>
                                                <div style={{ padding: 10, fontSize: 16, fontWeight: 'bold' }}> Product Source</div>
                                            </div>
                                            <div style={{ display: this.state.product_deal_details.product_source ? "" : 'none', padding: '10px 10px 25px', fontSize: 14 }}>{ReactHtmlParser(this.state.productDetails ? this.state.productDetails[0]._source.product_source : "")}</div>
                                        </div>
                                    </div>

                                ) : ""

                            )
                    }
                </div>
    <FooterComponent/>
            </main>

        );
    }
}

export default ProductDescription;