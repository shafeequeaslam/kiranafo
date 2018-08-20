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
    Dropdown,
    DropdownMenu,
    DropdownItem, UncontrolledTooltip,
    TabContent, TabPane, Card, Button, CardTitle, CardText, Row, Col
} from 'reactstrap';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router'
import './header.css';
import { PRODUCT_WITH_CATEGORIES_FETCH } from "../../utis/API";
import { GET_DC_CENTER } from "../../utis/D2";
import searchicon from '../../assets/header-search-icon@2x.png'
import location from '../../assets/header-location-hover@2x.png';
import app from '../../assets/header-app-icon.png';
import phone from '../../assets/header-phone-icon.png';
import arrow from '../../assets/header location arrow@2x.png';
import Autocomplete from 'react-google-autocomplete';
import Geocode from "react-geocode";
import Axios from 'axios'


class Header extends Component {
    constructor(props) {
        super(props);
        console.log(this.props)
        this.state = {
            isOpen: false,
            tooltip: false,
            modalOpen: false,
            userMenu:false,
            loggedIn: false,
            cat_menu: false, categorisedProducts: []
        };
        this.modalOpens = this.modalOpens.bind(this);
        Geocode.setApiKey("AIzaSyDrX--l_ZLlQIZirllVuvpCqqTk8jbB4RE");
    }
    componentWillMount() {
        let location = JSON.parse(localStorage.getItem("location"))
        if (location != null) {
            this.setState({
                location: location
            })
        }
        else if(location == null){
            this.setState({
                modalOpen:true
            })
        }
        let userData=JSON.parse(localStorage.getItem("userDetails"));
        if (userData != null) {
        this.setState({
            userData : userData
        })
         }
         else if(userData == null){
            this.setState({
                userData:undefined
            })
        }
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
                this.setState({
                    categorisedProducts: deals[0]._source.main_category_tree

                })
            }, (error) => {
                console.error(error)
            });
    }
    modalOpens() {
        this.setState({
            modalOpen: !this.state.modalOpen,
            tooltip: !this.state.tooltip
        })
    }
    redirectTo(id) {
        if (id == "cart") {
            const userToken = JSON.parse(localStorage.getItem("userToken"));
            if (!userToken || userToken["access_token"] === "" || userToken["refresh_token"] === "") {
                window.location.href = "/login";
            }
            else {
                window.location.href = "/cart"
            }
        }
        else if (id == "/login") {
            window.location.href = '/login'
        }
    }

    getPostalCodeFromAddress = (addressArray) => {
        let postal_code = null;

        addressArray.forEach((address, index) => {
            if (address.types[0] === "postal_code") {
                postal_code = address.long_name;
            }
        });

        return postal_code;
    }
    signout(){
        localStorage.removeItem('userDetails');
        localStorage.removeItem('userToken');
        localStorage.removeItem('cartObj');
        window.location.replace("/login");
    }

    render() {
        return (
            <div>
                <div className="location_modal" style={{ display: this.state.modalOpen ? '' : 'none', overflow: 'none' }}>
                    <div className="abs_close" onClick={() => this.setState({ modalOpen: !this.state.modalOpen })}>x</div>
                    <div className="location_text">Where do you want the delivery</div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: ' 100%' }}>
                        <div className="location_icon"></div>
                        {/* <input className="location_input" placeholder="Enter Delivery Location" /> */}
                        <Autocomplete
                            style={{ width: '90%' }}
                            onPlaceSelected={(place) => {
                                const selectedLocation = {
                                    name: place.name,
                                    formattedAddress: place.formatted_address,
                                    lat: place.geometry.location.lat(),
                                    lng: place.geometry.location.lng()
                                };

                                let postalCode = this.getPostalCodeFromAddress(place.address_components)
                                console.log(postalCode);
                                if (!postalCode) {
                                    Geocode.fromLatLng(selectedLocation.lat, selectedLocation.lng).then(
                                        response => {
                                            selectedLocation.postalCode = this.getPostalCodeFromAddress(response.results[0].address_components);
                                            localStorage.setItem("location", JSON.stringify(selectedLocation));
                                        }
                                    )}
                                    else {
                                        selectedLocation.postalCode = postalCode;
                                        localStorage.setItem("location", JSON.stringify(selectedLocation));
                                    }
                                            // localStorage.setItem("location", JSON.stringify(selectedLocation));
                                        
                                        
                                        error => {
                                            console.error(error);
                                        }
                                    
                                
                                let location = JSON.parse(localStorage.getItem("location"))
                                this.setState({
                                    location: location,
                                     modalOpen: !this.state.modalOpen 
                                })
                            }}
                            types={'(geocode)'}
                            componentRestrictions={{ country: "in" }}
                        />
                    </div>
                    <p>OR</p>
                    <div className="get_loc">
                        <button className="button_white">Deliver to my Current Location </button>
                    </div>
                </div>
                <Navbar style={{ backgroundColor: '#c01a20', width: '100%' }}>
                    <Nav className="ml-left" navbar style={{ marginLeft: '15%' }}>
                        <NavItem style={{ position: 'relative' }}>
                            <NavLink >
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', color: '#fff' }} onClick={() => this.setState({ tooltip: !this.state.tooltip })}>
                                    <div><img style={{ margin: 'auto' }} src={location}></img></div>
                                    <div className="formatted_address">{this.state.location ? this.state.location.formattedAddress : ''} </div>
                                    <div style={{ marginLeft: 10 }}><img src={arrow}></img></div>
                                </div>
                            </NavLink>
                            <div className="arrow_box" style={{ display: this.state.tooltip ? '' : 'none' }}>
                                <div style={{ display: this.state.location ? '' : 'none' }}> ⓘ You are seeing our product list from <p>{this.state.location ? this.state.location.formattedAddress : ''}</p></div>
                                <div style={{ margin: '10px auto 0', width: '100%', justifyContent: 'center', display: 'flex' }}>
                                    <button className="button_red" onClick={() => this.modalOpens()}>{this.state.location ? (this.state.location.formattedAddress ? "Change" : "Please Select Address") : 'Please Select Address'}</button>
                                </div>
                            </div>
                        </NavItem>
                    </Nav>
                    <Nav className="ml-auto">
                        <NavItem>
                            <NavLink >
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <div><img style={{ margin: 'auto' }} src={phone}></img></div>
                                    <div style={{ fontSize: 12, color: '#fff', fontWeight: '500', marginLeft: 5 }}>18001011001 </div>
                                </div></NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink >
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <div><img style={{ margin: 'auto' }} src={app}></img></div>
                                    <div style={{ fontSize: 12, color: '#fff', fontWeight: '500', marginLeft: 5 }}>Download Now </div>
                                </div>
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>
                <Navbar light expand="md" style={{ backgroundColor: '#d12129' }}>

                    <NavbarBrand href="/" style={{ borderRightWidth: 2, borderRightStyle: 'solid', borderColor: '#c11a21', paddingRight: 20 }}><img src="https://www.kirana11.com/sites/all/themes/kirana11_v3/images/img/logo.png" height='50' /></NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-left" navbar>
                            <NavItem >
                                <NavLink
                                    onClick={() => this.setState({
                                        cat_menu: !this.state.cat_menu
                                    })}>

                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                                        <div>
                                            <img src="https://web-img.kirana11.com/kirana11_V3/header-menu-icon.png" height='25' />
                                        </div>
                                        <div
                                            style={{ fontSize: 16, color: '#fff', fontWeight: '500', marginLeft: 20 }}>Shop

                                        </div>
                                        <div className="cat_menu" style={{ display: this.state.cat_menu == true ? 'block' : 'none' }}>
                                            {
                                                this.state.categorisedProducts ? this.state.categorisedProducts.map((item, id) => {
                                                    return (
                                                        <Link to={{ pathname: '/listing', search: '?categoryId=' + item.tid, state: { 'item': item } }} key={id}  >
                                                            <div className="cat_sub_menu">

                                                                {item.name}

                                                            </div>
                                                        </Link>
                                                    )

                                                }) : ""
                                            }
                                        </div>
                                    </div>
                                </NavLink>
                            </NavItem>
                            <NavItem style={{ marginLeft: 20, display: 'flex', flexDirection: 'row' }}>
                                <div className="input-group" style={{ width: '50vw' }}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" style={{ backgroundColor: '#fff', border: 'none' }}><div><img style={{ margin: 'auto' }} src={searchicon}></img></div></span>
                                    </div>
                                    <input placeholder="Search Products" type="text" className="header_search form-control" style={{ borderRadius: 0 }} />
                                </div>
                                <div>
                                    <button className='search_btn'>Search</button>
                                </div>
                            </NavItem>
                        </Nav>
                        <Nav className="ml-auto" navbar style={{ height: 60, alignItems: 'center' }}>

                            <NavItem >
                                <NavLink style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <div style={{ background: "url('https://web-img.kirana11.com/kirana11_V3/header-icons.png') #a51319 -136px -2px no-repeat", width: 35, height: 35 }}></div>
                                    <div style={{ color: '#fff', fontSize: 14, marginLeft: 10, display: this.state.userData ?(this.state.userData.user ? 'none':'') : '' }} onClick={() => this.redirectTo('/login')}>Login / Sign Up</div>
                                    <div style={{ color: '#fff', fontSize: 14, marginLeft: 10, display: this.state.userData ?(this.state.userData.user ? '':'none') : 'none'  }} onClick={()=>this.setState({user_menu:!this.state.user_menu})}>
                                        {this.state.userData ? this.state.userData.user.mail:''}

                                        <div className="user_menu" style={{ display: this.state.user_menu == true ? 'block' : 'none' }}>
                                                        <Link to={{ pathname: '/myAddress' }}   >
                                                            <div className="cat_sub_menu">
                                                                My Address
                                                            </div>
                                                        </Link>
                                                        <Link to={{ pathname: '/myorders' }}   >
                                                            <div className="cat_sub_menu">
                                                                My Orders
                                                            </div>
                                                        </Link>
                                                        <Link to='' onClick={()=>this.signout()} >
                                                            <div className="cat_sub_menu">
                                                               Signout
                                                            </div>
                                                        </Link>
                                            }
                                        </div>
                                    </div>
                                </NavLink>
                            </NavItem>
                            <NavItem className="header_cart">
                                <Link to="" onClick={() => this.redirectTo("cart")} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <img src="https://www.kirana11.com/sites/all/themes/kirana11_v3/images/cart.png" alt="cart" />
                                </Link>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

export default Header; 