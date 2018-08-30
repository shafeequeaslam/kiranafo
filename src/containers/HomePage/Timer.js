import React, { Component } from 'react';
import Axios from 'axios';

class Timer extends Component {
      constructor(props) {
            super(props);
            this.state = {
                  hr: '',
                  min: '',
                  secs: ''
            };
      }

      componentWillMount() {
            let time;
            Axios({
                  url:'https://d2.kirana11.com/kirana11_api/shocking_deal_timer.json',
                  method:'GET'
            })
            .then((res)=>{
                  time= res.data.scalar
            })
            .catch((err)=>{
                  console.log(err)
            })
            setInterval(() => {
                  let deadline = new Date(time).getTime();
                  let now = new Date().getTime();
                  let t = deadline - now;
                  let timer;
                  let days = Math.floor(t / (1000 * 60 * 60 * 24));
                  let hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                  let minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
                  let seconds = Math.floor((t % (1000 * 60)) / 1000);

                  // console.log(timer = hours + 'hr : ' + minutes + 'm : ' + seconds + 's')
                  if (minutes < 10) {
                        minutes = '0' + minutes
                  }
                  if (hours < 10) {
                        hours = '0' + hours
                  }
                  if (days < 10) {
                        days = '0' + days
                  }
                  if (seconds < 10) {
                        seconds = '0' + seconds
                  }
                  this.setState({
                        days: days,
                        hr: hours,
                        min: minutes,
                        secs: seconds
                  })



            }, 1000)
      }
      render() {
            return (
                  <div className="timer_container">
                        <div className="timer_wrpr">
                              <div className="timer_data"> {this.state.days}</div>
                              <div className="timer_desc">DAYS</div>
                        </div>
                        <div className="timer_wrpr">
                              <div className="timer_data"> {this.state.hr}</div>
                              <div className="timer_desc">HRS</div>
                        </div>
                        <div className="timer_wrpr">
                              <div className="timer_data"> {this.state.min}</div>
                              <div className="timer_desc">MIN</div>
                        </div>
                        <div className="timer_wrpr">
                              <div className="timer_data"> {this.state.secs}</div>
                              <div className="timer_desc">SECS</div>
                        </div>
                  </div>
            );
      }
}

export default Timer;