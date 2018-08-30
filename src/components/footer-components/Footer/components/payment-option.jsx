import React, { Component } from 'react';
import visa from '../../images/visa-master-card.png';
import payumoney from '../../images/payumoney.jpg';
import cashondelivery from '../../images/cash-on-delivery-icon.png';
import { Col } from 'reactstrap';

class PaymentOption extends Component {
    render() {
        return (
            <Col xs="6" sm="4" md="2">
                <h2>Payment Options</h2>
                <ul className="payment-option-list">
                    <li><img src={visa} alt="Visa master card" /></li>
                    <li><img src={payumoney} alt="payumoney" /></li>
                    <li><img src={cashondelivery} alt="cash on delivery" /></li>
                </ul>
            </Col>
        );
    }
}

export default PaymentOption;