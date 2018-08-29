import React, { Component } from 'react';
import activecoupon from './active-coupon.png';
import usedcoupon from './used-coupon.png';
import expiredcoupon from './expired-coupon.png';
import { Card, CardImg, CardText, CardBody,CardTitle, CardSubtitle, Button,CardImgOverlay } from 'reactstrap';
import activa from './activa5g.png';
import amazon from './amazonecho.png';
import './Gifts.css'

class Gifts extends Component {
      render() {
            return (
                 <div>
                      <div className='gift_container'>
                      <div className='gift_subcontainer'>
                      <Card>
                            <CardImg top width="100%" height="125" src={activa} alt="Card image cap" />
                            <CardBody>
                              <CardTitle className='cardtitle_unused'>Congratulations!</CardTitle>
                              <CardSubtitle className='card_subtitile'>You have won Activa 4G</CardSubtitle>
                              <CardText className='card_text'>Registered</CardText>
                              <CardText className='card_text_click'>Click to know more</CardText>
                            </CardBody>
                         </Card>
                      </div>
                      <div className='gift_container_expired'>
                      <Card>
                            <CardImg top width="100%" height="125" src={amazon} alt="Card image cap" />
                            <CardBody>
                              <CardTitle className='cardtitle_used'>Congratulations!</CardTitle>
                              <CardSubtitle className='card_subtitile'>You have won Amazon Echo</CardSubtitle>
                              <CardText className='card_textexpired'>Expired</CardText>
                              <CardText style={{color:'black'}}className='card_text_click'>Click to know more</CardText>
                              
                            </CardBody>
                         </Card>
                      </div>
                      </div>
                   </div>
            );
      }
}

export default Gifts;