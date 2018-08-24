import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './thank_you.css'
import Header from '../Header/header';
import kiranalogo from '../../assets/Kirana logo.png';
import liner from '../../assets/Line R.png';
import linel from '../../assets/Line F.png';


class ThankYouComponent extends Component {
    constructor(props){
        super(props);
        this.state={};
    }
    componentWillMount(){
        let url = window.location.href;
        let url_string = url;
        let urlStr = new URL(url_string);
        let order_id = urlStr.searchParams.get("order_id");
        console.log(order_id)
        this.setState({
            order_id:order_id,
        })
    }
    render() {
        return (
            <div>
                <Header change={this.state.change}/>
                <div className="thank_u_container">
                    <div className="tq_logo"><div style={{ display:'flex'}}><img style={{margin:'auto'}} src={kiranalogo}></img></div></div>
                    <div className="tq_bold_text">THANK YOU FOR SHOPPING</div>
                    <div className="tq_underline"></div>
                    <div className="tq_order_status">Your order number is <p>{this.state.order_id}</p></div>
                    <div className="tq_order_status">You can <Link to="/">view your order</Link> in account page when logged in</div>
                    <div className="tq_order_status red">
                    <div style={{ display:'flex'}}><img style={{margin:'auto'}} src={linel}></img></div>
                    <Link to="/">CONTINUE SHOPPING</Link>
                    <div style={{ display:'flex'}}><img style={{margin:'auto'}} src={liner}></img></div>
                    </div>

                </div>
            </div>
        );
    }
}

export default ThankYouComponent;