import React, { Component } from 'react';
import './css/footer.css';
import Benefits from '../components/benefits';
import FooterMenu from '../components/footer-menu';
import PaymentOption from '../components/payment-option';
import Help from '../components/help';
import ConnectWithUs from '../components/connect-withus';
import SubscribeNewsletter from '../components/subscribe-newsletter';
import FooterContent from '../components/footer-content';
import CopyRights from '../components/copy-rights';
import {Container, Row} from 'reactstrap';

class FooterComponent extends Component {
    render() {
        return (
            <div>
                <Container>
                    <Benefits />
                    <Row className="footer-list-container">
                        <FooterMenu />
                        <PaymentOption />
                        <Help />
                        <ConnectWithUs />
                        <SubscribeNewsletter />
                    </Row>
                    <Row>
                       <FooterContent />
                       <CopyRights />
                    </Row>
                </Container>
            </div>
        );
    }
}

export default FooterComponent;