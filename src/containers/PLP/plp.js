import React, { Component } from 'react';
import '../HomePage/home.css';
import './plp.css'
import { Col, Row } from 'reactstrap'
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/sidebar';

import Header from '../../components/Header/header';
import { LISTING_BY_ID_CATEGORY } from '../../utis/API';
import LinesEllipsis from 'react-lines-ellipsis';
import CardComponent from '../../components/card';
import Axios from 'axios';

let cartObj = undefined;

class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listItems: undefined,
            product_quantity: undefined,
            activeButton: [],
            activePage: 0
        };
        this.loadProductDetails = this.loadProductDetails.bind(this)
    }
    componentWillMount() {
        //console.log(this.props);
        let url = window.location.href;
        let url_string = url;
        let urlStr = new URL(url_string);
        let category_id = urlStr.searchParams.get("categoryId");
        let search = urlStr.searchParams.get("search");
        if (search != null) {
            this.setState({
                search: true
            })
            let searchq = search.toLowerCase();

            Axios({
                method: 'GET',
                header: {
                    'Content-type': 'application/json',
                },
                url: 'http://dev-esexpress.kirana11.com/v2/search?q=' + searchq + '&sort=asc&mode=min&from=0&size=12',
                // data: query

            })
                // .then(res => res)
                .then((data) => {
                    //console.log(data.data,'data');


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
        let url = window.location.href;
        let url_string = url;
        let urlStr = new URL(url_string);
        let category_id = urlStr.searchParams.get("categoryId");
        let search = urlStr.searchParams.get("search");
        this.setState({
            activePage: 0
        })
        setTimeout(() => {
            if (search != null) {
                this.setState({
                    search: true
                })
                let searchq = search.toLowerCase();

                Axios({
                    method: 'GET',
                    header: {
                        'Content-type': 'application/json',
                    },
                    url: 'http://dev-esexpress.kirana11.com/v2/search?q=' + searchq + '&sort=asc&mode=min&from=0&size=16',
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
                    productId: category_id
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
            url: 'http://dev-esexpress.kirana11.com/' + url,
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
                console.log(err.response())
            })
    }

    refreshBrandItems(id,level) {
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
            url: 'http://dev-esexpress.kirana11.com/' + url,
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
                console.log(err.response())
            })
    }
    loadProductDetails = (data) => {
        // //console.log("Category Listing", LISTING_BY_ID_CATEGORY + this.props.location.state.item.tid);
        let id;
        let type;
        let data_type;
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
                "sort": "asc",
                "mode": "min",
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
                }, 100)
            }, (error) => {
                console.error(error)
            });
        this.getBrandItems();
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

    filterData(id) {
        console.log(id)
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
            brand = [search_id];
            if(this.state.updatedId){
                id= this.state.updatedId
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
            if (search_id.variant_category_tree) {
                level = 2;
                this.setState({
                    updatedLevel: 2,updatedId:id
                })
               
            }
            else {
                level = 3;
                this.setState({
                    updatedLevel: 3,
                    updatedId:id
                })
            }
            this.refreshBrandItems(search_id.tid,level);
            this.renderBreadCrumbs(level);
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
                [data_type]: id,
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
                console.error(error.response)
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
            if (search != null) {
                this.setState({
                    search: true
                })
                let searchq = search.toLowerCase();
                let from = this.state.activePage * 12;

                Axios({
                    method: 'GET',
                    header: {
                        'Content-type': 'application/json',
                    },
                    url: 'http://dev-esexpress.kirana11.com/v2/search?q=' + searchq + '&sort=asc&mode=min&from=' + from + '&size=12',
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

        }, 100)


        let val = localStorage.getItem('cartObj')
        if (val != null) {
            cartObj = JSON.parse(val);
        }
        else
            cartObj = undefined

    }

    renderBreadCrumbs(level){
        if(level){
            if(level === 1){
                return(
                    <div style={{ display: 'flex', flexDirection: 'row', padding: '5', margin: '25px 0 0 10%' }}>
                                        <div><Link to="/">Home</Link></div>
                                        <div style={{ margin: '0 5px' }}>/</div>
                                        <div className="bread_crum_red"> {this.props.location.state.fullData.name}</div>
                                    </div> 
                    )
            }
            else if(level === 2){
                <div style={{ display: 'flex', flexDirection: 'row', padding: '5', margin: '25px 0 0 10%' }}>
                <div><Link to="/">Home</Link></div>
                <div style={{ margin: '0 5px' }}>/</div>
                <div><Link className="bread_crum_red"  to={{ pathname: '/listing', search: '?categoryId=' + this.props.location.state.fullData.tid, state: { 'item': this.props.location.state.fullData,level:1,} }}>{this.props.location.state.fullData?this.props.location.state.fullData.name:''}</Link></div>

                <div style={{ margin: '0 5px' }}>/</div>
                <div className="bread_crum_red" >{this.props.location.state.fullData && this.props.location.state.item?this.props.location.state.item.name :''}</div>
            </div> 
            }
            else if(level === 3){
                <div style={{ display: 'flex', flexDirection: 'row', padding: '5', margin: '25px 0 0 10%' }}>
                <div><Link to="/">Home</Link></div>
                <div style={{ margin: '0 5px' }}>/</div>
                <div><Link to={{ pathname: '/listing', search: '?categoryId=' + this.props.location.state.fullData.tid, state: { 'item': this.props.location.state.fullData,level:1,} }}>{this.props.location.state.fullData.name}</Link></div>

                <div style={{ margin: '0 5px' }}>/</div>
                <div><Link  to={{ pathname: '/listing', search: '?categoryId=' + this.props.location.state.secondLevelData.tid, state: { 'item': this.props.location.state.secondLevelData,level:2,fullData:this.props.location.state.fullData} }}>{this.props.location.state.secondLevelData.name}</Link></div>


                <div style={{ margin: '0 5px' }}>/</div>
                <div className="bread_crum_red">{this.props.location.state.item.name}</div>
            </div> 
            }
        }
        else{
            if(this.props.location.state.level === 1){
                return(
                    <div style={{ display: 'flex', flexDirection: 'row', padding: '5', margin: '25px 0 0 10%' }}>
                                        <div><Link to="/">Home</Link></div>
                                        <div style={{ margin: '0 5px' }}>/</div>
                                        <div className="bread_crum_red"> {this.props.location.state.item.name}</div>
                                    </div> 
                    )
            }
            else if(this.props.location.state.level === 2){
                return(
                    <div style={{ display: 'flex', flexDirection: 'row', padding: '5', margin: '25px 0 0 10%' }}>
                                        <div><Link to="/">Home</Link></div>
                                        <div style={{ margin: '0 5px' }}>/</div>
                                        <div><Link className="bread_crum_red"  to={{ pathname: '/listing', search: '?categoryId=' + this.props.location.state.fullData.tid, state: { 'item': this.props.location.state.fullData,level:1,} }}>{this.props.location.state.fullData?this.props.location.state.fullData.name:''}</Link></div>

                                        <div style={{ margin: '0 5px' }}>/</div>
                                        <div className="bread_crum_red" >{this.props.location.state.fullData && this.props.location.state.item?this.props.location.state.item.name :''}</div>
                                    </div> 
                    )
            }
            else if(this.props.location.state.level === 3){
                console.log(this.props.location.state.level,this.props.location.state)
                return(
                    <div style={{ display: 'flex', flexDirection: 'row', padding: '5', margin: '25px 0 0 10%' }}>
                                        <div><Link to="/">Home</Link></div>
                                        <div style={{ margin: '0 5px' }}>/</div>
                                        <div><Link to={{ pathname: '/listing', search: '?categoryId=' + this.props.location.state.fullData.tid, state: { 'item': this.props.location.state.fullData,level:1,} }}>{this.props.location.state.fullData.name}</Link></div>

                                        <div style={{ margin: '0 5px' }}>/</div>
                                        <div><Link  to={{ pathname: '/listing', search: '?categoryId=' + this.props.location.state.secondLevelData.tid, state: { 'item': this.props.location.state.secondLevelData,level:2,fullData:this.props.location.state.fullData} }}>{this.props.location.state.secondLevelData.name}</Link></div>


                                        <div style={{ margin: '0 5px' }}>/</div>
                                        <div className="bread_crum_red">{this.props.location.state.item.name}</div>
                                    </div> 
                    )
            }

        }
       
    }

    render() {
        return (
            <main>

                <div>
                    <Header change={this.state.change} />
                </div>
                {this.renderBreadCrumbs()}
                {/* <div style={{ display: 'flex', flexDirection: 'row', padding: '5', margin: '25px 0 0 10%' }}>
                            <div><Link to="/">Home</Link></div>
                            <div style={{ margin: '0 5px' }}>/</div>
                            <div><Link className="bread_crum_red" to="#">{this.props.location.state.item ? this.props.location.state.item.sub_category_tree?this.props.location.state.item.sub_category_tree[0].name:'':''}</Link></div>
                            <div><Link className="bread_crum_red" to="#">{this.props.location.state.item && this.props.location.state.item.sub_category_tree &&this.props.location.state.item.sub_category_tree.variant_category_tree  ? this.props.location.state.item.sub_category_tree.variant_category_tree[0].name : ''}</Link></div>

                        </div> */}
                {/* menuItems={this.props.location.state ? this.props.location.state.item.sub_category_tree[0] ? this.props.location.state.item.sub_category_tree : this.props.location.state.item.variant_category_tree[0] : ''} category_name={this.props.location.state ? this.props.location.state.item.name : ''} */}
                <div style={{ display: 'flex', width: '90%', margin: '50px auto' }}>
                    {this.state.search ? this.state.search === true ? (
                        ''
                    ) : (
                            <div className="col-sm-3" style={{ padding: 0 }}>

                                <Sidebar menuItems={this.props.location.state ? this.props.location.state.item.sub_category_tree ? this.props.location.state.item.sub_category_tree : this.props.location.state.item.variant_category_tree : ''} category_name={this.props.location.state ? this.props.location.state.item.name : ''} brandItems={this.state.brand_Items ? this.state.brand_Items : ''} dataId={(id) => this.filterData(id)} brandData={(id) => this.brandfilter(id)} />
                            </div>
                        ) : (
                            <div className="col-sm-3" style={{ padding: 0 }}>

                                <Sidebar menuItems={this.props.location.state ? this.props.location.state.item.sub_category_tree ? this.props.location.state.item.sub_category_tree : this.props.location.state.item.variant_category_tree : ''} category_name={this.props.location.state ? this.props.location.state.item.name : ''} brandItems={this.state.brand_Items ? this.state.brand_Items : ''} dataId={(id) => this.filterData(id)} brandData={(id) => this.brandfilter(id)} />
                            </div>
                        )}


                    <div className={this.state.search ? this.state.search === true ? "col-sm-12" : "col-sm-9" : "col-sm-9"}>
                        <Row>
                            {this.state.listItems ? this.state.listItems.map((item, index) => {

                                return (
                                    <CardComponent item={item} index={index} key={index} change={() => this.setChange()} />
                                )
                            }) : ""
                            }

                        </Row>
                        <div onClick={() => this.paginate('next')} style={{ display: this.state.listItems ? this.state.listItems.length < 12 ? 'none' : '' : 'none' }}>NEXT</div>
                        <div style={{ display: this.state.activePage == 0 ? 'none' : '' }} onClick={() => this.paginate('prev')}>PREV</div>
                    </div>
                </div>

            </main>
        );
    }
}
const deal_cards = {
    width: '100%'
};
export default ProductList;