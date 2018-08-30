import React, { Component } from 'react';
import './acc_sidebar.css'
import { Nav, NavItem, NavLink } from 'reactstrap';

class AccSidebar_Footer extends Component {
      constructor(props) {
            super(props);
            this.state = { 
                  active:this.props.activeType
             };
      }
      render() {
            return (
                  <div style={{border:'1px solid #d4d4d4'}}>
                  <div className="redBar"></div>
                  <Nav vertical className="sidebarList">
                            <NavItem>
                                <NavLink href={this.state.active === 0? '#':'/about_us'} active={this.state.active === 0 }>About Us</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href={this.state.active === 1? '#':'/privacy_policy'} active={this.state.active === 1 }>Privacy Policy</NavLink>
                            </NavItem>
                            <NavItem >
                                <NavLink href={this.state.active === 2? '#':'/our_terms_and_conditions'} active={this.state.active === 2 }>Terms and Conditions</NavLink>
                            </NavItem>
                            <NavItem >
                                <NavLink href={this.state.active === 3? '#':'/refund_return_policies'} active={this.state.active === 3 }>Refund & Return Policies</NavLink>
                            </NavItem>
                            <NavItem >
                                <NavLink href={this.state.active === 4? '#':'/service_areas'} active={this.state.active === 4 }>Service Areas</NavLink>
                            </NavItem>
                            <NavItem >
                                <NavLink href={this.state.active === 5? '#':'/faqs'} active={this.state.active === 5 }>FAQs</NavLink>
                            </NavItem>

                    </Nav>
                  </div> 
            );
      }
}

export default AccSidebar_Footer;