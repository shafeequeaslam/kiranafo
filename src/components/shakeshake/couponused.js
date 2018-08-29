import React, { Component } from 'react';
import './couponused.css'


class couponused extends Component {
      render() {
            return (
                  <div className='couponused_container'>
                      <div className='couponused_background'>
                        <div><h2>Hey!</h2></div>
                        <div className='couponused_text1'>This coupon has been used</div>
                        <div className='couponused_text2'>Shake your phone now!</div>
                        <div className='button_container'>
                        <button className="button_red button_width button_square">OK</button></div>
                      </div>
                  </div>
            );
      }
}

export default couponused;