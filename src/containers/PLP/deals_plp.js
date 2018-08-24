import React, { Component } from 'react';
import '../HomePage/home.css';
import './plp.css'
import { Col, Row } from 'reactstrap'
import Sidebar from '../../components/Sidebar/sidebar';

import Header from '../../components/Header/header';
import { LISTING_BY_ID_CATEGORY } from '../../utis/API';
import LinesEllipsis from 'react-lines-ellipsis';
import CardComponent from '../../components/card';

let cartObj = undefined;

class DealsProductList extends Component {
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
        console.log(this.props)
        this.setState({
            productId: this.props.location.state.item.tid
        });
        this.loadProductDetails();

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
        if (nextProps.location.search !== prevState.search) {
            const search = nextProps.location.search;
            console.log('here')
            this.loadProductDetails(nextProps.location.state.item.tid);
            //    const result = productlist.products.filter(obj => {

            //      return obj.id === currentProductId;

            //    })
            return {
                search: search

            }
        }
    }

    loadProductDetails = (data) => {
        console.log("Category Listing", LISTING_BY_ID_CATEGORY + this.props.location.state.item.tid);
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
                "size": 20
            })
        })
            .then(res => res.json())
            .then((listingDetails) => {
                console.log(listingDetails)
                let activeBtn=[]
                
                for(let i=0;i<listingDetails.length;i++){
                   activeBtn[i]=0; 
                }
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

    render() {
        return (
            <main>
                <div>
                    <Header change={this.state.change}/>
                </div>
                <div style={{ backgroundImage: 'url("https://img1.kirana11.com/files/public/categoryfruits-vegetables-fed-14.jpg?ETlDb15Go2_HfTGERE41L1CGWtSTHxHg")' }} className="heroContainer">
                </div>
                <div style={{ display: 'flex', width: '90%', margin: '50px auto' }}>
                    <div className="col-sm-3" style={{ padding: 0 }}>
                        <Sidebar menuItems={this.props.location.state.item.sub_category_tree} category_name={this.props.location.state.item.name} />
                    </div>

                    <div className="col-sm-9">
                        <Row>
                            {this.state.listItems ? this.state.listItems.map((item, index) => {
                                return (
                                   <CardComponent item={item} index={index} key={index}/>
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
export default DealsProductList;