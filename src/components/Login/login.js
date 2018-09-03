import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import './login.css';
import FooterComponent from '../Footer/footer';
// import { Link } from 'react-router-dom';
import LoginForm from '../loginForm/loginForm';
import SignUpForm from '../loginForm/signUpForm';
import kiranalogo from './Kirana logo.png';
import fb from '../../assets/FB.png';
import insta from '../../assets/Insta.png';
import twitter from '../../assets/Twitter.png';
import yt from '../../assets/YT.png';

class LoginComponent extends Component {
    constructor(props) {
        super(props);
        let url = window.location.href;
        let url_string = url;
        let urlStr = new URL(url_string);
        let type = urlStr.searchParams.get("_");

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: type!=null? type.toString() : '1',
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
    componentWillMount() {
        
        
    }
    render() {
        // if(this.state.isLoggedIn){
        //     return(
        //         <Redirect to="/home" />
        //     )
        // }
        return (
            <div className="login_container">
                <div className="login_wrpr">
                    <div style={{ width: '60%', margin: '0 auto' }}>
                        <div className="headerLogin">
                        <div style={{ display:'flex',height:50}}><img style={{margin:'auto'}} height="100%" src={kiranalogo} onClick={()=>{window.location.href = '/'}}></img></div>
                        </div>
                        <div className="red_line"></div>
                        <div style={{ border: '1px solid #d4d4d4', padding: '10px 5px' }}>

                            <Nav>
                                <NavItem style={{ width: '49%' }}>
                                    <NavLink style={{ textAlign: 'center' }}
                                        active={this.state.activeTab === '1'}
                                        className="login"
                                        onClick={() => { this.toggle('1'); }}>
                                        Login
                                <div style={{ height: 2, backgroundColor: "#fff", width: '100%', marginTop: 2 }}></div>
                                    </NavLink>
                                </NavItem>
                                <NavItem style={{ width: '49%', marginLeft: '1%' }}>
                                    <NavLink style={{ textAlign: 'center' }}
                                        className={classnames(["login", { active: this.state.activeTab === '2' }])}
                                        onClick={() => { this.toggle('2'); }}
                                    >
                                        Signup
                                <div style={{ height: 2, backgroundColor: "#fff", width: '100%', marginTop: 2 }}></div>
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={this.state.activeTab}>
                                <TabPane tabId="1">
                                  <LoginForm/>
                                </TabPane>
                                <TabPane tabId="2">
                                   <SignUpForm/>
                                </TabPane>
                            </TabContent>
                        </div>


                    </div>
                </div>
                {/* <div className="terms_condn">By signing up you agree to our <p>Terms and Conditions</p></div> */}
                <div className="social_wrpr">
                <div><img src={yt}></img></div>
                <div><img src={twitter}></img></div>
                <div><img src={insta}></img></div>
                <div><img src={fb}></img></div>
                </div>
                <FooterComponent/>

            </div>
        );
    }
}



export default LoginComponent;