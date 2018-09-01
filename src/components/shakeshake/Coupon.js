import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom'
import withRouter from 'react-router/withRouter';
import { Card, CardImg, CardText, CardBody, CardTitle, CardImgOverlay, CardSubtitle, Button } from 'reactstrap';
import activecoupon from './active-coupon.png';
import usedcoupon from './used-coupon.png';
import expiredcoupon from './expired-coupon.png';
import './Coupon.css';

class Coupon extends Component {
  constructor(props) {
    super(props);
    this.state = {

      show: false,
      cexp: false,
      cact: false,
      cused: false,
      gexp: false,
      greg: false,
      gunreg: false,
      activeIndex: 0

    };
  }

  toggle(id, index) {
    console.log(id, index);
    if (id == "Expired") {
      this.setState(prevState => ({
        cexp: !prevState.cexp,
        show: !prevState.show,
        activeIndex: index + 1
      }));
    }

    else if (id == "Active") {

      this.setState(prevState => ({
        cact: !prevState.cact,
        show: !prevState.show,
        activeIndex: index + 1
      }));
    }
    else if (id == "Consumed") {
      this.setState(prevState => ({
        cused: !prevState.cused,
        show: !prevState.show,
        activeIndex: index + 1
      }));
    }
  }

  componentWillMount() {
    let usr = JSON.parse(localStorage.getItem('userDetails'))
    console.log(this.props, "props, from 12121");
    Axios({
      method: 'get',
      url: "http://dev.dms.avenue11.com/api/v2/coupon/user?uid=" + usr.user.uid + "&agent=MOBILE&general=1",
      headers: {
        'Content-Type': 'application/json'
      },

    })
      .then((val) => {
        console.log(val.data)
        let time_arr = [];

        for (let i = 0; i < val.data.length; i++) {
          let index = val.data[i].created_on.indexOf(" ");
          let date = val.data[i].created_on.slice(0, index);
          console.log(date, '21212');
          let time = val.data[i].created_on.slice(index + 1);
          console.log(time)
          let hourData = time.split(":");
          let addData = [];
          for (let i = 0; i < hourData.length; i++) {
            addData.push(parseInt(hourData[i]));
          }

          console.log(addData)

          let addDay = new Date(date);

          addDay.setHours(addData[0], addData[1], addData[2])
          console.log(addDay, '11')
          addDay.getTime();
          let presentDay = new Date();
          presentDay.setDate(addDay.getDate() + 1);
          presentDay.getTime();
          let t = addDay - presentDay ;
          console.log(t)
          // let days = Math.floor(t / (1000 * 60 * 60 * 24));
          let hours = Math.abs(Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
          let minutes = Math.abs(Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)));
          let seconds = Math.abs(Math.floor((t % (1000 * 60)) / 1000));
          console.log(hours + ':' + minutes + ':' + seconds)
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
        console.log(time_arr)
        setTimeout(() => {
          this.setState({
            couponData: val.data,
            time_arr: time_arr
          })
        }, 500)

      })
      .catch((err) => {
        console.log(err);
      })
  }

  render() {
    return (

      <div>
        <div style={{ display: this.state.cexp === true ? '' : 'none' }} className='couponused_container'>
          <div onClick={() => this.toggle(this.state.couponData[this.state.activeIndex - 1].status)} className='cross'>x</div>
          <div className='couponused_background'>
            <div><h2>Hey!</h2></div>
            <div className='couponused_text1'>This coupon is expired</div>
            <div className='couponused_text2'>Shake your phone now!</div>
            <div className='button_container'>
              <button onClick={() => this.toggle(this.state.couponData[this.state.activeIndex - 1].status)} className="button_red button_width button_square">OK</button></div>
          </div>
        </div>


        <div style={{ display: this.state.cact === true ? '' : 'none' }}>
          <div onClick={() => this.toggle(this.state.couponData[this.state.activeIndex - 1].status)} className='cross'>x</div>
          <div className='coupon_container1'>
            <div className='pad10'>
              <div><h2>Hooray!</h2></div>
              <div className='coupon_rs'><h4>You've won {this.state.couponData && this.state.activeIndex ? this.state.couponData[this.state.activeIndex - 1].amount : ''}</h4></div>
              <div className='shop'>Shop for {this.state.couponData && this.state.activeIndex ? this.state.couponData[this.state.activeIndex - 1].amount : ''} to redeem</div>
              <div className='use_code'>
                <div className='use_code_use'>USE CODE:
                             <div className='use_code_code'>{this.state.couponData && this.state.activeIndex ? (this.state.couponData[this.state.activeIndex - 1].code) : ('', console.log(this.state.activeIndex))}</div>
                </div>
              </div>
              <div><h4>Details</h4></div>
              <div className='details'>
                <div className='margin'>1. You need to shop for {this.state.couponData && this.state.activeIndex ? this.state.couponData[this.state.activeIndex - 1].amount : ''}/- and above within 24 hours to claim your coupon</div>
                <div className='margin'>2. The transaction and the order delivery has to be completed succesfully for the user to be eligible for the coupon</div>
                <div className='margin'>3. If the order is cancelled or modified then coupon will be revoked</div>
              </div>
              <div className='grey_line'></div>

              <div className='coupon_expires'>Coupon Expires in  <div>{this.state.time_arr ? this.state.time_arr[this.state.activeIndex - 1] : '232'}</div></div>
              <div className='button_container'>
                <button onClick={() => this.toggle(this.state.couponData[this.state.activeIndex - 1].status)} className="button_red button_square">OK</button>
              </div>
            </div>


          </div>
        </div>



        <div style={{ display: this.state.cused === true ? '' : 'none' }} className='couponused_container'>
          <div onClick={() => this.toggle(this.state.couponData[this.state.activeIndex - 1].status)} className='cross'>x</div>
          <div className='couponused_background'>
            <div><h2>Hey!</h2></div>
            <div className='couponused_text1'>This coupon has been used</div>
            <div className='couponused_text2'>Shake your phone now!</div>
            <div className='button_container'>
              <button onClick={() => this.toggle(this.state.couponData[this.state.activeIndex - 1].status)} className="button_red button_width button_square">OK</button></div>
          </div>
        </div>

        <div style={{ display: this.state.show === false ? '' : 'none' }} className='coupon_container'>
          {this.state.couponData ? this.state.couponData.map((item, id) => {
            console.log(item)
            return (

              <div onClick={() => this.toggle(item.status, id)} className='card_container'>
                <div><Card>
                  <CardImg top width="100%" height="70%" src={item.status === 'Expired' ? expiredcoupon : (item.status === 'Consumed' ? usedcoupon : activecoupon)} alt="Card image cap" />
                  <CardImgOverlay>
                    <div className='coupon_amount'>{item.amount} </div>
                    <div className='card_shopfor'>{item.instructions} </div>
                    <div className='card_couponcode'>COUPON CODE:{item.code}</div>

                  </CardImgOverlay>
                </Card>
                </div><div className='card_footer'>{item.footer} </div></div>

            )
          }) : ''}
        </div>


      </div>
    );
  }
}

export default withRouter(Coupon);