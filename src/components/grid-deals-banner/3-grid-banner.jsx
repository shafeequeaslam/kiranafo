import React, { Component } from 'react';
import { Container, Col, Row } from 'reactstrap';

class ThreeGridBanner extends Component {
    render() {
        let bannerData = this.props.bannerData;
        return (
            <Container className="deals-banner-display">
                <Row>
                    <Col xs="12" sm="12">
                        <img src={bannerData[0]._source.banners.web_banner_path} alt="Deals banner" />
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="6">
                        <img src={bannerData[1]._source.banners.web_banner_path} alt="Deals banner" />
                    </Col>
                    <Col xs="12" sm="6">
                        <img src={bannerData[2]._source.banners.web_banner_path} alt="Deals banner" />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default ThreeGridBanner;