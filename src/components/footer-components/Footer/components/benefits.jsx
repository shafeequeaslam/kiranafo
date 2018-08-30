import React, { Component } from 'react';
import saving from '../../images/saving.jpg';
import quality from '../../images/quality.jpg';
import onTimeDelivery from '../../images/quality-delivery.jpg';
import easyReturn from '../../images/easy-return.jpg';
import {Row, Col} from 'reactstrap';

class Benefits extends Component {
    render() {
        return (
                <Row className="benefits">
                    <Col xs="6" sm="6" md="3">
                        <img src={saving} alt="Saving Guaranteed" />
                        <span>Savings <br />Guaranteed</span>
                    </Col>

                    <Col xs="6" sm="6" md="3">
                        <span><img src={quality} alt="Quality Guaranteed" /></span>
                        <span>Quality <br />Guaranteed</span>
                    </Col>

                    <Col xs="6" sm="6" md="3">
                        <span><img src={onTimeDelivery} alt="On-Time Delivery Guaranteed" /></span>
                        <span>On-Time Delivery <br />Guaranteed</span>
                    </Col>

                    <Col xs="6" sm="6" md="3">
                        <span><img src={easyReturn} alt="Easy Return/Refund" /></span>
                        <span>Easy <br />Return/Refund</span>
                    </Col>
                </Row>
        );
    }
}

export default Benefits;