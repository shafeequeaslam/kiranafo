import React, { Component } from 'react';
import '../HomePage/home.css';
import './plp.css'
import { Col, Row } from 'reactstrap'
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/sidebar';

import Header from '../../components/Header/header';
import { LISTING_BY_ID_CATEGORY, SEARCH_RESULTS_FULL, DOMAIN } from '../../utis/API';
import LinesEllipsis from 'react-lines-ellipsis';
import CardComponent from '../../components/card';
import Axios from 'axios';
import FooterComponent from '../../components/footer-components/Footer/containers/footer';

let cartObj = undefined;

class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listItems: undefined,
            product_quantity: undefined,
            activeButton: [],
            activePage: 0,
            category_name:this.props.location.state ? this.props.location.state.item.name : '',
            menuItems:this.props.location.state ? this.props.location.state.item.sub_category_tree ? this.props.location.state.item.sub_category_tree : this.props.location.state.item.variant_category_tree : '',
        };
        this.loadProductDetails = this.loadProductDetails.bind(this)
    }
    componentWillMount() {
        console.log(this.props);
        let url = window.location.href;
        let url_string = url;
        let urlStr = new URL(url_string);
        let category_id = urlStr.searchParams.get("categoryId");
        let search = urlStr.searchParams.get("search");
        let level = urlStr.searchParams.get("level");
        let deal_type = urlStr.searchParams.get("dealType");
        console.log(level)
        if (level != null) {
            this.setState({
                search: true,
                banner: true,
                banner_id: category_id, banner_level: level
            })
            console.log('here', level)
            this.loadProductDetailsTest(category_id, level)
        }
        else if (deal_type != null) {
            this.setState({
                search: true,
                deal_type: deal_type
            })
            this.loadProductDetailsDeals(deal_type)
        }
        else if (search != null) {
            this.setState({
                search: true
            })
            let searchq = search.toLowerCase();

            Axios({
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
                url: SEARCH_RESULTS_FULL + searchq + '&sort=asc&mode=min&from=0&size=12',
                // data: query

            })
                .then((data) => {
                    this.setState({
                        listItems: data.data,
                    })
                })
                .catch((err) => {
                    //console.log(err)
                })
        }
        else if (category_id != null) {
            this.setState({
                productId: category_id, search: false
            });
            this.loadProductDetails(category_id);
        }



        let val = localStorage.getItem('cartObj')
        if (val != null) {
            cartObj = JSON.parse(val);
        }
        else
            cartObj = undefined

    }

    // componentDidMount() {
    //     //console.log(this.props)
    // }
    componentWillReceiveProps(nextProps, prevState) {
        console.log(nextProps)
        let url = window.location.href;
        let url_string = url;
        let urlStr = new URL(url_string);
        let category_id = urlStr.searchParams.get("categoryId");
        let search = urlStr.searchParams.get("search");
        let level = urlStr.searchParams.get("level");
        let deal_type = urlStr.searchParams.get("dealType");
        console.log(level)

        this.setState({
            activePage: 0
        })
        setTimeout(() => {
            if (level != null) {
                this.setState({
                    search: true, banner: true, banner_id: category_id, banner_level: level
                })
                console.log('here', level)
                this.loadProductDetailsTest(category_id, level)
            }
            else if (deal_type != null) {
                this.setState({
                    search: true,
                    deal_type: deal_type
                })
                this.loadProductDetailsDeals(deal_type)
            }
            else if (search != null) {
                this.setState({
                    search: true
                })
                let searchq = search.toLowerCase();

                Axios({
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    url: SEARCH_RESULTS_FULL + searchq + '&sort=asc&mode=min&from=0&size=16',
                    // data: query

                })
                    // .then(res => res)
                    .then((data) => {
                        this.setState({
                            listItems: undefined
                        })
                        //console.log(data,'data');

                        // for(let i=0;i<listingDetails.length;i++){
                        //     activeBtn[i]=0; 
                        //  }
                        this.setState({
                            listItems: data.data
                        })


                        // })
                        // this.setState({
                        //     searchResults: data.data.hits.hits
                        // })
                    })
                    .catch((err) => {
                        //console.log(err)
                    })
            }
            else if (category_id != null) {
                this.setState({
                    productId: category_id, search: false
                });
                this.loadProductDetails(category_id);
            }
        }, 100)



    }
    refreshItems(){
        let url = window.location.href;
        let url_string = url;
        let urlStr = new URL(url_string);
        let category_id = urlStr.searchParams.get("categoryId");
        let search = urlStr.searchParams.get("search");
        let level = urlStr.searchParams.get("level");
        let deal_type = urlStr.searchParams.get("dealType");
        console.log(level)

        this.setState({
            activePage: 0
        })
        setTimeout(() => {
            if (level != null) {
                this.setState({
                    search: true, banner: true, banner_id: category_id, banner_level: level
                })
                console.log('here', level)
                this.loadProductDetailsTest(category_id, level)
            }
            else if (deal_type != null) {
                this.setState({
                    search: true,
                    deal_type: deal_type
                })
                this.loadProductDetailsDeals(deal_type)
            }
            else if (search != null) {
                this.setState({
                    search: true
                })
                let searchq = search.toLowerCase();

                Axios({
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    url: SEARCH_RESULTS_FULL + searchq + '&sort=asc&mode=min&from=0&size=16',
                    // data: query

                })
                    // .then(res => res)
                    .then((data) => {
                        this.setState({
                            listItems: undefined
                        })
                        //console.log(data,'data');

                        // for(let i=0;i<listingDetails.length;i++){
                        //     activeBtn[i]=0; 
                        //  }
                        this.setState({
                            listItems: data.data
                        })


                        // })
                        // this.setState({
                        //     searchResults: data.data.hits.hits
                        // })
                    })
                    .catch((err) => {
                        //console.log(err)
                    })
            }
            else if (category_id != null) {
                this.setState({
                    productId: category_id, search: false
                });
                this.loadProductDetails(category_id);
            }
        }, 100)
    }
    getBrandItems() {
        let url;
        let id = this.props.location.state.item.tid;
        if (this.props.location.state.level === 1) {
            url = 'brand_filter_first?parent_cat=' + id
        }
        else if (this.props.location.state.level === 2) {
            url = 'brand_filter_second?parent_cat=' + id
        }
        else if (this.props.location.state.level === 3) {
            url = 'brand_filter_third?cat_id=' + id
        }
        Axios({
            url: DOMAIN + url,
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((data) => {
                console.log(data.data.brands.buckets, "1111")
                this.setState({
                    brand_Items: undefined
                })
                setTimeout(() => {
                    this.setState({
                        brand_Items: data.data.brands.buckets
                    })
                }, 1000)

            })
            .catch((err) => {
                console.log(err.response)
            })
    }

    refreshBrandItems(id, level) {
        let url;
        console.log(id)
        if (level === 1) {
            url = 'brand_filter_first?parent_cat=' + id
        }
        else if (level === 2) {
            url = 'brand_filter_second?parent_cat=' + id
        }
        else if (level === 3) {
            url = 'brand_filter_third?cat_id=' + id
        }
        Axios({
            url: DOMAIN + url,
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((data) => {
                console.log(data.data.brands.buckets, "1111")
                this.setState({
                    brand_Items: undefined
                })
                setTimeout(() => {
                    this.setState({
                        brand_Items: data.data.brands.buckets
                    })
                }, 1000)

            })
            .catch((err) => {
                console.log(err.response)
            })
    }
    loadProductDetails = (data, sort, mode) => {
        console.log(sort, mode)
        let sortValue;
        let modeValue
        if (!sort) {
            sortValue = "asc"
        }
        else if (sort) {
            sortValue = sort
        }
        if (!mode) {
            modeValue = "min"
        }
        else if (mode) {
            modeValue = mode
        }
        let id;
        let type;
        let data_type;

        if (this.state.updatedId) {
            id = this.state.updatedId
        }
        else
            id = this.props.location.state.item.tid;
        if (this.state.updatedLevel) {
            if (this.state.updatedLevel === 1) {
                type = 'category';
                data_type = 'parent_cat'
            }
            else if (this.state.updatedLevel === 2) {
                type = 'category/second';
                data_type = 'parent_cat'
            }
            else if (this.state.updatedLevel === 3) {
                type = 'category/third';
                data_type = 'cat_id'
            }
        }
        else {
            if (!data) {
                id = this.props.location.state.item.tid;
            }
            else id = data;

            if (this.props.location.state.level === 1) {
                type = 'category';
                data_type = 'parent_cat'
            }
            else if (this.props.location.state.level === 2) {
                type = 'category/second';
                data_type = 'parent_cat'
            }
            else if (this.props.location.state.level === 3) {
                type = 'category/third';
                data_type = 'cat_id'
            }
        }



        //console.log(id)
        let from = this.state.activePage * 12;

        console.log(from)
        Axios(LISTING_BY_ID_CATEGORY + type, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                [data_type]: id,
                "sort": sortValue,
                "mode": modeValue,
                "from": from,
                "size": 12
            })
        })
            .then((listingDetails) => {
                this.setState({
                    listItems: undefined,
                })
                console.log(listingDetails, "121")
                let activeBtn = []

                for (let i = 0; i < listingDetails.data.length; i++) {
                    activeBtn[i] = 0;
                }
                //console.log(listingDetails,"121212")
                setTimeout(() => {
                    this.setState({
                        listItems: listingDetails.data,
                        activeButton: activeBtn
                    })
                }, 200)
            }).catch((error) => {
                console.error(error.response)
            });
        this.getBrandItems();

    }
    loadProductDetailsTest(id, level, sort, mode) {
        let sortValue;
        let modeValue;

        if (!sort) {
            sortValue = "asc"
        }
        else {
            sortValue = sort
        }
        if (!mode) {
            modeValue = "min"
        }
        else {
            modeValue = mode
        }

        let type;
        let data_type;
        if (level = "First Level") {
            type = 'category';
            data_type = 'parent_cat'
        }
        else if (level = "Second Level") {
            type = 'category/second';
            data_type = 'parent_cat'
        }
        else {
            type = 'category/third';
            data_type = 'cat_id'
        }



        //console.log(id)
        let from = this.state.activePage * 12;

        console.log(from, LISTING_BY_ID_CATEGORY + type, data_type)
        Axios(LISTING_BY_ID_CATEGORY + type, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                [data_type]: id,
                "sort": sortValue,
                "mode": modeValue,
                "from": from,
                "size": 12
            })
        })
            .then((listingDetails) => {
                this.setState({
                    listItems: undefined,
                })
                console.log(listingDetails.data, "121")
                let activeBtn = []

                for (let i = 0; i < listingDetails.data.length; i++) {
                    activeBtn[i] = 0;
                }
                //console.log(listingDetails,"121212")
                setTimeout(() => {
                    this.setState({
                        listItems: listingDetails.data,
                        activeButton: activeBtn
                    })
                }, 200)
            })
            .catch((err) => {
                console.log(err.response)
            })
    }
    loadProductDetailsDeals(type) {
        Axios({
            url: 'https://dev-esexpressv1.kirana11.com/deals_product?type=' + type,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((listingDetails) => {
                this.setState({
                    listItems: undefined,
                })
                console.log(listingDetails, "121")
                let activeBtn = []

                for (let i = 0; i < listingDetails.data.length; i++) {
                    activeBtn[i] = 0;
                }
                //console.log(listingDetails,"121212")
                setTimeout(() => {
                    this.setState({
                        listItems: listingDetails.data,
                        activeButton: activeBtn
                    })
                }, 100)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    storeCart(type, prIndex, i) {
        //console.log(i, prIndex, this.state.listItems[prIndex].inner_hits.products.hits.hits[this.state.activeButton[prIndex]]._source)
        if (cartObj) {
            //console.log(this.state.listItems)
            let pid = this.state.listItems[prIndex].inner_hits.products.hits.hits[this.state.activeButton[prIndex]]._source.pid;
            let found = cartObj.filter(function (el) {
                return el.productData.pid == pid
            })[0];
            if (found) {
                if (type === 'incr') {
                    found.product_quantity = found.product_quantity + 1;

                    let pr_q = this.state.product_quantity;
                    if (pr_q[this.state.activeButton[prIndex]]) {
                        pr_q[this.state.activeButton[prIndex]] = found.product_quantity
                    }
                    else
                        pr_q[this.state.activeButton[prIndex]] = 1
                    this.setState({
                        product_quantity: pr_q
                    })
                }
                if (type === 'decr') {
                    if (found.product_quantity > 1) {
                        found.product_quantity = found.product_quantity - 1;
                        let pr_q = this.state.product_quantity;
                        pr_q[this.state.activeButton[prIndex]] = found.product_quantity

                        this.setState({
                            product_quantity: pr_q,
                        })
                    }

                    else {
                        for (let j = 0; j < cartObj.length; j++) {
                            if (cartObj[j].productData.pid === found.productData.pid) {
                                cartObj.splice(j, 1);
                                let pr_q = this.state.product_quantity;
                                pr_q[this.state.activeButton[prIndex]] = undefined;
                                this.setState({
                                    product_quantity: pr_q,
                                })
                            }
                        }

                    }

                }
            }
            if (!found) {
                let pr_q = this.state.product_quantity;
                pr_q[this.state.activeButton[prIndex]] = 1

                cartObj.push({
                    productData: this.state.listItems[prIndex].inner_hits.products.hits.hits[this.state.activeButton[prIndex]],
                    product_quantity: 1
                });
                this.setState({
                    product_quantity: pr_q
                })
            }
            localStorage.setItem('cartObj', JSON.stringify(cartObj));

            this.setState({
                cartObj: cartObj
            })
        }

        else {
            let pr_q = this.state.product_quantity || [];
            pr_q[prIndex] = 1
            let obj = [
                {
                    productData: this.state.listItems[prIndex].inner_hits.products.hits.hits[this.state.activeButton[prIndex]],
                    product_quantity: pr_q
                }
            ]
            cartObj = obj;
            localStorage.setItem('cartObj', JSON.stringify(obj));

            this.setState({
                cartObj: cartObj
            })
        }
        //console.log(cartObj)
        // this.handleCart(cartObj);
        // this.getLocCount();
        // this.getCartData();
        // if (i == 0) {
        //     this.setState({
        //         items: []
        //     })
        //     AsyncStorage.getItem("items")

        //         .then((val) => {
        //             let items = JSON.parse(val)

        //             this.setState({
        //                 items: items
        //             })

        //         }

        //         )
        // }

    }

    setChange() {
        this.setState({
            change: undefined
        })
        this.setState({
            change: true
        })
    }

    filterData(id, index) {
        console.log(id);
        this.setState({
            indexedFilter: index
        })
        this.filterListData(id, "level_filter")
    }
    brandfilter(id) {
        this.filterListData(id, 'brands')
    }

    filterListData(search_id, search_type) {
        let type;
        let data_type;
        let id;

        let brand = [];
        let level;

        if (search_type == 'brands') {
            console.log(search_id)
            if (!search_id) {
                brand = [];
            }
            else
                brand = [search_id];
            console.log(brand)
            if (this.state.updatedId) {
                id = this.state.updatedId
            }
            else
                id = this.props.location.state.item.tid;
            if (this.state.updatedLevel) {
                if (this.state.updatedLevel === 1) {
                    type = 'category';
                    data_type = 'parent_cat'
                }
                else if (this.state.updatedLevel === 2) {
                    type = 'category/second';
                    data_type = 'parent_cat'
                }
                else if (this.state.updatedLevel === 3) {
                    type = 'category/third';
                    data_type = 'cat_id'
                }
            }
            else {
                if (this.props.location.state.level === 1) {
                    type = 'category';
                    data_type = 'parent_cat'
                }
                else if (this.props.location.state.level === 2) {
                    type = 'category/second';
                    data_type = 'parent_cat'
                }
                else if (this.props.location.state.level === 3) {
                    type = 'category/third';
                    data_type = 'cat_id'
                }
            }
        }
        else {
            id = search_id.tid;
            console.log(id)
            if (search_id.variant_category_tree) {
                level = 2;
                this.setState({
                    updatedLevel: 2, updatedId: id
                })

            }
            else {
                level = 3;
                this.setState({
                    updatedLevel: 3,
                    updatedId: id
                })
            }
            this.refreshBrandItems(search_id.tid, level);
            console.log(level)
            // this.renderBreadCrumbs(level, id);

            if (level === 1) {

                type = 'category';
                data_type = 'parent_cat'
            }
            else if (level === 2) {
                type = 'category/second';
                data_type = 'parent_cat'
            }
            else if (level === 3) {
                type = 'category/third';
                data_type = 'cat_id'
            }

        }
        console.log(type);




        //console.log(id)
        let from = this.state.activePage * 12;

        console.log(from)
        Axios(LISTING_BY_ID_CATEGORY + type, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                [data_type]: parseInt(id),
                "sort": "asc",
                'brand': brand,
                "mode": "min",
                "from": from,
                "size": 12
            })
        })
            .then((listingDetails) => {
                this.setState({
                    listItems: undefined,
                    category_name:undefined,menuItems:undefined
                })
                console.log(listingDetails, "121")
                let activeBtn = []

                for (let i = 0; i < listingDetails.data.length; i++) {
                    activeBtn[i] = 0;
                }
                //console.log(listingDetails,"121212")
                setTimeout(() => {
                    this.setState({
                        listItems: listingDetails.data,
                        activeButton: activeBtn,
                        category_name:search_id.name,
                        menuItems: search_id.sub_category_tree ? search_id.sub_category_tree : search_id.variant_category_tree 
                    })
                }, 100)
            })
            .catch((error) => {
                console.log(error.response)
            });
    }


    paginate(type) {
        //console.log(this.props);
        if (type == 'next') {
            this.setState({
                activePage: this.state.activePage + 1
            })
        }
        if (type == 'prev') {
            this.setState({
                activePage: this.state.activePage - 1
            })
        }

        let url = window.location.href;
        let url_string = url;
        let urlStr = new URL(url_string);
        let category_id = urlStr.searchParams.get("categoryId");
        let search = urlStr.searchParams.get("search");
        setTimeout(() => {
            if (this.state.banner == true) {
                this.loadProductDetailsTest(this.state.banner_id, this.state.banner_level);
            }

            else if (search != null) {
                this.setState({
                    search: true
                })
                let searchq = search.toLowerCase();
                let from = this.state.activePage * 12;

                Axios({
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    url: SEARCH_RESULTS_FULL + searchq + '&sort=asc&mode=min&from=' + from + '&size=12',
                    // data: query

                })
                    // .then(res => res)
                    .then((data) => {
                        this.setState({
                            listItems: undefined,
                        })

                        //console.log(data.data,'data,paginate');


                        this.setState({
                            listItems: data.data,
                        })


                        // })
                        // this.setState({
                        //     searchResults: data.data.hits.hits
                        // })
                    })
                    .catch((err) => {
                        //console.log(err)
                    })
            }
            else if (category_id != null) {
                this.setState({
                    productId: category_id
                });
                this.loadProductDetails(category_id);
            }

        }, 200)


        let val = localStorage.getItem('cartObj')
        if (val != null) {
            cartObj = JSON.parse(val);
        }
        else
            cartObj = undefined

    }

    sortData(type) {
        console.log(type)
        //console.log(this.props);
        let sort;
        let mode;
        if (type === 'asc') {
            console.log('1')
            sort = "asc";
            mode = "min";
        }
        if (type === 'desc') {
            console.log('2')
            sort = "desc";
            mode = "max";
        }

        let url = window.location.href;
        let url_string = url;
        let urlStr = new URL(url_string);
        let category_id = urlStr.searchParams.get("categoryId");
        let search = urlStr.searchParams.get("search");
        setTimeout(() => {
            if (this.state.banner == true) {
                this.loadProductDetailsTest(this.state.banner_id, this.state.banner_level, sort, mode);
            }

            else if (search != null) {
                this.setState({
                    search: true
                })
                let searchq = search.toLowerCase();
                let from = this.state.activePage * 12;

                Axios({
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    url: SEARCH_RESULTS_FULL + searchq + '&sort=' + sort + '&mode=' + mode + '&from=' + from + '&size=12',
                    // data: query

                })
                    // .then(res => res)
                    .then((data) => {
                        this.setState({
                            listItems: undefined,
                        })

                        //console.log(data.data,'data,paginate');


                        this.setState({
                            listItems: data.data,
                        })


                        // })
                        // this.setState({
                        //     searchResults: data.data.hits.hits
                        // })
                    })
                    .catch((err) => {
                        //console.log(err)
                    })
            }
            else if (category_id != null) {
                this.setState({
                    productId: category_id
                });
                this.loadProductDetails(category_id, sort, mode);
            }

        }, 200)


        let val = localStorage.getItem('cartObj')
        if (val != null) {
            cartObj = JSON.parse(val);
        }
        else
            cartObj = undefined


    }
    renderBreadCrumbs(level, updatedId) {
        if (level && updatedId) {
            console.log(this.props.location.state)
            if (level === 1) {
                return (
                    <div className="plp_nav_bar">
                        <div><Link to="/">Home</Link></div>
                        <div className="plp_margin">/</div>
                        <div className="bread_crum_red"> {this.props.location.state.item.name}</div>
                    </div>
                )
            }
            else if (level === 2) {
                console.log(level)
                if (this.props.location.state.level < level) {
                    let data = this.props.location.state.item.sub_category_tree;
                    let sub_tree;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].tid == updatedId) {
                            sub_tree = data[i]
                            console.log(sub_tree.name)
                            return (
                                <div className="plp_nav_bar">
                                    <div><Link to="/">Home</Link></div>
                                    <div className="plp_margin">/</div>

                                    <div> <div> {this.props.location.state.item.name}</div></div>

                                    <div className="plp_margin">/</div>
                                    <div className="bread_crum_red" >{sub_tree.name}</div>
                                </div>
                            )

                        }
                    }

                }
                else {
                    <div className="plp_nav_bar">
                        <div><Link to="/">Home</Link></div>
                        <div className="plp_margin">/</div>

                        <div> <div className="bread_crum_red"> {this.props.location.state.fullData.name}</div></div>

                        <div className="plp_margin">/</div>
                        <div className="bread_crum_red" >{this.props.location.state.secondLevelData.name}</div>
                    </div>
                }
            }
            else if (level === 3) {
                {console.log(this.props.location.state)}
                <div className="plp_nav_bar">
                    <div><Link to="/">Home</Link></div>
                    <div className="plp_margin">/</div>
                    <div> <div className="bread_crum_red"> {this.props.location.state.fullData.name}</div></div>

                    <div className="plp_margin">/</div>
                    <div className="bread_crum_red" >{console.log(this.props.location.state.fullData.sub_category_tree[0].name, this.state.indexedFilter)}</div>
                    <div className="plp_margin">/</div>
                    <div className="bread_crum_red" >{this.props.location.state.item.name}</div>


                    <div className="plp_margin">/</div>
                    <div className="bread_crum_red">{this.props.location.state.item.name}</div>
                </div>
            }
        }
        else {
            if (this.props.location.state.level === 1) {
                return (
                    <div className="plp_nav_bar">
                        <div><Link to="/">Home</Link></div>
                        <div className="plp_margin">/</div>
                        <div className="bread_crum_red"> {this.props.location.state.item.name}</div>
                    </div>
                )
            }
            else if (this.props.location.state.level === 2) {
                return (
                    <div className="plp_nav_bar">
                        <div><Link to="/">Home</Link></div>
                        <div className="plp_margin">/</div>
                        <div><Link className="bread_crum_red" to={{ pathname: '/listing', search: '?categoryId=' + this.props.location.state.fullData.tid, state: { 'item': this.props.location.state.fullData, level: 1, } }}>{this.props.location.state.fullData ? this.props.location.state.fullData.name : ''}</Link></div>

                        <div className="plp_margin">/</div>
                        <div className="bread_crum_red" >{this.props.location.state.fullData && this.props.location.state.item ? this.props.location.state.item.name : ''}</div>
                    </div>
                )
            }
            else if (this.props.location.state.level === 3) {
                console.log(this.props.location.state.level, this.props.location.state)
                return (
                    <div className="plp_nav_bar">
                        <div><Link to="/">Home</Link></div>
                        <div className="plp_margin">/</div>
                        <div><Link to={{ pathname: '/listing', search: '?categoryId=' + this.props.location.state.fullData.tid, state: { 'item': this.props.location.state.fullData, level: 1, } }}>{this.props.location.state.fullData.name}</Link></div>

                        <div className="plp_margin">/</div>
                        <div><Link to={{ pathname: '/listing', search: '?categoryId=' + this.props.location.state.secondLevelData.tid, state: { 'item': this.props.location.state.secondLevelData, level: 2, fullData: this.props.location.state.fullData } }}>{this.props.location.state.secondLevelData.name}</Link></div>


                        <div className="plp_margin">/</div>
                        <div className="bread_crum_red">{this.props.location.state.item.name}</div>
                    </div>
                )
            }

        }

    }

    setrevChange(){
        alert('change')
        this.setState({
            revchange: undefined
        })
        this.setState({
            revchange: true
        }) 
        this.refreshItems();
    
    }

    render() {
        return (
            <main style={{ maxHeight: this.state.overflowState === '0' ? 'auto' : '100vh' }}>

                <div>
                    <Header change={this.state.change} revChange={() => this.setrevChange()}  location_header={(data) => { this.setState({ overflowState: undefined }), setTimeout(() => { this.setState({ overflowState: data }) }, 100) }} />
                </div>
                {this.state.search ? this.state.search === true ? (
                    ''
                ) : (
                       '' ):''}
               
                <div className="plp_container">
                    {this.state.search ? this.state.search === true ? (
                        ''
                    ) : (
                            <div className="col-md-3 hidden-xs">

                                <Sidebar menuItems={this.state.menuItems} category_name={this.state.category_name} brandItems={this.state.brand_Items ? this.state.brand_Items : ''} dataId={(id, index) => this.filterData(id, index)} brandData={(id) => this.brandfilter(id)} />
                            </div>
                        ) : (
                            <div className="col-md-3 hidden-sm">

                                <Sidebar menuItems={this.state.menuItems} category_name={this.state.category_name} brandItems={this.state.brand_Items ? this.state.brand_Items : ''} dataId={(id, index) => this.filterData(id, index)} brandData={(id) => this.brandfilter(id)} />
                            </div>
                        )}


                    <div className={this.state.search ? this.state.search === true ? "col-md-12 col-sm-12" : "col-md-9 col-sm-12" : "col-md-9 col-sm-12"}>
                        <div className="plp_sort_wrpr">
                            <div className="plp_header">{this.state.category_name}</div>
                            <div>
                                Sort By <select onChange={(e) => this.sortData(e.target.value)}>
                                    <option value="asc">Price - Low to High</option>
                                    <option value="desc">Price - High to Low</option>
                                </select>
                            </div>
                        </div>

                        <Row>
                            {this.state.listItems ? this.state.listItems.map((item, index) => {

                                return (
                                    <CardComponent item={item} index={index} key={index} change={() => this.setChange()} type={this.state.deal_type ? 'deals' : undefined} productDeals={this.state.deal_type ? item : ''} plp="1212" rev_change={this.state.revchange} />
                                )
                            }) : ""
                            }

                        </Row>
                        <div style={{display:'flex'}}>
                        <div style={{ display: this.state.activePage == 0 ? 'none' : '' }} className="pag_arrow prev" onClick={() => this.paginate('prev')}>‹‹</div>
                        <div>Page {this.state.activePage + 1}</div>
                        
                        <div onClick={() => this.paginate('next')} style={{ display: this.state.listItems ? this.state.listItems.length < 12 ? 'none' : '' : 'none', }} className="pag_arrow next">››</div>
                        </div>
                    </div>
                </div>
                <FooterComponent />
            </main>
        );
    }
}
const deal_cards = {
    width: '100%'
};
export default ProductList;