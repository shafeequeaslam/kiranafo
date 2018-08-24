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
import { PRODUCT_DEALS_FETCH, HOMEPAGE_CAT_DEALS, HOMEPAGE_CAT_DEALS_PRODUCTS, HOMEPAGE_BANNERS, HOMEPAGE_EXCITING_DEALS_BANNER, HOMEPAGE_EXCITING_CAT_BANNERS } from "../../utis/API";
import FooterComponent from '../../components/Footer/footer';
import CardComponent from '../../components/card';
import Axios from 'axios';
import HomePageBanners from './banners';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 0,
            productDeals: undefined,
            categorisedProducts: [],
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
        this.getBanners();
        this.getExcitingBanners();
        this.getCategoryBanners()

    }
    getBanners() {
        Axios(HOMEPAGE_BANNERS + '&sort=asc&mode=min', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((data) => {
                console.log(data.data);
                this.setState({
                    bannerData: data.data
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    getExcitingBanners() {
        Axios(HOMEPAGE_EXCITING_DEALS_BANNER + '&sort=asc&mode=min', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((data) => {
                console.log(data.data);
                this.setState({
                    exciting_bannerData: data.data
                })
            })
            .catch((err) => {
                console.log(err.response)
            })
    }
    getCategoryBanners() {
        Axios(HOMEPAGE_EXCITING_CAT_BANNERS + '&sort=asc&mode=min', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((data) => {
                console.log(data.data);
                this.setState({
                    exciting_cat_bannerData: data.data
                })
            })
            .catch((err) => {
                console.log(err)
            })
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
        let deal_names = [];
        let dealData = [];
        Axios(HOMEPAGE_CAT_DEALS, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((deals) => {

                for (let i = 0; i < deals.data.length; i++) {

                    deal_names[i] = deals.data[i].key;
                    Axios(HOMEPAGE_CAT_DEALS_PRODUCTS + deals.data[i].key, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    })
                        .then((data) => {
                            // dealData=data;
                            console.log(data.data, "121");
                            dealData[i] = [];
                            dealData[i] = data.data
                            console.log(dealData[i])
                            //  console.log(dealData, '12qwq1');
                            // console.log(dealData, "11")
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }

            })
            .catch((err) => {
                console.log(err)
            })

        setTimeout(() => {
            console.log(dealData, '12qwq1');

            // console.log((dealData), "data fro deals")
            this.setState({
                categorisedProducts: deal_names,
                cat_deals_products: dealData
            })
        }, 500)

    }


    setChange() {
        this.setState({
            change: undefined
        })
        this.setState({
            change: true
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
                            className={classnames({ active: this.state.activeTab === index })}
                            onClick={() => { this.toggle(index) }}>
                            {navItem}
                        </NavLink>
                    </NavItem>
                )
            });
        }
    }
    renderNavData = () => {
    }





    toggle(tab) {
        console.log(tab);
        let cat_deals = this.state.cat_deals_products
        this.setState({
            cat_deals_products:undefined,
            change: undefined
        })
      
        // this.setState({
        //     activeTab:undefined
        // })
        // if (this.state.activeTab !== tab) {
        setTimeout(()=>{
            this.setState({
                activeTab: tab,
                cat_deals_products:cat_deals,
                change: true
            });
        })
       
        // }
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
                    <Header change={this.state.change} />
                </div>
                <div style={{ width: '100%', alignItems: 'center', position: "relative" }}>
                    <Slider ref={c => (this.Slider = c)} {...settings} style={{}}>
                        {
                            this.state.bannerData ? this.state.bannerData.map((item, index) => {
                                return (
                                    <HomePageBanners data={item} key={index} />
                                )
                            }) : ''
                        }


                    </Slider>


                </div>
                <div className="module_container" style={{ minHeight: 400 }}>
                    <div className="moduleHeader"> Shocking Deals</div>
                    <div style={{ width: '80%', margin: '0 auto', position: 'relative' }}>
                        <Slider ref={d => (this.Slider = d)} {...deals_settings}>
                            {
                                this.state.productDeals ? this.state.productDeals.map((item, index) => {
                                    return (
                                        <CardComponent type="deals" productDeals={item} change={() => this.setChange()} />
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
                        {
                            this.state.exciting_bannerData ? this.state.exciting_bannerData.map((item, index) => {
                                return (
                                    <Col className='cardBanner' sm='6' style={{ height: 250, padding: '0px !important' }}>
                                        <img src={item._source.banners.web_banner_path} width="100%" height='100%' />
                                    </Col>
                                )
                            }) : ''
                        }

                        {/* <Col className='card1xy' sm='3' style={{ backgroundImage: "url('https://img1.kirana11.com/files/public/featured_snacks_20-april.jpg?uExO3rUG5ZdPIdyz4z6cJqzmPTtlWKpG)'" }}>
                        </Col>
                        <Col className='card1xy' sm='3'>
                        </Col>
                        <Col className='card2x' sm='6' style={{ position: 'absolute', right: 0, top: 150 }}>
                        </Col> */}
                    </Row>
                </div>
                <div style={{ width: '100%', }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }} className="moduleHeader">Category Deals</div>
                    <Nav tabs style={{ width: '80%', margin: '0 auto', borderBottom: '0px solid' }}>
                        {this.renderNavItems()}
                    </Nav>
                    <TabContent activeTab={this.state.activeTab} className="category_tabs">
                        <TabPane tabId={this.state.activeTab}>
                            <Row style={{ width: '85%', margin: '0 auto' }}>

                                {this.state.cat_deals_products ? (
                                    console.log('here'),
                                    this.state.cat_deals_products[this.state.activeTab].map((pr_deal, index) => {
                                        console.log(pr_deal)
                                        return (
                                            <CardComponent type="cat_deals" productDeals={pr_deal} change={() => this.setChange()} />
                                        )
                                    })
                                )
                                    : ''}




                            </Row>
                        </TabPane>
                    </TabContent>
                </div>
                <div style={{ width: '100%', padding: '25px 10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }} className="moduleHeader">Exciting Deals</div>
                    <Row style={{ width: '80%', margin: '0 auto', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', position: 'relative' }}>

                        {
                            this.state.exciting_cat_bannerData ? this.state.exciting_cat_bannerData.map((item, index) => {
                                return (
                                    <Col className='cardBanner' sm='12' style={{ height: 250, padding: '0px !important' }}>
                                        <img src={item._source.banners.web_banner_path} width="100%" height='100%' />
                                    </Col>
                                )
                            }) : ''
                        }
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
