import React, { Component } from 'react';
import '../HomePage/home.css';
import './plp.css'
import { Col, Row } from 'reactstrap'
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
            activeButton:[]
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
        if(search!=null){
            let searchq = search.toLowerCase();
            let query =
            {
                "query": {
                    "bool": {
                        "must": [
                            { "prefix": { "title": { "value": searchq } } }
                        ]
                    }
                },
                "sort": [
                    { "category_weight": { "order": "asc" } }
                ],
                "from": 0,
                "size": 12
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
                    console.log(data,'data');
                    
                        // for(let i=0;i<listingDetails.length;i++){
                        //     activeBtn[i]=0; 
                        //  }
                        //  this.setState({
                        //      listItems: listingDetails,
                        //      activeButton:activeBtn
                        //  })
                    
                   
                    // })
                    // this.setState({
                    //     searchResults: data.data.hits.hits
                    // })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        else if (category_id != null){
            this.setState({
                productId: category_id
            });
            this.loadProductDetails(category_id);
        }
       
       

        let val =localStorage.getItem('cartObj')
        if(val!=null){
            cartObj = JSON.parse(val);
        }
        else
            cartObj=undefined
        
    }
    // componentDidMount() {
    //     console.log(this.props)
    // }
    componentWillReceiveProps(nextProps, prevState) {
        let url = window.location.href;
        let url_string = url;
        let urlStr = new URL(url_string);
        let category_id = urlStr.searchParams.get("categoryId");
        let search = urlStr.searchParams.get("search");
        if(search!=null){
            let searchq = search.toLowerCase();
            let query =
            {
                "query": {
                    "bool": {
                        "must": [
                            { "prefix": { "title": { "value": searchq } } }
                        ]
                    }
                },
                "sort": [
                    { "category_weight": { "order": "asc" } }
                ],
                "from": 0,
                "size": 12
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
                    console.log(data,'data');
                    
                        // for(let i=0;i<listingDetails.length;i++){
                        //     activeBtn[i]=0; 
                        //  }
                        //  this.setState({
                        //      listItems: listingDetails,
                        //      activeButton:activeBtn
                        //  })
                    
                   
                    // })
                    // this.setState({
                    //     searchResults: data.data.hits.hits
                    // })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        else if (category_id != null){
            this.setState({
                productId: category_id
            });
            this.loadProductDetails(category_id);
        }
       
           
        
    }

    loadProductDetails = (data) => {
        // console.log("Category Listing", LISTING_BY_ID_CATEGORY + this.props.location.state.item.tid);
        let id;
        if (!data) {
            id = this.props.location.state.item.tid;
        }
        else id = data;
        console.log(id)
        fetch(LISTING_BY_ID_CATEGORY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "parent_cat": id,
                "sort": "asc",
                "mode": "min",
                "from": 0,
                "size": 12
            })
        })
            .then(res => res.json())
            .then((listingDetails) => {
                this.setState({
                    listItems: undefined,
                })
                console.log(listingDetails,"121")
                let activeBtn=[]
                
                for(let i=0;i<listingDetails.length;i++){
                   activeBtn[i]=0; 
                }
                console.log(listingDetails,"121212")
                this.setState({
                    listItems: listingDetails,
                    activeButton:activeBtn
                })
            }, (error) => {
                console.error(error)
            });
    }
    storeCart(type, prIndex, i) {
        console.log(i, prIndex, this.state.listItems[prIndex].inner_hits.products.hits.hits[this.state.activeButton[prIndex]]._source)
        if (cartObj) {
            console.log(this.state.listItems)
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
        console.log(cartObj)
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

    render() {
        return (
            <main>
                <div>
                    <Header change={this.state.change}/>
                </div>
                <div style={{ display: 'flex', width: '90%', margin: '50px auto' }}>
                    <div className="col-sm-3" style={{ padding: 0 }}>
                        <Sidebar menuItems={this.props.location.state?this.props.location.state.item.sub_category_tree:''} category_name={this.props.location.state?this.props.location.state.item.name:''} />
                    </div>

                    <div className="col-sm-9">
                        <Row>
                            {this.state.listItems ? this.state.listItems.map((item, index) => {
                                return (
                                   <CardComponent item={item} index={index} key={index}  change={() => this.setChange()}/>
                                )
                            }) : ""
                            }

                        </Row>
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