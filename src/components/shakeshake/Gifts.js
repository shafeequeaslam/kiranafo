import React, { Component } from 'react';
import Axios from 'axios';
import activecoupon from './active-coupon.png';
import usedcoupon from './used-coupon.png';
import expiredcoupon from './expired-coupon.png';
import { Card, CardImg, CardText, CardBody,CardTitle, CardSubtitle, Button,CardImgOverlay } from 'reactstrap';
import activa from './activa5g.png';
import amazon from './amazonecho.png';
import './Gifts.css';
import notreg from './not-registered.jpg'

class Gifts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      giftcount:[],
      show:false,
      gexp: false,
      greg: false, 
      gunreg:false
    };
  }

  toggle(id) {
    if(id =="Expired"){
    this.setState(prevState => ({
      gexp:!prevState.gexp,
      show:!prevState.show
    }));
  }

    else if(id =="Registered"){
    this.setState(prevState => ({
      greg:!prevState.greg,
      show:!prevState.show
    }));
  }
    else if(id =="Not registered"){
    this.setState(prevState => ({
      gunreg:!prevState.gunreg,
      show:!prevState.show
    }));
  }
}

 componentDidMount() {
  let usr = JSON.parse(localStorage.getItem('userDetails'));
  console.log(usr.user.uid);
        Axios({
                              method: 'post',
                              url: "https://us-central1-prodave11-2394b.cloudfunctions.net/api/user/gift",
                              headers: {
                                    'Content-Type': 'application/json'
                              },
                              data: {
                                    "uid": usr.user.uid
                              }
                        })
                              .then((val) => {
                                    console.log(val.data);
                                    this.setState({
                                          giftData: Object.values(val.data)
                                    })
                                    console.log(this.state.giftData[0].gift.description);
                                    console.log(Object.values(val.data)[0]);

                                    let time = Object.values(val.data);
                                    let addDay = new Date(time[0].timestamp);
                                     console.log(Object.values(val.data)[0].claimed);
                                    addDay.getTime();
                                    let presentDay = new Date();
                                    presentDay.setDate(addDay.getDate() + 1);
                                    presentDay.getTime();
                                    let t = presentDay-addDay;
                                    let timer;
                                    // let days = Math.floor(t / (1000 * 60 * 60 * 24));
                                    let hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                    let minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
                                    let seconds = Math.floor((t % (1000 * 60)) / 1000);
                                    
                                    if(t<0){
                                          this.setState({
                                          timer: "Expired"
                                    })
                                    }
                                  else if (Object.values(val.data)[0].claimed==="true")
                                   {
                                    timer: "Registered"

                                       }
                                    else {
                                    timer = hours + 'hr : ' + minutes + 'm : ' + seconds + 's';
                                    this.setState({
                                          timer: "Not registered",
                                          hours:hours,
                                          minutes:minutes,
                                          seconds:seconds

                                          })
                                  }

                                    console.log(addDay, presentDay,timer);
                                   
                              })
                              .catch((err) => {
                                    console.log(err);
                              })

    }


      render() {
            return (
                 <div>
                      <div style={{display: this.state.show===false? '' : 'none'}} className='gift_container'>

                    { this.state.giftData ? this.state.giftData.map((item,index) => {
                      return (
                      <div onClick={() => this.toggle(this.state.timer)} className='gift_subcontainer'>
                      <Card>
                            <CardImg top width="100%" height="125" src={item.gift.img}  />
                            <CardBody>
                              <CardTitle className='cardtitle_unused'>Congratulations!</CardTitle>
                              <CardSubtitle className='card_subtitile'>You have won {item.gift.name}</CardSubtitle>
                              <CardText className='card_text'><img height="10px" src={notreg} /> {this.state.timer}</CardText>
                              <CardText className='card_text_click'>Click to know more</CardText>
                            </CardBody>
                         </Card>
                      </div>
                     )
                     }):''}
                      </div>
                   
                <div style={{display: this.state.gunreg===true? '' : 'none'}}>
                <div onClick={() => this.toggle("Not registered")} className='cross'>x</div>
                  
                      <div className='coupon_container'>


                       <div className='pad10'>
                        <div><h2>Hooray!</h2></div>
                        <div className='coupon_rs'><h4>You've won {this.state.giftData?this.state.giftData[0].gift.name:''}</h4></div>
                        <div className='shop'>Shop for ₹{this.state.giftData?this.state.giftData[0].min_value:''} to make it yours!</div>
                        <div><h4>Details</h4></div>
                     <div className='details'>
                        <div className='margin'>1. You need to shop for ₹{this.state.giftData?this.state.giftData[0].min_value:''}/- and above within 24 hours to claim your coupon</div>
                        <div className='margin'>2. The transaction and the order delivery has to be completed succesfully for the user to be eligible for the coupon</div>
                        <div className='margin'>3. If the order is cancelled or modified then coupon will be revoked</div>
                     </div>   
                        <div className='grey_line'></div>
                        
                        <div className='coupon_expires'>Gift expires in {this.state.hours}:{this.state.minutes}:{this.state.seconds}</div>
                        <div className='button_container'>
                        <button onClick={() => this.toggle("Not registered")} className="button_red" style={{borderRadius:'0px', width: '30%' }}>OK</button></div>
                       </div>
                       
                      </div>

                  </div>
                  <div style={{display: this.state.greg===true? '' : 'none'}}>
                  <div onClick={() => this.toggle("Registered")} className='cross'>x</div>
                      <div className='coupon_container1'>
                       <div className='pad10'>
                        <div><h2>Hooray!</h2></div>
                        <div className='coupon_rs'><h4>You've won {this.state.giftData?this.state.giftData[0].gift.name:''}</h4></div>
                        <div style={{ color:'green'}}><h5>Yay!Your Reward is Confirmed</h5></div>
                      <div><h4>Details</h4></div>
                      <div className='details'>
                        <div className='margin'>1. Thank you for registering your reward.It will be available for collection after 15th September 2018</div>
                        <div className='margin'>2. The transaction and the order delivery has to be completed succesfully for the user to be eligible for the coupon</div>
                        <div className='margin'>3. If the order is cancelled or modified then coupon will be revoked</div>
                     </div>   
                       <div className='grey_line'></div>
                       <div className='registered'><h5>Registered</h5></div>
                       <div className='coupon_container1'>
                       <button onClick={() => this.toggle("Registered")} className="button_red button_square">OK</button></div>
                       </div>
                       </div>
                 </div>
                 <div style={{display: this.state.gexp===true? '' : 'none'}} className='couponused_container'>
                 <div onClick={() => this.toggle("Expired")} className='cross'>x</div>
                 
                      <div className='couponused_background'>
                        <div><h2>Hey!</h2></div>
                        <div className='couponused_text1'>This gift is expired</div>
                        <div className='couponused_text2'>Shake your phone now!</div>
                        <div className='button_container'>
                        <button onClick={() => this.toggle("Expired")} className="button_red button_width button_square">OK</button></div>
                      </div>
                  </div>




              </div>
            );
      }
}

export default Gifts;