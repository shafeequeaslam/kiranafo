import React, { Component } from 'react';
import facebook from '../../images/facebook.jpg';
import twitter from '../../images/twitter.jpg';
import instagram from '../../images/instagram.jpg';
import youtube from '../../images/youtube.jpg';
import { Col } from 'reactstrap';

class ConnectWithUs extends Component {
    render() {
        return (
            <Col xs="6" sm="6" md="3">
                <h2>Connect with Us</h2>
                <ul className="footer-social-media-buttons">
                    <li><a href="https://www.facebook.com/kirana11com" target="_blank" rel="noopener noreferrer"><img src={facebook} alt="facebook" /></a></li>
                    <li><a href="https://twitter.com/kirana11com" target="_blank" rel="noopener noreferrer"><img src={twitter} alt="twitter" /></a></li>
                    <li><a href="https://www.instagram.com/kirana11com" target="_blank" rel="noopener noreferrer"><img src={instagram} alt="instagram" /></a></li>
                    <li><a href="https://www.youtube.com/channel/UCnNEdu8NliSnkYHtJXXWoaw" target="_blank" rel="noopener noreferrer"><img src={youtube} alt="youtube icon" /></a></li>
                </ul>
            </Col>
        );
    }
}

export default ConnectWithUs;