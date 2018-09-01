import React, { Component } from 'react';
import HomePage from './containers/HomePage/home';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProductList from './containers/PLP/plp';
import ProductDescription from './containers/PDP/pdp';
import CartList from './containers/Cart/cart';
import LoginComponent from './components/Login/login';
import CheckoutContainer from './containers/Checkout/checkout';
import ThankYouComponent from './components/thank_you/thank_you';
import { Provider } from 'react-redux';
import store from './store';
import Forgetpwd from './components/forgetpwd/forgetpwd';
import Otp from './components/otpcomponent/otp';
import ChangePassword from './components/changepassword/changepsw';
import ShakeShake from './components/shakeshake/shakeshake';
import MyAddress from './components/myAddress/myAddress';
import Order_Status from './components/order_status';
import MyOrders from './components/myorders/myorders';
import AboutUs from './components/footer-components/AboutUs';
import Privacy from './components/footer-components/Privacy';
import Terms from './components/footer-components/Terms';
import Refund from './components/footer-components/Refund';
import ServiceArea from './components/footer-components/ServiceArea';
import shakepage from './components/shake_main/shakepage';
import Faq from './components/footer-components/Faq/Faq';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      auth: true
    }
  }
  render() {
    return (
      <Provider store={store}>
      <Router>
        <div>
          <Route path="/login" component={LoginComponent} exact />
          <Route path="/checkout" component={CheckoutContainer} exact />
          <Route path="/cart" component={CartList}/>
          <Route path="/" component={HomePage} exact/>
          <Route path="/home" component={HomePage} exact/>
          <Route path="/listing" component={ProductList} />
          <Route path="/product_desc" component={ProductDescription}/>
          <Route path="/thanks" component={ThankYouComponent}/>
          <Route path="/forgot_pwd" component={Otp}/>
          <Route path="/reset_pwd" component={Forgetpwd}/>
          <Route path="/change_pwd" component={ChangePassword}/>
          <Route path="/my_rewards" component={ShakeShake}/>
          <Route path="/myAddress" component={MyAddress}/>
          <Route path="/order-payment" component={Order_Status}/>
          <Route path="/myorders" component={MyOrders}/>
          <Route path="/shakePage" component={shakepage}/>
          <Route path="/about_us" component={AboutUs}/>
          <Route path="/privacy_policy" component={Privacy}/>
          <Route path="/our_terms_and_conditions" component={Terms}/>
          <Route path="/refund_return_policies" component={Refund}/>
          <Route path="/service_areas" component={ServiceArea}/>
          <Route path="/faqs" component={Faq}/>
          
          
          {/* <Route path="/deals_listing" component={ProductList} />
          <Route path="/deals_product_desc" component={ProductDescription}/> */}
        </div>
      </Router>
      </Provider>

    );
  }
}

export default App;