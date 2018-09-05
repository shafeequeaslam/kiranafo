import React, { Component } from 'react';
import './footer.css'
class FooterComponent extends Component {
    state = {}
    render() {
        return (
            <div>
                <div className="footer_wrpr">
                    <div className="footer_deals">
                        <div className="footer_icon savings_g"></div>
                        <div className="footer_text">Savings Guranteed</div>
                    </div>
                    <div className="footer_deals">
                        <div className="footer_icon quality_g"></div>
                        <div className="footer_text">Quality Guranteed</div>
                    </div>
                    <div className="footer_deals">
                        <div className="footer_icon delivery_g"></div>
                        <div className="footer_text">Quick Delivery Guranteed</div>
                    </div>
                    <div className="footer_deals">
                        <div className="footer_icon easy_ref"></div>
                        <div className="footer_text">EASY Return/Refund</div>
                    </div>
                </div>
                <div style={{ display: this.props.listreq == true ? '' : 'none' }}>
                    <div className="footer_links_wrpr">
                        <div className="footer_links_right">
                            <div className="footer_link_bold">Kirana11.com</div>
                            <div className="footer_link">About Us</div>
                            <div className="footer_link">Blog</div>
                            <div className="footer_link">Privacy Policy</div>
                            <div className="footer_link">Partner with Us</div>
                            <div className="footer_link">Terms and Conditions</div>
                            <div className="footer_link">Refund and Return Policies</div>
                            <div className="footer_link">Service Areas</div>
                        </div>
                        <div className="footer_links_left">
                            <div className="footer_col-1">
                                <div className="footer_link_bold">Payment Options</div>
                                <div className="footer_link">About Us</div>
                                <div className="footer_link">Blog</div>
                                <div className="footer_link">Privacy Policy</div>
                            </div>
                            <div className="footer_col-1">
                                <div className="footer_link_bold">Help</div>
                                <div className="footer_link">FAQs</div>
                                <div className="footer_link">Contact Us</div>
                                <div className="footer_link"> 988 999 9999</div>
                                <div className="footer_link"> 1800 123 0110</div>
                            </div>
                            <div className="footer_col-2">
                                <div className="footer_link_bold">Connect with Us</div>
                                <div className="footer_link">About Us</div>
                                <div className="footer_link">Blog</div>
                                <div className="footer_link">Privacy Policy</div>
                            </div>
                            <div className="footer_col-2">
                                <div className="footer_link_bold">Subscribe to Newsletter</div>
                                <div className="footer_link">About Us</div>
                                <div className="footer_link">Blog</div>
                                <div className="footer_link">Privacy Policy</div>
                            </div>
                        </div>
                    </div>
                    <div className="footer_link_desc_wrpr">
                        <div className="footer_link_desc">
                            <div className="footer_link_bold">It is a long established fact that a reader will be distracted</div>
                            <div className="footer_link">The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. </div>
                        </div>
                        <div className="footer_link_desc">
                            <div className="footer_link_bold">It is a long established fact that a reader will be distracted</div>
                            <div className="footer_link">The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. </div>
                        </div>
                        <div className="footer_link_desc">
                            <div className="footer_link_bold">It is a long established fact that a reader will be distracted</div>
                            <div className="footer_link">The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. </div>
                        </div>
                        <div className="footer_link_desc">
                            <div className="footer_link_bold">It is a long established fact that a reader will be distracted</div>
                            <div className="footer_link">The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. </div>
                        </div>
                    </div>
                </div>
                <div className="footer_copyrights">©2018 Avenue11. All Rights Reserved </div>

            </div>
        );
    }
}

export default FooterComponent;