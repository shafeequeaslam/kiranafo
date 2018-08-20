import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    TabContent, TabPane, Card, Button, CardTitle, CardText, Row, Col
} from 'reactstrap';
import LinesEllipsis from 'react-lines-ellipsis'
import classnames from 'classnames'
import './home.css';
import '../../App.css';
import Slider from "react-slick";
import { Link } from 'react-router-dom'
import Header from '../../components/Header/header';
import { PRODUCT_DEALS_FETCH, HOMEPAGE_CAT_DEALS, HOMEPAGE_CAT_DEALS_PRODUCTS } from "../../utis/API";
import FooterComponent from '../../components/Footer/footer';
import CardComponent from '../../components/card';
import Axios from 'axios';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: '0',
            productDeals: undefined,
            categorisedProducts: [],
            cat_deals_products:undefined
        };
        this.toggle = this.toggle.bind(this);

        this.nextOne = this.nextOne.bind(this);
        this.previousOne = this.previousOne.bind(this);

        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
    }

    nextOne() {
        this.Slider.slickNext();
    }
    previousOne() {
        this.Slider.slickPrev();
    }
    next() {
        this.Slider.slickNext();
    }
    previous() {
        this.Slider.slickPrev();
    }

    componentDidMount = () => {
        this.getProductShockingDeals();
        this.getProductCategoriesList();
    }

    getProductShockingDeals = () => {
        fetch(PRODUCT_DEALS_FETCH, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(res => res.json())
            .then((deals) => {
                console.log("Deals", deals);
                this.setState({
                    productDeals: deals
                });
            }, (error) => {
                console.error(error)
            });
    }

    getProductCategoriesList = () => {
        Axios(HOMEPAGE_CAT_DEALS, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((deals) => {
                console.log("Deals1", deals.data);
                let deal_names = [];
                let dealData = {};
                for (let i = 0; i < deals.data.length; i++) {
                    deal_names[i] = deals.data[i].key;
                    Axios(HOMEPAGE_CAT_DEALS_PRODUCTS + deals.data[i].key, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    })
                    .then((data)=>{
                        
                        dealData.i.push(data.data);
                        console.log(dealData,"11")
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
                }
                console.log((dealData),"data fro deals")
                    this.setState({
                        categorisedProducts: deal_names,
                        cat_deals_products :dealData
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }




    renderNavItems = () => {
        const navItems = this.state.categorisedProducts;
        console.log("NavItems", navItems);

        if (navItems.length > 0) {
            return navItems.map((navItem, index) => {
                return (
                    <NavItem className="tab_active">
                        <NavLink
                            className={classnames({ active: this.state.activeTab === index.toString() })}
                            onClick={() => { this.toggle((index).toString()) }}>
                            {navItem}
                        </NavLink>
                    </NavItem>
                )
            });
        }
    }

    renderTabItems = () => {
        const tabItems = this.state.categorisedProducts;

        if (tabItems.length > 0) {
            return tabItems.map((tabItem, index) => {
                return null;
            });
        }
    }



    toggle(tab) {
        console.log(tab)
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }
    render() {
        const settings = {
            dots: true,
            infinite: true,
            slidesToShow: 1,
            arrows: false,
        };
        const deals_settings = {
            dots: false,
            infinite: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            arrows: false,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 4,
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
            <main style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
                <div>
                    <Header />
                </div>
                <div style={{ width: '100%', alignItems: 'center', position: "relative" }}>
                    <Slider ref={c => (this.Slider = c)} {...settings} style={{}}>
                        <div>
                            <div style={{ backgroundImage: 'url("https://img1.kirana11.com/files/public/categoryfruits-vegetables-fed-14.jpg?ETlDb15Go2_HfTGERE41L1CGWtSTHxHg")' }} className="heroContainer">
                            </div>
                        </div>
                        <div>
                            <div style={{ backgroundImage: 'url("https://img1.kirana11.com/files/public/kirana11_homepage_alofrutyogajal.jpg?a3ei_MSUdX1nqXYie4WzMdZ9YLs.JCsF")' }} className="heroContainer">
                            </div>
                        </div>
                        <div>
                            <div style={{ backgroundImage: 'url("https://img1.kirana11.com/files/public/categoryfruits-vegetables-fed-14.jpg?ETlDb15Go2_HfTGERE41L1CGWtSTHxHg")' }} className="heroContainer">
                            </div>
                        </div>

                    </Slider>


                </div>
                <div className="module_container" style={{ minHeight: 400 }}>
                    <div className="moduleHeader"> Shocking Deals</div>
                    <div style={{ width: '80%', margin: '0 auto', position: 'relative' }}>
                        <Slider ref={d => (this.Slider = d)} {...deals_settings}>
                            {
                                this.state.productDeals ? this.state.productDeals.map((item, index) => {
                                    return (
                                        <CardComponent type="deals" productDeals={item} />
                                    )
                                }) : ''
                            }

                        </Slider>
                        <div onClick={this.previous} className="arr arrow_prev" >&#9001;</div>
                        <div onClick={this.next} className="arr arrow_next">&#9002;</div>

                        {/* <div style={{ width: '100%', textAlign: 'center', marginTop: 25 }}><Link to="/listing">View All Deals</Link></div> */}
                    </div>
                </div>
                <div style={{ width: '100%', padding: '25px 10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }} className="moduleHeader">Exciting Deals</div>
                    <Row style={{ width: '80%', margin: '0 auto', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', position: 'relative' }}>
                        <Col className='card2y' sm='6'>
                        </Col>
                        <Col className='card1xy' sm='3' style={{ backgroundImage: "url('https://img1.kirana11.com/files/public/featured_snacks_20-april.jpg?uExO3rUG5ZdPIdyz4z6cJqzmPTtlWKpG)'" }}>
                        </Col>
                        <Col className='card1xy' sm='3'>
                        </Col>
                        <Col className='card2x' sm='6' style={{ position: 'absolute', right: 0, top: 150 }}>
                        </Col>
                    </Row>
                </div>
                <div style={{ width: '100%', }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }} className="moduleHeader">Category Deals</div>
                    <Nav tabs style={{ width: '80%', margin: '0 auto', borderBottom: '0px solid' }}>
                        {this.renderNavItems()}
                    </Nav>
                    <TabContent activeTab={this.state.activeTab} className="category_tabs">
                        {this.state.categorisedProducts.map((item, index) => {
                            return (
                                <TabPane tabId={index}>
                                    <Row style={{ width: '85%', margin: '0 auto' }}>
                                        {/* {this.state.cat_deals_products ?
                                            this.state.cat_deals_products[index].map((cat_grp,id)=>{
                                            console.log(cat_grp,'id');          
                                            })
                                            // (this.state.cat_deals_products[index].map((cat_item, id) => {
                                            //     console.log(cat_item)
                                            //     return (
                                            //         <CardComponent type="cat_deals" productDeals={cat_item} key={id} />
                                            //     )
                                            // })
                                            // )
                                             : ''} */}


                                    </Row>
                                </TabPane>
                            )
                        })}
                    </TabContent>
                </div>
                <div style={{ width: '100%', padding: '25px 10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }} className="moduleHeader">Exciting Deals</div>
                    <Row style={{ width: '80%', margin: '0 auto', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', position: 'relative' }}>

                        <Col className='card1xy' sm='3' style={{ backgroundImage: "url('https://img1.kirana11.com/files/public/featured_snacks_20-april.jpg?uExO3rUG5ZdPIdyz4z6cJqzmPTtlWKpG)'" }}>
                        </Col>
                        <Col className='card1xy' sm='3'>
                        </Col>
                        <Col className='card2x' sm='6' style={{ position: 'absolute', left: 0, top: 150 }}>
                        </Col>
                        <Col className='card2y' sm='6'>
                        </Col>
                    </Row>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '40vh', alignItems: 'center' }}>
                    <div className='col-sm-6' style={{ height: '100%', backgroundImage: "url('https://img1.kirana11.com/files/public/summer-blog-post.jpg?56eV1KUYK9Fatn6jY1MBp.frmG_LcFTg')", backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', borderRightWidth: 5, borderStyle: 'solid', borderColor: '#fff' }}>
                    </div>
                    <div className='col-sm-6' style={{ height: '100%', backgroundImage: "url('https://img1.kirana11.com/files/public/summer-blog-post.jpg?56eV1KUYK9Fatn6jY1MBp.frmG_LcFTg')", backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', borderRightWidth: 5, borderStyle: 'solid', borderColor: '#fff' }}>
                    </div>
                </div>
                <div style={{ width: '80%', margin: '0 auto' }}>
                    <FooterComponent listreq={true} />
                </div>
            </main >
        );
    }
}

export default HomePage;
