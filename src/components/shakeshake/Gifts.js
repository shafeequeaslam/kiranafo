import React, { Component } from 'react';
import Axios from 'axios';
import activecoupon from './active-coupon.png';
import usedcoupon from './used-coupon.png';
import expiredcoupon from './expired-coupon.png';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button, CardImgOverlay } from 'reactstrap';
import activa from './activa5g.png';
import amazon from './amazonecho.png';
import './Gifts.css';
import notreg from './not-registered.jpg'
import reg from './registered-icon.jpg'
import exp from './expired-icon.jpg'

class Gifts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      giftcount: [],
      show: false,
      gexp: false,
      greg: false,
      gunreg: false
    };
  }

  toggle(id,index,type) {
    console.log(id,index,type)
    if (id == "Expired") {
      this.setState(prevState => ({
        gexp: !prevState.gexp,
        show: !prevState.show,
        giftIndex:index,
        giftType:type
      }));
    }

    else if (id == "Registered") {
      this.setState(prevState => ({
        greg: !prevState.greg,
        show: !prevState.show,
        giftIndex:index,
        giftType:type
      }));
    }
    else if (id == "Not Registered") {
      this.setState(prevState => ({
        gunreg: !prevState.gunreg,
        show: !prevState.show,
        giftIndex:index,
        giftType:type
      }));
    }
  }

  componentDidMount() {
    let usr = JSON.parse(localStorage.getItem('userDetails'));
    console.log(usr.user.uid);
    Axios({
      method: 'post',
      url: " https://us-central1-stgssave11.cloudfunctions.net/api/user/vouchers",
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        "uid": usr.user.uid
      }
    })
      .then((val) => {
        console.log(val.data);
        if (val.data != 'No vouchers for this user') {
          let vouchers = [];
          let dat = Object.values(val.data)
          for (let i = 0; i < dat.length; i++) {
            if (dat[i] != null) {
              vouchers.push(dat[i]);
            }

          }
          Axios({
            method: 'post',
            url: " https://us-central1-stgssave11.cloudfunctions.net/api/user/gift",
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
              "uid": usr.user.uid
            }
          })
            .then((value) => {
              if (value.data != 'No gifts for this user') {
                let gifts = [];
                let dat = Object.values(value.data)
                for (let i = 0; i < dat.length; i++) {
                  if (dat[i] != null) {
                    gifts.push(dat[i]);
                  }

                }


                let dataz = [...gifts, ...vouchers]
                let time_arr = []
                for (let i = 0; i<dataz.length; i++) {
                  let time = dataz[i];
                  console.log(time)
                  let addDay = new Date(time.timestamp);
                  addDay.getTime();
                  let presentDay = new Date();
                  presentDay.setDate(addDay.getDate() + 1);
                  presentDay.getTime();
                  let t = addDay - presentDay;
                  console.log(t);
                  // let days = Math.floor(t / (1000 * 60 * 60 * 24));
                  let hours = Math.abs(Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
                  let minutes = Math.abs(Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)));
                  let seconds = Math.abs(Math.floor((t % (1000 * 60)) / 1000));
                  // console.log(hours + ':' + minutes + ':' + seconds)
                  if (t > 0) {
                    time_arr.push('Expired')
                  }
                  else {
                    if (hours < 10) {
                      hours = '0' + hours
                    }
                    if (minutes < 10) {
                      minutes = '0' + minutes
                    }
                    if (seconds < 10) {
                      seconds = '0' + seconds
                    }

                        time_arr.push(hours + ':' + minutes + ':' + seconds)

                      }
                    }

                    setTimeout(() => {
                      this.setState({
                        giftData: dataz,
                        time_arr: time_arr
                      })
                    }, 100)

                  }
                })


        }




      })

      .catch((err) => {
        console.log(err.response);
      })

  }


  render() {
    return (
      <div>
        <div style={{ display: this.state.show === false ? '' : 'none' }} className='gift_container'>

          {this.state.giftData ? this.state.giftData.map((item, index) => {
            let dat;
            if (item.type == "voucher") {
              dat = item.voucher
            }
            else
              dat = item.gift
            console.log(dat.claimed)
            return (
              <div onClick={() => this.toggle(this.state.time_arr ? this.state.time_arr[index] != 'Expired' ?(item.claimed === "true" ? 'Registered':'Not Registered'):'Expired' : '',index,item.type)} className='gift_subcontainer'>
                <Card style={{filter:this.state.time_arr ? this.state.time_arr[index] == 'Expired'?'grayscale(100%)':'':''}}>
                  <CardImg top width="100%" height="125" src={dat.img} />
                  <CardBody>
                    <CardTitle className='cardtitle_unused'>Congratulations!</CardTitle>
                    <CardSubtitle className='card_subtitile'>You have won {dat.name}</CardSubtitle>
                    <CardText className='card_text' style={{color:this.state.time_arr ? this.state.time_arr[index] != 'Expired' ?(item.claimed === "true" ? 'green':'#f2ca83'):'' : '',borderColor:this.state.time_arr ? this.state.time_arr[index] != 'Expired' ?(item.claimed === "true" ? 'green':'#f2ca83'):'' : ''}}><img height="10px" src={this.state.time_arr ? this.state.time_arr[index] != 'Expired' ?(item.claimed === "true" ? reg:notreg):exp : ''} 
                    
                    />
                     {this.state.time_arr ? this.state.time_arr[index] != 'Expired' ?(item.claimed === "true" ? 'Registered':'Not Registered'):'Expired' : ''}</CardText>
                    <CardText className='card_text_click'>Click to know more</CardText>
                  </CardBody>
                </Card>
              </div>
            )
          }) : ''}
        </div>

        <div style={{ display: this.state.gunreg === true ? '' : 'none' }}>
          <div onClick={() => this.toggle()} className='cross'>x</div>

          <div className='coupon_container'>


            <div className='pad10'>
              <div><h2>Hooray!</h2></div>
              <div className='coupon_rs'><h4>You've won {this.state.giftData &&this.state.giftIndex && this.state.giftType ? this.state.giftData[this.state.giftIndex][this.state.giftType].name : ''}</h4></div>
              <div className='shop'>Shop for ₹{this.state.giftData && this.state.giftIndex ? this.state.giftData[this.state.giftIndex].min_value : '123'} to make it yours!</div>
              <div><h4>Details</h4></div>
              <div className='details'>
                <div className='margin'>1. You need to shop for ₹{this.state.giftData&&this.state.giftIndex && this.state.giftType ? this.state.giftData[this.state.giftIndex].min_value : ''}/- and above within 24 hours to claim your coupon</div>
                <div className='margin'>2. The transaction and the order delivery has to be completed succesfully for the user to be eligible for the coupon</div>
                <div className='margin'>3. If the order is cancelled or modified then coupon will be revoked</div>
              </div>
              <div className='grey_line'></div>

              <div className='coupon_expires'>Gift expires in {this.state.time_arr && this.state.giftIndex?this.state.time_arr[this.state.giftIndex]:""}</div>
              <div className='button_container'>
                <button onClick={() => this.toggle("Not registered")} className="button_red" style={{ borderRadius: '0px', width: '30%' }}>OK</button></div>
            </div>

          </div>

        </div>
        <div style={{ display: this.state.greg === true ? '' : 'none' }}>
          <div onClick={() => this.toggle("Registered")} className='cross'>x</div>
          <div className='coupon_container1'>
            <div className='pad10'>
              <div><h2>Hooray!</h2></div>
              <div className='coupon_rs'><h4>You've won {this.state.giftData &&this.state.giftIndex && this.state.giftType? this.state.giftData[this.state.giftIndex][this.state.giftType].name : ''}</h4></div>
              <div style={{ color: 'green' }}><h5>Yay!Your Reward is Confirmed</h5></div>
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
        <div style={{ display: this.state.gexp === true ? '' : 'none' }} className='couponused_container'>
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