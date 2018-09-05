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
import { PRODUCT_WITH_CATEGORIES_FETCH, SEARCH_RESULTS_FULL } from "../../utis/API";
import { GET_DC_CENTER } from "../../utis/D2";
import searchicon from '../../assets/header-search-icon@2x.png';
import logo from '../../assets/logo.png'
import location from '../../assets/header-location-hover@2x.png';
import app from '../../assets/header-app-icon.png';
import phone from '../../assets/header-phone-icon.png';
import arrow from '../../assets/header location arrow@2x.png';
import Autocomplete from 'react-google-autocomplete';
import Geocode from "react-geocode";
import Axios from 'axios'
import SearchResults from './search';
import Geolocation from 'react-geolocation';
import Minicart from '../../components/Minicart/minicart';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import cart_icon from '../../assets/add to cart icon@2x.png'

const width = window.screen.width;


class Header extends Component {
    constructor(props) {
        super(props);
        //console.log(this.props)
        this.state = {
            miniOpen: false,
            isOpen: false,
            tooltip: false,
            modalOpen: false,
            userMenu: false,
            loggedIn: false,
            cat_menu: false, categorisedProducts: [],
            sm_menu_modal:false
        };
        this.modalOpens = this.modalOpens.bind(this);
        Geocode.setApiKey("AIzaSyDrX--l_ZLlQIZirllVuvpCqqTk8jbB4RE");
    }
    componentWillMount() {
        let cartObj = JSON.parse(localStorage.getItem('cartObj'));
        if (cartObj != null) {
            this.setState({
                cartObj: cartObj
            })
        }
        let location = JSON.parse(localStorage.getItem("location"))
        if (location != null) {
            this.setState({
                location: location
            })
        }
        else if (location == null) {
            this.setState({
                modalOpen: true
            })
        }
        let userData = JSON.parse(localStorage.getItem("userDetails"));
        if (userData != null) {
            this.setState({
                userData: userData
            })
        }
        else if (userData == null) {
            this.setState({
                userData: undefined
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
                //console.log("Deals", deals);
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
            tooltip: !this.state.tooltip,

        })
    }
    redirectTo(id, val) {
        if (id == "minicart") {
            const userToken = JSON.parse(localStorage.getItem("userToken"));
            if (!userToken || userToken["access_token"] === "" || userToken["refresh_token"] === "") {
                window.location.href = "/login";
            }
            else {
                window.location.href = "/minicart"
            }
        }
        else if (id == "/login") {
            window.location.href = '/login?_=' + val
        }
        else if (id == 'plp') {
            window.location = '/listing?search=' + this.state.searchParam
        }
    }
    componentWillReceiveProps(nextProps, prevState) {
        // this.setState({
        //     cartObj:undefined
        // })
        this.setState({
            change: undefined
        })
        let cartObj = JSON.parse(localStorage.getItem('cartObj'));

        this.setState({
            cartObj: cartObj,
            change: true
        })
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
    signout() {
        localStorage.removeItem('userDetails');
        localStorage.removeItem('userToken');
        localStorage.removeItem('cartObj');
        window.location.replace("/login");
    }

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            //console.log('here')
            this.redirectTo('plp');
        }
    }
    handleSearch(evnt, srch) {
        let search = "";
        if (evnt != "") {
            this.setState({
                searchParam: evnt.target.value
            })

            //console.log(evnt.target.value.toLowerCase())
            search = evnt.target.value.toLowerCase();
        }
        else {
            search = srch;
        }
        if (search.length > 2) {

            Axios({
                method: 'GET',
                header: {
                    'Content-type': 'application/json',
                },
                url: SEARCH_RESULTS_FULL + search + '&sort=asc&mode=min&from=0&size=5',

            })
                // .then(res => res)
                .then((data) => {
                    //console.log(data.data, 'data');
                    if (data.data.length > 0) {
                        this.setState({
                            searchArray: data.data
                        })
                    }
                    else {
                        this.setState({
                            searchArray: data.data
                        })
                    }

                    // })
                    // this.setState({
                    //     searchResults: data.data.hits.hits
                    // })
                })
                .catch((err) => {
                    //console.log(err)
                })
        }
        else {
            this.setState({
                searchArray: undefined
            })
        }

    }
    getCurrentPosition(lat, long) {
        let selectedLocation = {};
        Geocode.fromLatLng(lat, long).
            then(
                response => {
                    //console.log(response.results[0], response.results[0].address_components)
                    selectedLocation.name = response.results[0].address_components[0].long_name,
                        selectedLocation.formattedAddress = response.results[0].formatted_address,
                        selectedLocation.lat = lat,
                        selectedLocation.lng = long,
                        selectedLocation.postalCode = this.getPostalCodeFromAddress(response.results[0].address_components);
                    //console.log('1212 . 1')
                    localStorage.setItem("location", JSON.stringify(selectedLocation));
                }
            )
        error => {
            console.error(error);
        }


        // localStorage.setItem("location", JSON.stringify(selectedLocation));




        setTimeout(() => {
            let locationOne = [];
            locationOne = JSON.parse(localStorage.getItem("location"))
            let usr = JSON.parse(localStorage.getItem("userDetails"));
            let params = new URLSearchParams();
            if (locationOne != null) {
                //console.log(locationOne)
                this.setState({
                    location: null
                })
                //console.log('here')
                params.append('address', locationOne.formattedAddress);
                params.append('latitude', locationOne.lat);
                params.append('longitude', locationOne.lng);
                params.append('source', 'web');
                if (usr != null)
                    params.append('uid', usr.user.uid);
                //console.log(params);


                Axios({
                    method: 'POST',
                    url: GET_DC_CENTER,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    data: params

                })

                    .then((value) => {

                        if (value.data.serving_area.length > 0) {
                            //console.log(value, 'data11');
                            localStorage.setItem('location_dc', JSON.stringify(value.data.serving_area[0]))
                            let loc = JSON.parse(localStorage.getItem('location'))
                            //console.log(loc, '1111')
                            if (loc != null) {
                                this.setState({
                                    location: loc,
                                    modalOpen: !this.state.modalOpen
                                })
                            }


                        }
                        else {
                            alert("This area is not yet serviceable");
                            localStorage.removeItem('location');
                            localStorage.removeItem('location_dc')
                        }

                    })
                    .catch((err) => {
                        //console.log(err.response, 'err');
                        localStorage.removeItem('location');
                        localStorage.removeItem('location_dc')

                    })
                // window.location.href = '/'
            }


        }, 500)


    }

    setrevChange() {
        //console.log('here')
        this.setState({
            revChange: undefined
        })
        this.setState({
            revChange: true
        })
        this.setState({
            cartObj: undefined,
        })
        let cartObj

        setTimeout(() => {
            cartObj = JSON.parse(localStorage.getItem('cartObj'));
            //console.log(cartObj);
            this.setState({
                cartObj: cartObj,
            })
        }, 500)
        //console.log(this.props)
        if (this.props.revChange) { this.props.revChange() }

    }

    render() {

        return (
            < div >

                
                    <div className="location_modal" style={{ display: this.state.modalOpen ? '' : 'none', overflow: 'none' }} >
                        <div className="abs_close" onClick={() => { this.setState({ modalOpen: !this.state.modalOpen }), this.props.location_header(this.state.modalOpen === true ? '1' : '0') }} style={{ display: this.state.location ? '' : 'none' }}>x</div>
                        <div className="location_text">Where do you want the delivery</div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: ' 100%' }}>
                            <div className="location_icon"></div>
                            {/* <input className="location_input" placeholder="Enter Delivery Location" /> */}
                            <Autocomplete
                                style={{ width: '50%' }}
                                onPlaceSelected={(place) => {
                                    const selectedLocation = {
                                        name: place.name,
                                        formattedAddress: place.formatted_address,
                                        lat: place.geometry.location.lat(),
                                        lng: place.geometry.location.lng()
                                    };

                                    let postalCode = this.getPostalCodeFromAddress(place.address_components)
                                    //console.log(postalCode);
                                    if (postalCode == null) {
                                        Geocode.fromLatLng(selectedLocation.lat, selectedLocation.lng).then(
                                            response => {
                                                selectedLocation.postalCode = this.getPostalCodeFromAddress(response.results[0].address_components);
                                                //console.log('1212 . 1')
                                                localStorage.setItem("location", JSON.stringify(selectedLocation));
                                            }
                                        )
                                            .catch((err) => {
                                                //console.log(err)
                                            })
                                    }
                                    else {
                                        selectedLocation.postalCode = postalCode;
                                        //console.log('1212 . 12')
                                        localStorage.setItem("location", JSON.stringify(selectedLocation));
                                    }
                                    // localStorage.setItem("location", JSON.stringify(selectedLocation));


                                    error => {
                                        console.error(error);
                                    }


                                    setTimeout(() => {
                                        let locationOne = [];
                                        locationOne = JSON.parse(localStorage.getItem("location"))
                                        let usr = JSON.parse(localStorage.getItem("userDetails"));
                                        let params = new URLSearchParams();
                                        if (locationOne != null) {
                                            //console.log(locationOne)
                                            this.setState({
                                                location: null
                                            })
                                            //console.log('here')
                                            params.append('address', locationOne.formattedAddress);
                                            params.append('latitude', locationOne.lat);
                                            params.append('longitude', locationOne.lng);
                                            params.append('source', 'web');
                                            if (usr != null)
                                                params.append('uid', usr.user.uid);
                                            //console.log(params);


                                            Axios({
                                                method: 'POST',
                                                url: GET_DC_CENTER,
                                                headers: {
                                                    'Content-Type': 'application/x-www-form-urlencoded',
                                                },
                                                data: params

                                            })

                                                .then((value) => {

                                                    if (value.data.serving_area.length > 0) {
                                                        //console.log(value, 'data11');
                                                        localStorage.setItem('location_dc', JSON.stringify(value.data.serving_area[0]))
                                                        //   AsyncStorage.setItem('userLocation', JSON.stringify({ 'description': json.results[0].formatted_address, 'location': location, 'pincode': pincode }))
                                                        //   this.props.getFooterActive(0);
                                                        //   Actions.home();
                                                        let loc = JSON.parse(localStorage.getItem('location'))
                                                        //console.log(loc, '1111')
                                                        if (loc != null) {
                                                            this.setState({
                                                                location: loc,
                                                                modalOpen: !this.state.modalOpen
                                                            })
                                                        }

                                                    }
                                                    else {
                                                        alert("This area is not yet serviceable");
                                                        localStorage.removeItem('location');
                                                        localStorage.removeItem('location_dc')
                                                    }

                                                })
                                                .catch((err) => {
                                                    //console.log(err.response, 'err');
                                                    localStorage.removeItem('location');
                                                    localStorage.removeItem('location_dc')

                                                })
                                            // window.location.href = '/'
                                        }


                                    }, 500)

                                }}
                                types={'(geocode)'}
                                componentRestrictions={{ country: "in" }}
                            />
                        </div>
                        <p>OR</p>
                        <div className="get_loc">
                            <Geolocation
                                render={({
                                    fetchingPosition,
                                    position: { coords: { latitude, longitude } = {} } = {},
                                    error,
                                    getCurrentPosition
                                }) =>
                                    <div>
                                        {/* <button onClick={()=>this.getCurrentPosition(latitude, longitude)}>Get Position</button> */}
                                        <button className="button_white" onClick={() => this.getCurrentPosition(latitude, longitude)}>Deliver to my Current Location </button>



                                    </div>}
                            />
                            {/* <button className="button_white">Deliver to my Current Location </button> */}
                        </div>
                    </div>
                    {
                    width > 460 ?
                        (
                            <div>
                    <Navbar style={{ backgroundColor: '#c01a20', width: '100%' }} >
                        <Nav className="ml-left" navbar style={{ marginLeft: '15%' }}>
                            <NavItem style={{ position: 'relative' }} onMouseEnter={() => this.setState({ tooltip: true })} onMouseLeave={() => this.setState({ tooltip: false })}>
                                <NavLink >
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', color: '#fff' }} >
                                        <div><img style={{ margin: 'auto' }} src={location}></img></div>
                                        <div className="formatted_address">{this.state.location ? this.state.location.formattedAddress : ''} </div>
                                        <div style={{ marginLeft: 10 }}><img src={arrow}></img></div>
                                    </div>
                                    <div className="arrow_box" style={{ display: this.state.tooltip ? '' : 'none' }}>
                                        <div style={{ display: this.state.location ? '' : 'none' }}> ⓘ You are seeing our product list from <p>{this.state.location ? this.state.location.formattedAddress : ''}</p></div>
                                        <div style={{ margin: '10px auto 0', width: '100%', justifyContent: 'center', display: 'flex' }}>
                                            <button className="button_red" onClick={() => this.modalOpens()}>{this.state.location ? (this.state.location.formattedAddress ? "Change" : "Please Select Address") : 'Please Select Address'}</button>
                                        </div>
                                    </div>
                                </NavLink>

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
                    <Navbar light expand="md" style={{ backgroundColor: '#d12129' }} className="main_header">

                        <NavbarBrand href="/" style={{ borderRightWidth: 2, borderRightStyle: 'solid', borderColor: '#c11a21', paddingRight: 20 }}><img src={logo} height='50' /></NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-left" navbar>
                                <NavItem onMouseEnter={() => this.setState({
                                    menu: true,
                                })}
                                    onMouseLeave={() => this.setState({
                                        menu: false
                                    })}>
                                    <NavLink >

                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                                            <div>
                                                <img src="https://web-img.kirana11.com/kirana11_V3/header-menu-icon.png" height='25' />
                                            </div>
                                            <div
                                                style={{ fontSize: 16, color: '#fff', fontWeight: '500', marginLeft: 20 }}>Shop
        
                                        </div>
                                            <div className="cat_menu" style={{ display: this.state.menu == true ? 'block' : 'none' }}>
                                                {
                                                    this.state.categorisedProducts ? this.state.categorisedProducts.map((item, id) => {
                                                        //console.log(id)
                                                        return (
                                                            <Link to={{ pathname: '/listing', search: '?categoryId=' + item.tid, state: { 'item': item, level: 1 } }} key={id} onMouseEnter={() => { this.setState({ menu_level_one: id + 1 }) }}>
                                                                <div className="cat_sub_menu" style={{ backgroundColor: this.state.menu_level_one === id + 1 ? '#cf2717' : '#fff', color: this.state.menu_level_one === id + 1 ? '#fff' : '' }}>

                                                                    <div><img src={item.mobile_icon_path} width="50" /></div>
                                                                    <div>{item.name}</div>

                                                                </div>
                                                            </Link>
                                                        )

                                                    }) : ""
                                                }
                                            </div>
                                            <div className="cat_menu_second_wrpr" style={{ display: this.state.menu ? 'block' : 'none' }}>
                                                <img className="abs_img_menu" src={this.state.categorisedProducts && this.state.menu_level_one ? this.state.categorisedProducts[this.state.menu_level_one - 1].image_path : ""} />
                                                <div className="cat_menu_second" onMouseLeave={() => this.setState({ second_level_menu: undefined })}>
                                                    {
                                                        this.state.categorisedProducts && this.state.menu_level_one ? this.state.categorisedProducts[this.state.menu_level_one - 1].sub_category_tree.map((sub_item, id) => {
                                                            //console.log(this.state.menu_level_one)
                                                            return (
                                                                <Link to={{ pathname: '/listing', search: '?categoryId=' + sub_item.tid, state: { level: 2, item: this.state.categorisedProducts[this.state.menu_level_one - 1] } }} key={id} onMouseEnter={() => { this.setState({ second_level_menu: id + 1 }) }}>
                                                                    <div className="cat_sub_menu">

                                                                        {sub_item.name}

                                                                    </div>
                                                                </Link>
                                                            )

                                                        }) : ""
                                                    }
                                                    <div className="cat_menu_third" style={{ display: this.state.menu && this.state.second_level_menu ? 'block' : 'none' }} >
                                                        {
                                                            this.state.categorisedProducts && this.state.second_level_menu ? this.state.categorisedProducts[this.state.menu_level_one - 1].sub_category_tree[this.state.second_level_menu - 1].variant_category_tree.map((sub_item, id) => {
                                                                return (
                                                                    <Link to={{ pathname: '/listing', search: '?categoryId=' + sub_item.tid, state: {  level: 3, item: this.state.categorisedProducts[this.state.menu_level_one - 1],
                                                                      } }} key={id}>
                                                                        <div className="cat_sub_menu">

                                                                            {ReactHtmlParser(sub_item.name)}

                                                                        </div>
                                                                    </Link>
                                                                )

                                                            }) : ""
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </NavLink>
                                </NavItem>
                                <NavItem style={{ marginLeft: 20, display: 'flex', flexDirection: 'row' }}>
                                    <div className="input-group" style={{ width: '50vw' }}>
                                        <div className="input-group-prepend" style={{ position: 'relative' }}>
                                            <span className="input-group-text" style={{ backgroundColor: '#fff', border: 'none' }}><div><img style={{ margin: 'auto' }} src={searchicon}></img></div></span>
                                        </div>
                                        <input placeholder="Search Products" type="text" className="header_search form-control" style={{ borderRadius: 0 }} onChange={(e) => this.handleSearch(e)} onKeyPress={(e) => this._handleKeyPress(e)} />
                                        {this.state.searchArray ?
                                            <div className="search_dropdown">
                                                <SearchResults dataArray={this.state.searchArray} />
                                                {this.state.searchArray.length > 0 ?
                                                    <div><button className="button_red full_width" onClick={() => this.redirectTo('plp')}>View All Results</button></div>
                                                    :
                                                    <div className="search_no_items">There are no items related to the search .. Please try a different search</div>
                                                }
                                            </div>
                                            : ''}
                                    </div>
                                    <div>
                                        <button className='search_btn' type="submit" onClick={() => this.redirectTo('plp')}>Search</button>
                                    </div>
                                </NavItem>
                            </Nav>
                            <Nav className="ml-auto" navbar style={{ height: 60, alignItems: 'center' }}>

                                <NavItem onMouseEnter={() => this.setState({ user_menu: true})} onMouseLeave={() => this.setState({ user_menu:false })}>
                                    <NavLink style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                                        <div style={{ background: "url('https://web-img.kirana11.com/kirana11_V3/header-icons.png') #a51319 -136px -2px no-repeat", width: 35, height: 35 }}></div>
                                        <div style={{ color: '#fff', fontSize: 14, marginLeft: 10, display: this.state.userData ? (this.state.userData.user ? 'none' : 'flex') : 'flex' }} >
                                            <div onClick={() => this.redirectTo('/login', 1)}>Login</div>
                                            <div style={{ padding: '0 5px' }}>/</div>
                                            <div onClick={() => this.redirectTo('/login', 2)}>Sign Up</div></div>
                                        <div style={{ color: '#fff', fontSize: 14, marginLeft: 10, display: this.state.userData ? (this.state.userData.user ? '' : 'none') : 'none' }} >
                                            {this.state.userData ? this.state.userData.user.display_name : ''}

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
                                                {/* <Link to={{ pathname: '/my_rewards' }}   >
                                                    <div className="cat_sub_menu">
                                                        My Rewards
                                                            </div>
                                                </Link> */}
                                                <Link to={{ pathname: '/change_pwd' }}   >
                                                    <div className="cat_sub_menu">
                                                        Change Password
                                                            </div>
                                                </Link>

                                                <Link to='' onClick={() => this.signout()} >
                                                    <div className="cat_sub_menu">
                                                        Signout
                                                            </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </NavLink>
                                </NavItem>
                                <NavItem className="header_cart" onClick={() => this.setState({ miniOpen: !this.state.miniOpen })} style={{ backgroundColor: this.props.cartIcon === false ? '#cf2717' : '' }} >
                                    <div to="#" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}} style={{ display: this.props.cartIcon === false ? 'none' : '' }}>
                                        <img alt="cart" src={cart_icon} height="30" />
                                        <div style={{ display: this.state.cartObj ? (this.state.cartObj.length > 0 ? 'flex' : 'none') : 'none' }} className="cart_tip">{this.state.cartObj ? this.state.cartObj.length : ''}</div>
                                    </div>
                                    <div style={{ display: this.state.miniOpen === true ? '' : 'none' }} className='minicart' >
                                        {this.state.miniOpen === true ?
                                            <Minicart change={this.state.change} revChange={() => this.setrevChange()} />
                                            : ""}

                                    </div>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Navbar>

                </div >
                        )
                            : 
                        (
                    <div>
                         <Navbar light expand="md" style={{ backgroundColor: '#d12129' }} className="main_header">
                            <Nav className="ml-left" navbar>
                                <NavItem>
                                        <NavLink href="/" style={{ borderRightWidth: 2, borderRightStyle: 'solid', borderColor: '#c11a21', paddingRight: 5 }}><img src={logo} height='25' /></NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href="/" style={{ borderRightWidth: 2, borderRightStyle: 'solid', borderColor: '#c11a21', paddingRight: 5 }}><img src={logo} height='25' /></NavLink>
                                </NavItem>
        
                            </Nav>
                        <Nav className="ml-auto" navbar style={{ height: 60, alignItems: 'center' }}>

                            <NavItem style={{ position: 'relative' }} onClick={() => this.setState({ modalOpen: !this.state.modalOpen })}>
                                <NavLink >
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', color: '#fff' }} >
                                        <div><img style={{ margin: 'auto' }} src={location}></img></div>
                                        <div className="formatted_address">{this.state.location ? this.state.location.formattedAddress : ''} </div>
                                        <div style={{ marginLeft: 10 }}><img src={arrow}></img></div>
                                    </div>
                                </NavLink>
                            </NavItem>
                       
                        </Nav>
                        <Nav className="ml-right" navbar style={{ height: 60, alignItems: 'center' }}>
                        <NavItem className="header_cart" onClick={() => this.setState({ miniOpen: !this.state.miniOpen })}  >
                            <div to="#" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }} style={{ display: this.props.cartIcon === false ? 'none' : '' }}>
                                <img alt="cart" src={cart_icon} height="25" />
                                <div style={{ display: this.state.cartObj ? (this.state.cartObj.length > 0 ? 'flex' : 'none') : 'none' }} className="cart_tip">{this.state.cartObj ? this.state.cartObj.length : ''}</div>
                            </div>
                            <div style={{ display: this.state.miniOpen === true ? '' : 'none' }} className='minicart'>
                                {this.state.miniOpen === true ?
                                    <Minicart change={this.state.change} revChange={() => this.setrevChange()} />
                                    : ""}

                            </div>
                         </NavItem>
                         </Nav>
                     </Navbar>
                    <Navbar>
                        <Nav style={{ width: '100%' }}>
                        <NavItem style={{ display: 'flex', flexDirection: 'row',width: '100%' }}>
                                    <div className="input-group" style={{ width: '100%' }}>
                                        <div className="input-group-prepend" style={{ position: 'relative' }}>
                                            <span className="input-group-text" style={{ backgroundColor: '#fff', border: 'none' }}><div><img style={{ margin: 'auto' }} src={searchicon}></img></div></span>
                                        </div>
                                        <input placeholder="Search Products" type="text" className="header_search form-control" style={{ borderRadius: 0 }} onChange={(e) => this.handleSearch(e)} onKeyPress={(e) => this._handleKeyPress(e)} />
                                        {this.state.searchArray ?
                                            <div className="search_dropdown">
                                                <SearchResults dataArray={this.state.searchArray} />
                                                {this.state.searchArray.length > 0 ?
                                                    <div><button className="button_red full_width" onClick={() => this.redirectTo('plp')}>View All Results</button></div>
                                                    :
                                                    <div className="search_no_items">There are no items related to the search .. Please try a different search</div>
                                                }
                                            </div>
                                            : ''}
                                    </div>
                                    <div style={{width:'25%'}}>
                                        <button className='search_btn' type="submit" >Search</button>
                                    </div>
                                </NavItem>
                        </Nav>
                    </Navbar>
                    <div style={{width:'100%'}} onClick={()=>this.setState({sm_menu_modal:!this.state.sm_menu_modal})}>
                        Shop
                    </div>
                    <div style={{display:this.state.sm_menu_modal === true ? '':'none'}} className="menu_modal">
                   <div className="menu_wrpr">
                   </div>
                    {
                        this.state.categorisedProducts ? this.state.categorisedProducts.map((item, id) => {
                            return(
                            <div>
                               {item.name}
                            </div>
                            )
                        })

                   :'' }

                                </div>
                   </div>
                    
                            )
                            }
                
            </div>
        );
    }
}

export default Header; 