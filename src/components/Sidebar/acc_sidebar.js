import React, { Component } from 'react';
import './acc_sidebar.css'
import { Nav, NavItem, NavLink } from 'reactstrap';

class AccSidebar extends Component {
      constructor(props) {
            super(props);
            this.state = { 
                  active:this.props.activeType
             };
      }
      render() {
            return (
                  <div style={{ border: '1px solid #dedede' }}>
                  <div className="acc_header">
                  Account Settings
                  </div>
                  <Nav vertical className="sidebarList">
                            <NavItem>
                                <NavLink href={this.state.active === 0? '#':'/myorders'} active={this.state.active === 0 }>My Orders</NavLink>
                            </NavItem>
                            <NavItem >
                                <NavLink href={this.state.active === 2? '#':'/myAddress'} active={this.state.active === 2 }>Address Book</NavLink>
                            </NavItem>
                            <NavItem >
                                <NavLink href={this.state.active === 3? '#':'/my_rewards'} active={this.state.active === 3 }>My Rewards</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href={this.state.active === 1? '#':'/change_pwd'} active={this.state.active === 1 }>Change Password</NavLink>
                            </NavItem>

                    </Nav>
                  </div> 
            );
      }
}

export default AccSidebar;