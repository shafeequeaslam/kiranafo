import React, { Component } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { Col } from 'reactstrap';
import { Link } from 'react-router-dom';

// library.add(faPhone)

class Help extends Component {
    render() {
        return (
            <Col xs="6" sm="4" md="2">
                <h2>Help</h2>
                <ul>
                    <li><Link to="/faqs">FAQs</Link></li>
                    <li><Link to="/contact-us">Contact Us</Link></li>
                    <li>
                        {/* <FontAwesomeIcon  icon='phone' transform={{ rotate: 90 }} /> */}
                        <a> 934 123 0110</a></li>
                    <li><a>1800 123 0110</a></li>
                </ul>
            </Col>
        );
    }
}

export default Help;