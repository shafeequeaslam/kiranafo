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
import Geolocation from 'react-geolocation'


class Header extends Component {
    constructor(props) {
        super(props);
        console.log(this.props)
        this.state = {
            isOpen: false,
            tooltip: false,
            modalOpen: false,
            userMenu: false,
            loggedIn: false,
            cat_menu: false, categorisedProducts: []
        };
        this.modalOpens = this.modalOpens.bind(this);
        Geocode.setApiKey("AIzaSyDrX--l_ZLlQIZirllVuvpCqqTk8jbB4RE");
    }
    componentWillMount() {
        let cartObj= JSON.parse(localStorage.getItem('cartObj'));
        if(cartObj != null){
            this.setState({
                cartObj:cartObj
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
        else if(id == 'plp'){
            window.location = '/listing?search='+this.state.searchParam
        }
    }
    componentWillReceiveProps(nextProps, prevState) {
        // this.setState({
        //     cartObj:undefined
        // })
        let cartObj = JSON.parse(localStorage.getItem('cartObj'));
        
        this.setState({
            cartObj:cartObj
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
    handleSearch(e){
        if(e.target.value.length > 2){
            this.setState({
                searchParam:e.target.value
            })
            console.log(e.target.value.toLowerCase())
            let search = e.target.value.toLowerCase();
            let query =
            {
                "query": {
                    "bool": {
                        "must": [
                            { "prefix": { "title": { "value": search } } }
                        ]
                    }
                },
                "sort": [
                    { "category_weight": { "order": "asc" } }
                ],
                "from": 0,
                "size": 5
            }

            Axios({
                method: 'post',
                header: {
                    'Content-type': 'application/json',
                },
                url: 'https://search-dev-es-copy-gwr5oh7fnmcdbbajt2t5iyfyf4.ap-south-1.es.amazonaws.com/kirana11/product_display/_search?pretty=true&filter_path=hits.hits',
                data: query

            })
                // .then(res => res)
                .then((data) => {
                    console.log(data.data.hits.hits,'data');
                    if(data.data.hits.hits.length > 0){
                        this.setState({
                            searchArray:data.data.hits.hits
                        })
                    }
                    else{
                        this.setState({
                            searchArray:data.data.hits.hits
                        })
                    }
                   
                    // })
                    // this.setState({
                    //     searchResults: data.data.hits.hits
                    // })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        else{
            this.setState({
                searchArray:undefined
            })
        }
        
    }
    getCurrentPosition(lat,long){
        let selectedLocation={};
            Geocode.fromLatLng(lat,long).then(
                response => {
                    console.log(response.results[0],response.results[0].address_components)
                    selectedLocation.name= response.results[0].address_components[0].long_name,
                    selectedLocation.formattedAddress=response.results[0].formatted_address,
                    selectedLocation.lat= lat,
                    selectedLocation.lng=long,
                    selectedLocation.postalCode = this.getPostalCodeFromAddress(response.results[0].address_components);
                    console.log('1212 . 1')
                    localStorage.setItem("location", JSON.stringify(selectedLocation));
                }
            )
            error => {
                console.error(error);
            }
        
       
        // localStorage.setItem("location", JSON.stringify(selectedLocation));


        


        let locationOne = JSON.parse(localStorage.getItem("location"))
        let usr = JSON.parse(localStorage.getItem("userDetails"));
        let params = new URLSearchParams();
        if (locationOne != null && usr != null) {
            console.log(locationOne)
            this.setState({
                location: null
            })
            console.log('here')
            params.append('address', locationOne.formattedAddress);
            params.append('latitude', locationOne.lat);
            params.append('longitude', locationOne.lng);
            params.append('source', 'web');
            params.append('uid', usr.user.uid);
            // console.log(datas)


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
                        console.log(value, 'data11');
                        
                        localStorage.setItem('location_dc', JSON.stringify(value.data.serving_area[0]))
                        //   AsyncStorage.setItem('userLocation', JSON.stringify({ 'description': json.results[0].formatted_address, 'location': location, 'pincode': pincode }))
                        //   this.props.getFooterActive(0);
                        //   Actions.home();


                    }
                    else {
                        alert("This area is not yet serviceable");
                        localStorage.removeItem('location');
                    }

                })
                .catch((err) => {
                    console.log(err.response, 'err');
                    localStorage.removeItem('location');

                })
            // window.location.href = '/'
        }
       setTimeout(()=>{
        let loc = JSON.parse(localStorage.getItem('location'))
        console.log(loc,'1111')
        if (loc != null) {
            this.setState({
                location: loc,
                modalOpen: !this.state.modalOpen
            })
        }
       },100) 
    
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
                                            console.log('1212 . 1')
                                            localStorage.setItem("location", JSON.stringify(selectedLocation));
                                        }
                                    )
                                }
                                else {
                                    selectedLocation.postalCode = postalCode;
                                    console.log('1212 . 12')
                                    localStorage.setItem("location", JSON.stringify(selectedLocation));
                                }
                                // localStorage.setItem("location", JSON.stringify(selectedLocation));


                                error => {
                                    console.error(error);
                                }


                                let locationOne = JSON.parse(localStorage.getItem("location"))
                                let usr = JSON.parse(localStorage.getItem("userDetails"));
                                let params = new URLSearchParams();
                                if (locationOne != null && usr != null) {
                                    this.setState({
                                        location: null
                                    })
                                    console.log('here')
                                    params.append('address', locationOne.formattedAddress);
                                    params.append('latitude', locationOne.lat);
                                    params.append('longitude', locationOne.lng);
                                    params.append('source', 'web');
                                    params.append('uid', usr.user.uid);
                                    // console.log(datas)


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
                                                console.log(value, 'data11');
                                                
                                                localStorage.setItem('location_dc', JSON.stringify(value.data.serving_area[0]))
                                                //   AsyncStorage.setItem('userLocation', JSON.stringify({ 'description': json.results[0].formatted_address, 'location': location, 'pincode': pincode }))
                                                //   this.props.getFooterActive(0);
                                                //   Actions.home();


                                            }
                                            else {
                                                alert("This area is not yet serviceable");
                                                localStorage.removeItem('location');
                                            }

                                        })
                                        .catch((err) => {
                                            console.log(err.response, 'err');
                                            localStorage.removeItem('location');

                                        })
                                    // window.location.href = '/'
                                }
                               setTimeout(()=>{
                                let loc = JSON.parse(localStorage.getItem('location'))
                                console.log(loc,'1111')
                                if (loc != null) {
                                    this.setState({
                                        location: loc,
                                        modalOpen: !this.state.modalOpen
                                    })
                                }
                               },100) 
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
      <button className="button_white" onClick={()=>this.getCurrentPosition(latitude, longitude)}>Deliver to my Current Location </button>
     
       
      
    </div>}
/>
                        {/* <button className="button_white">Deliver to my Current Location </button> */}
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

                    <NavbarBrand href="/" style={{ borderRightWidth: 2, borderRightStyle: 'solid', borderColor: '#c11a21', paddingRight: 20 }}><img src={logo} height='50' /></NavbarBrand>
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
                                    <div className="input-group-prepend" style={{position:'relative'}}>
                                        <span className="input-group-text" style={{ backgroundColor: '#fff', border: 'none' }}><div><img style={{ margin: 'auto' }} src={searchicon}></img></div></span>
                                    </div>
                                    <input placeholder="Search Products" type="text" className="header_search form-control" style={{ borderRadius: 0 }} onChange={(e)=>this.handleSearch(e)} />
                                    {this.state.searchArray?
                                    <div className="search_dropdown">
                                         <SearchResults dataArray={this.state.searchArray}/>
                                        {this.state.searchArray.length > 0 ? 
                                         <div><button className="button_red full_width" onClick={()=>this.redirectTo('plp')}>View All Results</button></div>
                                        :
                                        <div className="search_no_items">There are no items related to the search .. Please try a different search</div>
                                        }
                                    </div>
                                    :''}
                                </div>
                                <div>
                                    <button className='search_btn' >Search</button>
                                </div>
                            </NavItem>
                        </Nav>
                        <Nav className="ml-auto" navbar style={{ height: 60, alignItems: 'center' }}>

                            <NavItem >
                                <NavLink style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} onClick={() => this.setState({ user_menu: !this.state.user_menu })}>
                                    <div style={{ background: "url('https://web-img.kirana11.com/kirana11_V3/header-icons.png') #a51319 -136px -2px no-repeat", width: 35, height: 35 }}></div>
                                    <div style={{ color: '#fff', fontSize: 14, marginLeft: 10, display: this.state.userData ? (this.state.userData.user ? 'none' : '') : '' }} onClick={() => this.redirectTo('/login')}>Login / Sign Up</div>
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
                                            <Link to={{ pathname: '/change_pwd' }}   >
                                                <div className="cat_sub_menu">
                                                    Change Password
                                                            </div>
                                            </Link>
                                            <Link to={{ pathname: '/shake_shake' }}   >
                                                <div className="cat_sub_menu">
                                                    Shake Shake
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
                            <NavItem className="header_cart">
                                <Link to="" onClick={() => this.redirectTo("cart")} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',position:'relative' }}>
                                    <img src="https://www.kirana11.com/sites/all/themes/kirana11_v3/images/cart.png" alt="cart" />
                                    <div style={{display:this.state.cartObj ? (this.state.cartObj.length > 0 ? 'flex':'none'):'none'}} className="cart_tip">{this.state.cartObj?this.state.cartObj.length:''}</div>
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