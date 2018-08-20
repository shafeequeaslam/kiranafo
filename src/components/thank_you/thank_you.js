import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './thank_you.css'
import Header from '../Header/header';
import kiranalogo from '../../assets/Kirana logo.png';
import liner from '../../assets/Line R.png';
import linel from '../../assets/Line F.png';


class ThankYouComponent extends Component {
    state = {}
    render() {
        return (
            <div>
                <Header />
                <div className="thank_u_container">
                    <div className="tq_logo"><div style={{ display:'flex'}}><img style={{margin:'auto'}} src={kiranalogo}></img></div></div>
                    <div className="tq_bold_text">THANK YOU FOR SHOPPING</div>
                    <div className="tq_underline"></div>
                    <div className="tq_order_status">Your order number is <p>77777</p></div>
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