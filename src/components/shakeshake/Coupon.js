import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import withRouter from 'react-router/withRouter';
import { Card, CardImg, CardText, CardBody,
  CardTitle,CardImgOverlay, CardSubtitle, Button } from 'reactstrap';
import activecoupon from './active-coupon.png';
import usedcoupon from './used-coupon.png';
import expiredcoupon from './expired-coupon.png';
import './Coupon.css';




class Coupon extends Component {
      
      render() {
            return (
                  <div>
                      <div className='coupon_container'>
                      <div className='card_container'>
                      <div><Card>
                            <CardImg top width="100%" height="70%" src={activecoupon} alt="Card image cap" />
                            <CardImgOverlay>
                              <div className='coupon_amount'>Rs.99</div>
                              <div className='card_shopfor'>Valid only on shopping of Rs.599</div>
                              <div className='card_couponcode'>COUPON CODE:A11SH99</div>
                              
                           </CardImgOverlay>
                         </Card>
                      </div><div className='card_footer'>Expires Today</div></div>
                      <div className='card_container'>
                      <div><Card>
                            <CardImg top width="100%" src={usedcoupon} alt="Card image cap" />
                            <CardImgOverlay>
                              <div className='coupon_amount'>Rs.55</div>
                              <div className='card_shopfor'>Valid only on shopping of Rs.599</div>
                              <div className='card_couponcode'>COUPON CODE:A11SH99</div>
                              
                           </CardImgOverlay>
                         </Card></div><div className='card_footer'>Used</div></div>
                      <div className='card_container'>
                      <div><Card>
                            <CardImg top width="100%" src={expiredcoupon} alt="Card image cap" />
                            <CardImgOverlay>
                              <div className='coupon_amount'>Rs.99</div>
                              <div className='card_shopfor'>Valid only on shopping of Rs.599</div>
                              <div className='card_couponcode'>COUPON CODE:A11SH99</div>
                              
                           </CardImgOverlay>
                         </Card>
                      </div><div className='card_footer'>Expired</div></div>
                      <div className='card_container'>
                      <div><Card>
                            <CardImg top width="100%" src={expiredcoupon} alt="Card image cap" />
                            <CardImgOverlay>
                              <div className='coupon_amount'>Rs.55</div>
                              <div className='card_shopfor'>Valid only on shopping of Rs.599</div>
                              <div className='card_couponcode'>COUPON CODE:A11SH99</div>
                              
                           </CardImgOverlay>
                         </Card>
                      </div><div className='card_footer'>Expired</div></div>
                      <div className='card_container'>
                      <div><Card>
                            <CardImg top width="100%" src={usedcoupon} alt="Card image cap" />
                            <CardImgOverlay>
                              <div className='coupon_amount'>Rs.99</div>
                              <div className='card_shopfor'>Valid only on shopping of Rs.599</div>
                              <div className='card_couponcode'>COUPON CODE:A11SH99</div>
                              
                           </CardImgOverlay>
                         </Card>
                      </div><div className='card_footer'>Expired</div></div>
                      <div className='card_container'>
                      <div><Card>
                            <CardImg top width="100%"  src={expiredcoupon} alt="Card image cap" />
                            <CardImgOverlay>
                              <div className='coupon_amount'>Rs.22</div>
                              <div className='card_shopfor'>Valid only on shopping of Rs.599</div>
                              <div className='card_couponcode'>COUPON CODE:A11SH99</div>
                              
                           </CardImgOverlay>
                         </Card>
                      </div><div className='card_footer'>Used</div></div>
                      <div className='card_container'>
                      <div><Card>
                            <CardImg top width="100%" src={expiredcoupon} alt="Card image cap" />
                            <CardImgOverlay>
                              <div className='coupon_amount'>Rs.22</div>
                              <div className='card_shopfor'>Valid only on shopping of Rs.599</div>
                              <div className='card_couponcode'>COUPON CODE:A11SH99</div>
                              
                           </CardImgOverlay>
                         </Card>
                      </div><div className='card_footer'>Expired</div></div>
                      <div className='card_container'>
                      <div><Card>
                            <CardImg top width="100%" src={expiredcoupon} alt="Card image cap" />
                            <CardImgOverlay>
                              <div className='coupon_amount'>Rs.55</div>
                              <div className='card_shopfor'>Valid only on shopping of Rs.599</div>
                              <div className='card_couponcode'>COUPON CODE:A11SH99</div>
                              
                           </CardImgOverlay>
                         </Card>
                      </div><div className='card_footer'>Expired</div></div>
                      </div>
                   </div>
            );
      }
}

export default withRouter(Coupon);