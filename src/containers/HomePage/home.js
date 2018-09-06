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
import LinesEllipsis from 'react-lines-ellipsis';
import classnames from 'classnames'
import './home.css';
import '../../App.css';
import Slider from "react-slick";
import { Link } from 'react-router-dom'
import Header from '../../components/Header/header';
import { PRODUCT_DEALS_FETCH, HOMEPAGE_CAT_DEALS, HOMEPAGE_CAT_DEALS_PRODUCTS, HOMEPAGE_BANNERS, HOMEPAGE_EXCITING_DEALS_BANNER, HOMEPAGE_EXCITING_CAT_BANNERS } from "../../utis/API";
import FooterComponent from '../../components/footer-components/Footer/containers/footer';
import CardComponent from '../../components/card';
import Axios from 'axios';
import HomePageBanners from './banners';
import Timer from './Timer';
import Banner from '../../components/banner/banner';
import DealProductBanner from '../../components/grid-deals-banner/deal-product-banner';

class HomePage extends Component {
    constructor(props) {
        super(props);
        // this.app = firebase.initializeApp(config);
        // this.database = this.app.database().ref('stock/277046/stock');
        this.state = {
            activeTab: 0,
            productDeals: undefined,
            categorisedProducts: [],
            cat_deals_products: undefined,shockingDealsActive:"1"
        };
        this.toggle = this.toggle.bind(this);

        // this.nextOne = this.nextOne.bind(this);
        // this.previousOne = this.previousOne.bind(this);

        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
    }

    // nextOne() {
    //     this.Slider.slickNext();
    // }
    // previousOne() {
    //     this.Slider.slickPrev();
    // }
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
        // this.getExcitingBanners();
        // this.getCategoryBanners();

        // let self = this;
        // let firebaseRef = firebase.database().ref('');
        // this.database.on('value',snap=>{
        //     //console.log(snap.val())
        // })
               
                // self.setState({
                //     messages: messages
                // });
            // });
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
            //console.log(data.data);
            this.setState({
                bannerData: data.data
            })
        })
        .catch((err) => {
            //console.log(err)
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
            //console.log("Deal2212122s", deals);
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
            //console.log(deals, "1111");

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
                        if(JSON.parse(data.data)=={}){

                        }
                        // dealData=data;
                        //console.log(data.data, "121");
                        else{
                        dealData[i] = [];
                        dealData[i] = data.data
                        }
                        //console.log(dealData[i])
                        //  //console.log(dealData, '12qwq1');
                        // //console.log(dealData, "11")
                    })
                    .catch((err) => {
                        //console.log(err)
                    })
            }

        })
        .catch((err) => {
            //console.log(err)
        })

    setTimeout(() => {
        //console.log(dealData, '12qwq1');

        // //console.log((dealData), "data fro deals")
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

setrevChange(){
    console.log('here')
    this.setState({
        revchange: undefined
    })
    this.setState({
        revchange: true
    }) 
    this.getProductShockingDeals();
    this.getProductCategoriesList();


}


renderNavItems = () => {
    const navItems = this.state.categorisedProducts;
    //console.log("NavItems", navItems);

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





toggle(tab) {
    //console.log(tab);
    let cat_deals = this.state.cat_deals_products
    this.setState({
        cat_deals_products: undefined,
        change: undefined
    })

    // this.setState({
    //     activeTab:undefined
    // })
    // if (this.state.activeTab !== tab) {
    setTimeout(() => {
        this.setState({
            activeTab: tab,
            cat_deals_products: cat_deals,
            change: true
        });
    })

    // }
}
checkBannerRedirect(data){
    console.log(data);
    if(data.content_type === "PLP"){
        console.log('PLP,datacategory_id,category_level',data.category_id,data.category_level)
        window.location = '/listing?categoryId=' + data.category_id+'&level='+data.category_level
    }
    else if(data.content_type === "PDP"){
        window.location = '/product_desc?product=' + data.nid
    }
    else if(data.content_type === "Deals"){
        console.log(data);
        window.location='/listing?dealType='+data.deals_type
    }
    else if(data.content_type === "static"){
        if(data.link_target === 'external')
       window.open(data.link_url)
       else
       window.location=data.link_url
    }
    

}
render() {
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        arrows: false,
    };
    const deals_sett = {
        dots: false,
        infinite: true,
        slidesToShow: this.state.productDeals ? (this.state.productDeals.length < 5 ? this.state.productDeals.length : 5) : 0,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    // slidesToScroll: 4,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    // slidesToScroll: 3,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    // slidesToScroll: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    // slidesToScroll: 2,
                }
            },
        ]
    };



    return (
        <main style={{ width: '100%', overflowX: 'hidden',maxHeight:this.state.overflowState === '0' ? 'auto':'100vh' }}>
            <div>
                <Header change={this.state.change} revChange={() => this.setrevChange()} location_header={(data)=>this.setState({overflowState:data})}/>
            </div>
            {/* <div style={{ width: '100%', alignItems: 'center', position: "relative" }}> */}
            <Slider ref={c => (this.Slider = c)} {...settings} >
                {
                    this.state.bannerData ? this.state.bannerData.map((item, index) => {
                        console.log(item)

                        return (
                            <HomePageBanners data={item} key={index} bannerData={(item)=>this.checkBannerRedirect(item)}/>
                        )
                    }) : ''
                }


            </Slider>


            {/* </div> */}
            <div className="module_container" style={{ minHeight: 300,display: this.state.shockingDealsActive === "0" ? 'none' : ''  }}>
                <div className="moduleHeader"> Shocking Deals</div>
                {/* Timer Component */}
                <Timer shockingDeals={(data)=>{this.setState({shockingDealsActive:data}),console.log(data)}}/>
                <div style={{ width: '80%', margin: '0 auto', position: 'relative'}} >
                    <Slider ref={e => (this.Slider = e)} {...deals_sett}>
                        {
                            this.state.productDeals ? this.state.productDeals.map((item, index) => {
                                //console.log(this.state.productDeals, "bannerData")
                                return (
                                    <div>
                                        <CardComponent type="deals" productDeals={item} change={() => this.setChange()} rev_change={this.state.revchange} />
                                    </div>
                                )
                            }) : ''
                        }

                    </Slider>
                    <div onClick={this.previous} className="arr arrow_prev" >&#9001;</div>
                    <div onClick={this.next} className="arr arrow_next">&#9002;</div>

                    {/* <div style={{ width: '100%', textAlign: 'center', marginTop: 25 }}><Link to="/listing">View All Deals</Link></div> */}
                </div>
            </div>
            <div className="homepage_ex_banner">
                <div className="moduleHeader">Exciting Deals</div>
            <DealProductBanner api_type={HOMEPAGE_EXCITING_DEALS_BANNER}/>
            </div>
            <div style={{ width: '100%', }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }} className="moduleHeader">Category Deals</div>
                <Nav tabs style={{ width: '80%', margin: '0 auto', borderBottom: '0px solid' }}>
                    {this.renderNavItems()}
                </Nav>
                <TabContent activeTab={this.state.activeTab} className="category_tabs">
                    <TabPane tabId={this.state.activeTab}>
                        <Row style={{ width: '85%', margin: '0 auto' }}>

                            {this.state.cat_deals_products ? this.state.cat_deals_products.length > 0 ? (
                                console.log(this.state.cat_deals_products,"212121"),

                                this.state.cat_deals_products[this.state.activeTab].map((pr_deal, index) => {
                                    //console.log(pr_deal)
                                    return (
                                        <CardComponent type="cat_deals" productDeals={pr_deal} change={() => this.setChange()} rev_change={this.state.revchange} />
                                    )
                                })


                            )
                                : '' : ''}




                        </Row>
                    </TabPane>
                </TabContent>
            </div>
            <div className="homepage_ex_banner">
                <div className="moduleHeader">Awesome Deals</div>
                <DealProductBanner api_type={HOMEPAGE_EXCITING_CAT_BANNERS}/>
            </div>
            {/* <div style={{height:'500px',width:'100%'}}> */}
            {/* <iframe src="https://www.google.com" width="100%" height="500px" id="iframe_id" onLoad={()=>this.getIframe}></iframe> */}
            {/* </div> */}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '40vh', alignItems: 'center' }}>
                <div className='col-sm-6' style={{ height: '100%', backgroundImage: "url('https://img1.kirana11.com/files/public/summer-blog-post.jpg?56eV1KUYK9Fatn6jY1MBp.frmG_LcFTg')", backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', borderRightWidth: 5, borderStyle: 'solid', borderColor: '#fff' }}>
                </div>
                <div className='col-sm-6' style={{ height: '100%', backgroundImage: "url('https://img1.kirana11.com/files/public/summer-blog-post.jpg?56eV1KUYK9Fatn6jY1MBp.frmG_LcFTg')", backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', borderRightWidth: 5, borderStyle: 'solid', borderColor: '#fff' }}>
                </div>
            </div>
            <Banner/>
            <div style={{ width: '80%', margin: '0 auto' }}>
                <FooterComponent/>
            </div>
        </main >
    );
}
}

export default HomePage;
