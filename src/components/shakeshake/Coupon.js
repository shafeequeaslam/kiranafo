import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom'
import withRouter from 'react-router/withRouter';
import { Card, CardImg, CardText, CardBody,CardTitle,CardImgOverlay, CardSubtitle, Button } from 'reactstrap';
import activecoupon from './active-coupon.png';
import usedcoupon from './used-coupon.png';
import expiredcoupon from './expired-coupon.png';
import './Coupon.css';

class Coupon extends Component {
  constructor(props) {
    super(props);
    this.state = {

      cardcount:[],
      show:false,
      cexp: false, 
      cact: false,
      cused: false, 
      gexp: false,
      greg: false, 
      gunreg:false
    };
  }

  toggle(id) {
    if(id =="Expired"){
      this.setState(prevState => ({
      cexp:!prevState.cexp,
      show:!prevState.show
    }));
  }

    else if(id =="Active"){

    this.setState(prevState => ({
      cact:!prevState.cact,
      show:!prevState.show
    }));
  }
    else if(id =="Used"){
    this.setState(prevState => ({
      cused:!prevState.cused,
      show:!prevState.show
    }));
  }
}

componentDidMount() {

  let usr=JSON.parse(localStorage.getItem('userDetails'))
                     Axios({
                              method: 'get',
                              url: "http://dev.dms.avenue11.com/api/v2/coupon/user?uid=58847&agent=MOBILE&general=1",
                              headers: {
                                    'Content-Type': 'application/json'
                              },
                              
                        })
                              .then((val) => {
                                    this.setState({
                                          couponData:val.data,
                                          cardcount:[val.data.length]
                                    })
                                    console.log(val.data.length,'hi')
                              })
                              .catch((err) => {
                                    console.log(err);
                              })

    }

    render() {
            return (

                  <div>
                  <div style={{display: this.state.cexp===true? '' : 'none'}}className='couponused_container'>
                     <div onClick={() => this.toggle(this.state.couponData[0].status)} className='cross'>x</div>
                      <div className='couponused_background'>
                        <div><h2>Hey!</h2></div>
                        <div className='couponused_text1'>This coupon is expired</div>
                        <div className='couponused_text2'>Shake your phone now!</div>
                        <div className='button_container'>
                        <button onClick={() => this.toggle(this.state.couponData[0].status)} className="button_red button_width button_square">OK</button></div>
                      </div>
                  </div>
                  <div style={{display: this.state.cact===true? '' : 'none'}}>
                  <div onClick={() => this.toggle(this.state.couponData[0].status)} className='cross'>x</div>
                      <div className='coupon_container1'>
                       <div className='pad10'>
                        <div><h2>Hooray!</h2></div>
                        <div className='coupon_rs'><h4>You've won {this.state.couponData?this.state.couponData[0].amount:''}</h4></div>
                        <div className='shop'>Shop for {this.state.couponData?this.state.couponData[0].amount:''} to redeem</div>
                        <div className='use_code'>
                          <div className='use_code_use'>USE CODE:
                             <div className='use_code_code'>{this.state.couponData?this.state.couponData[0].code:''}</div>
                            </div>
                          </div>
                        <div><h4>Details</h4></div>
                     <div className='details'>
                        <div className='margin'>1. You need to shop for {this.state.couponData?this.state.couponData[0].amount:''}/- and above within 24 hours to claim your coupon</div>
                        <div className='margin'>2. The transaction and the order delivery has to be completed succesfully for the user to be eligible for the coupon</div>
                        <div className='margin'>3. If the order is cancelled or modified then coupon will be revoked</div>
                     </div>   
                        <div className='grey_line'></div>
                        
                        <div className='coupon_expires'>Coupon Expires in : <div>5:00 HRS</div></div>
                        <div className='button_container'>
                        <button onClick={() => this.toggle(this.state.couponData[0].status)} className="button_red button_square">OK</button>
                        </div>
                       </div>


                      </div>
                   </div>

                  <div style={{display: this.state.cused===true? '' : 'none'}} className='couponused_container'>
                  <div onClick={() => this.toggle(this.state.couponData[0].status)} className='cross'>x</div>
                      <div className='couponused_background'>
                        <div><h2>Hey!</h2></div>
                        <div className='couponused_text1'>This coupon has been used</div>
                        <div className='couponused_text2'>Shake your phone now!</div>
                        <div className='button_container'>
                        <button onClick={() => this.toggle(this.state.couponData[0].status)} className="button_red button_width button_square">OK</button></div>
                      </div>
                  </div>

                <div style={{display: this.state.show===false? '' : 'none'}} className='coupon_container'>
                 { (this.state.cardcount.map((cardcount) => {
                      return (
                    
                      <div onClick={() => this.toggle(this.state.couponData[0].status)} className='card_container'>
                      <div><Card>
                            <CardImg top width="100%" height="70%" src={this.state.cexp===true?activecoupon:expiredcoupon} alt="Card image cap" />
                            <CardImgOverlay>
                              <div className='coupon_amount'>{this.state.couponData?this.state.couponData[0].amount:''}</div>
                              <div className='card_shopfor'>{this.state.couponData?this.state.couponData[0].instructions:''}</div>
                              <div className='card_couponcode'>COUPON CODE:{this.state.couponData?this.state.couponData[0].code:''}</div>
                              
                           </CardImgOverlay>
                         </Card>
                      </div><div className='card_footer'>{this.state.couponData?this.state.couponData[0].footer:''}</div></div>
                    
                    )}))}  
                    </div>

                      
                   </div>
            );
      }
}

export default withRouter(Coupon);