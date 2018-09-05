import React, { Component } from 'react';
import { Col } from 'reactstrap';
import { Link } from 'react-router-dom';

class FooterMenu extends Component {
    render() {
        return (
            <Col xs="6" sm="4" md="2" className="footer-menu">
                <h2><a href="/">Avenue11.com</a></h2>
                <ul>
                    <li><Link to="/about_us">About Us</Link></li>
                    <li><Link to="/privacy_policy">Privacy Policy</Link></li>
                    <li><Link to="/our_terms_and_conditions">Terms and Conditions</Link></li>
                    <li><Link to="/refund_return_policies">Refund &amp; Return Policies</Link></li>
                    <li><Link to="/service_areas">Service Areas</Link></li>
                </ul>  
            </Col>
                
        );
    }
}

export default FooterMenu;