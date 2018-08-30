import React, { Component } from 'react';
import { Col, Input, Button } from 'reactstrap';

class SubscribeNewsletter extends Component {
    render() {
        return (
            <Col xs="12" sm="6" md="3">
                <h2>Subscribe to Newsletter</h2>
                <div className="subscribe">
                    <Input placeholder="Enter your email" type="email"  id="edit-mail" />
                    <Button className="subscribe-button">Subscribe</Button>
                </div>  
            </Col>
        );
    }
}

export default SubscribeNewsletter;