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
          {/* <Route path="/deals_listing" component={ProductList} />
          <Route path="/deals_product_desc" component={ProductDescription}/> */}
        </div>
      </Router>
      </Provider>

    );
  }
}

export default App;