import React, { Component } from 'react';
import { Container } from 'reactstrap';

class FooterContent extends Component {
    render() {
        return (
            <Container className="footer-content">
                <h2>Avenue11 - Save Time Save Money</h2>
                <p>Avenue11 is an eGrocery platform that enables avenue store owners to optimise their operations by leveraging the online platform for procurement, inventory management, marketing and sales. By bringing local avenue stores to the online space, Avenue11 aims to provide shoppers with a better shopping experience. </p>

                <h2>All your daily essentials in one place </h2>
                <p>Avenue11 offers a wide range of products from across categories like fruits and vegetables, grocery and staples, beverages, packed food, personal care, home and hygiene, and more. Avenue11 is a one-stop shop for all grocery and daily needs.</p>

                <h2>Amazing Offers Great Savings </h2>
                <p>Avenue11 offers great discounts and deals that enable shoppers to maximize their savings on grocery shopping.</p>
                <h2>Best Shopping Experience </h2>
                <p>Avenue11 believes in achieving customer delight by offering shoppers the best shopping experience and customer service.</p>
            </Container>
        );
    }
}

export default FooterContent;