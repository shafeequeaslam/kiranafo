import React, { Component } from 'react';
import Axios from 'axios';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import './shakeshake.css';
// import { Link } from 'react-router-dom';
import Coupon from './Coupon';
import Gifts from './Gifts';
import './couponactive.css';
import './couponexpired.css';
import './couponused.css';
import './shakeshake.css';
import Header from '../Header/header';
import AccSidebar from '../Sidebar/acc_sidebar';


class shakeshake extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1',
            OtpBtnActive: false,
            isLoggedIn: true
        };
        this.changeBtnColor = this.changeBtnColor.bind(this);
    }
    changeBtnColor() {
        this.setState({
            OtpBtnActive: true
        })
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    render() {

        return (
            <main>
                <div>
                    <Header />
                </div>
                <div style={{ display: 'flex', width: '90%', margin: '50px auto' }}>
                    <div className="col-sm-3" style={{ padding: 0 }}>
                        <AccSidebar activeType={3} />
                    </div>

                    <div className="col-sm-9" style={{ maxHeight: 500 }}>
                        <div style={{ width: '100%', margin: '0 auto' }}>
                            <div style={{ width: '100%', display: 'flex', fontSize: 24, color: '#999' }}>
                                My rewards
                      </div>

                            <Nav>
                                <NavItem style={{ width: 175, marginBottom: 5 }}>
                                    <NavLink style={{ textAlign: 'center' }}
                                        active={this.state.activeTab === '1'}
                                        className="login"
                                        onClick={() => { this.toggle('1'); }}>
                                        Coupon
                                    </NavLink>
                                </NavItem>
                                <NavItem style={{ width: 175, marginLeft: 5, marginBottom: 5 }}>
                                    <NavLink style={{ textAlign: 'center' }}
                                        className={classnames(["login", { active: this.state.activeTab === '2' }])}
                                        onClick={() => { this.toggle('2'); }}
                                    >
                                        Gifts
                                    </NavLink>
                                </NavItem>

                            </Nav>
                            <div style={{ border: '1px solid #d4d4d4', padding: '10px 10px' }}>

                                <TabContent activeTab={this.state.activeTab}>
                                    <TabPane tabId="1">
                                        <Coupon />
                                    </TabPane>
                                    <TabPane tabId="2">
                                        <Gifts />
                                    </TabPane>
                                </TabContent>
                            </div>


                        </div>
                    </div>
                </div>
                
        </main >
                );
    }
}

export default shakeshake;


